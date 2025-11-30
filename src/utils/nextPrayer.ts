import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

export type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" | "Midnight" | "LastThird" | "Qiyam";

export type NextPrayer = {
  key: PrayerKey;
  time: string;
  target: Dayjs;
  day: "today" | "tomorrow";
};

const order: PrayerKey[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "LastThird", "Qiyam"];

function makeMoment(base: Dayjs, time: string, dayOffset: number, timezone: string) {
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return dayjs.tz(base.format("YYYY-MM-DD"), timezone).add(dayOffset, "day").hour(hh).minute(mm).second(0).millisecond(0);
}

export function getNextPrayer(
  now: Dayjs,
  todayTimes: Record<string, string>,
  tomorrowTimes: Record<string, string>,
  timezone: string,
): NextPrayer | null {
  const candidates: NextPrayer[] = [];
  const baseToday = now.tz(timezone);

  order.forEach((key) => {
    const todayValue = todayTimes[key];
    if (todayValue) {
      const moment = makeMoment(baseToday, todayValue, 0, timezone);
      if (moment && moment.isAfter(now)) {
        candidates.push({ key, time: todayValue, target: moment, day: "today" });
      }
    }
  });

  if (!candidates.length) {
    order.forEach((key) => {
      const tomorrowValue = tomorrowTimes[key];
      if (tomorrowValue) {
        const moment = makeMoment(baseToday, tomorrowValue, 1, timezone);
        if (moment) {
          candidates.push({ key, time: tomorrowValue, target: moment, day: "tomorrow" });
        }
      }
    });
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => a.target.valueOf() - b.target.valueOf());
  return candidates[0];
}
