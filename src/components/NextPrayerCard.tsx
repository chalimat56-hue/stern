/*
 Карточка ближайшего намаза показывает, когда он наступит, и считает время до его начала.
 Пользователь видит название молитвы (Фаджр, Зухр и т.д.), время наступления (сегодня или завтра) и живой таймер.
 Когда наступает время молитвы, карточка автоматически переходит на следующий намаз.
*/
"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
import styles from "./NextPrayerCard.module.css";
import { getNextPrayer, NextPrayer } from "../utils/nextPrayer";
import { formatCountdown } from "../utils/timeFormatting";
import { TranslationContent } from "../data/translations";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

type Props = {
  times: Record<string, string>;
  timesTomorrow?: Record<string, string>;
  timezone?: string;
  locationLabel: string;
  methodName: string;
  translations: TranslationContent;
};

export default function NextPrayerCard({ times, timesTomorrow, timezone, locationLabel, methodName, translations }: Props) {
  const tz = timezone || dayjs.tz.guess();
  const [currentNext, setCurrentNext] = useState<NextPrayer | null>(null);
  const [countdown, setCountdown] = useState("00:00:00");

  // Пересчитываем ближайший намаз, когда меняются времена или таймзона
  const recompute = useMemo(
    () => () => getNextPrayer(dayjs().tz(tz), times, timesTomorrow || {}, tz),
    [times, timesTomorrow, tz],
  );

  useEffect(() => {
    setCurrentNext(recompute());
  }, [recompute]);

  // Запускаем секундный таймер, который показывает, сколько времени осталось
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const referenceNext = currentNext || recompute();
      if (!referenceNext) {
        setCountdown("00:00:00");
        return;
      }
      const now = dayjs().tz(tz);
      const diff = referenceNext.target.valueOf() - now.valueOf();
      if (diff <= 0) {
        const updated = recompute();
        setCurrentNext(updated);
        setCountdown(updated ? formatCountdown(updated.target.valueOf() - now.valueOf()) : "00:00:00");
        return;
      }
      setCountdown(formatCountdown(diff));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [currentNext, recompute, tz]);

  return (
    <div className={styles.card} aria-live="polite">
      <div className={styles.cardLabel}>{translations.nearestTitle}</div>
      <h2 className={styles.cardTitle}>
        {currentNext ? translations.prayerTitles[currentNext.key] || currentNext.key : "—"}
      </h2>
      <div className={styles.cardTimer}>
        {currentNext
          ? `${currentNext.day === "today" ? translations.todayLabel : translations.tomorrowLabel} ${currentNext.time}`
          : translations.nearestPending}
      </div>
      <div className={styles.cardCountdown}>
        {currentNext ? `${translations.countdownPrefix} ${countdown}` : "--:--:--"}
      </div>
      <div className={styles.cardMeta}>
        {locationLabel ? `${translations.selectCity}: ${locationLabel}` : translations.nearestCityMissing}
        <br />
        {translations.methodLabel}: {methodName || "—"}
        <br />
        {translations.timezoneLabel}: {tz}
      </div>
    </div>
  );
}
