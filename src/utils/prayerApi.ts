/*
 Получаем время намазов на сегодня и завтра через Aladhan по координатам.
 Все время сразу приводим к аккуратному строковому формату.
*/
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

const prayerKeys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Midnight", "LastThird"] as const;

export type PrayerTimesResponse = {
  timesToday: Record<string, string>;
  timesTomorrow: Record<string, string>;
  methodName: string;
  timezone: string;
};

const cleanupTime = (value: string | undefined) => {
  if (!value) return "--:--";
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return "--:--";
  const hours = match[1].padStart(2, "0");
  const minutes = match[2];
  return `${hours}:${minutes}`;
};

const formatWithTimezone = (value: string, base: dayjs.Dayjs, timezone: string) => {
  const cleaned = cleanupTime(value);
  if (cleaned === "--:--") return cleaned;
  const [hh, mm] = cleaned.split(":").map(Number);
  const moment = dayjs.tz(base.format("YYYY-MM-DD"), timezone).hour(hh).minute(mm).second(0).millisecond(0);
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(moment.toDate());
};

const normalizeTimings = (raw: Record<string, string>, base: dayjs.Dayjs, timezone: string) => {
  const normalized: Record<string, string> = {};
  prayerKeys.forEach((key) => {
    if (key === "LastThird") {
      normalized[key] = formatWithTimezone(raw["Last third"] || raw["LastThird"] || raw["Lastthird"], base, timezone);
    } else {
      normalized[key] = formatWithTimezone(raw[key], base, timezone);
    }
  });
  return normalized;
};

export async function fetchPrayerTimes(params: {
  latitude: number;
  longitude: number;
  timezone?: string;
  method?: string;
}): Promise<PrayerTimesResponse> {
  const targetTimezone = params.timezone || dayjs.tz.guess();
  const today = dayjs().tz(targetTimezone);
  const tomorrow = today.add(1, "day");

  const baseParams = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    method: params.method || "2",
  });

  if (targetTimezone) {
    baseParams.set("timezonestring", targetTimezone);
  }

  const todayUrl = `https://api.aladhan.com/v1/timings/${today.format("DD-MM-YYYY")}?${baseParams.toString()}`;
  const tomorrowUrl = `https://api.aladhan.com/v1/timings/${tomorrow.format("DD-MM-YYYY")}?${baseParams.toString()}`;

  const [todayRes, tomorrowRes] = await Promise.all([fetch(todayUrl), fetch(tomorrowUrl)]);

  if (!todayRes.ok || !tomorrowRes.ok) {
    throw new Error("Сервис Aladhan вернул ошибку при получении расписания.");
  }

  const [todayData, tomorrowData] = await Promise.all([todayRes.json(), tomorrowRes.json()]);

  const methodName = todayData?.data?.meta?.method?.name || "По умолчанию";
  const apiTimezone = todayData?.data?.meta?.timezone || targetTimezone;
  const timesToday = normalizeTimings(todayData?.data?.timings || {}, today, apiTimezone);
  const timesTomorrow = normalizeTimings(tomorrowData?.data?.timings || {}, tomorrow, apiTimezone);

  return {
    timesToday,
    timesTomorrow,
    methodName,
    timezone: apiTimezone,
  };
}
