/*
 Это блок с карточками всех намазов.
 На каждой карточке только название, время на сегодня и время на завтра без лишних подписей.
 Когда данные ещё не пришли, остаются простые заглушки «--:--».
*/
import styles from "./PrayerGrid.module.css";
import { TranslationContent } from "../data/translations";
import { PrayerKey } from "../utils/nextPrayer";

type Props = {
  // Времена, полученные от сервиса или пустые, если запрос ещё не выполнен
  times: Record<string, string>;
  timesTomorrow?: Record<string, string>;
  timezone?: string;
  translations: TranslationContent;
};

// Список молитв и подписей, чтобы собрать карточки по порядку
const prayers: readonly PrayerKey[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Midnight", "LastThird"];

// Собираем строку «сегодня/завтра + время» в стиле мобильного приложения
const formatDisplay = (value: string | undefined, dayLabel: string) => {
  if (!value || value === "--:--") return "--:--";
  return `${dayLabel} ${value}`;
};

export default function PrayerGrid({ times, timesTomorrow, translations }: Props) {
  return (
    <section className={styles.section} id="prayer-block">
      <div className={styles.headRow}>
        <div>
          <p className={styles.eyebrow}>{translations.scheduleEyebrow}</p>
          <h2 className={styles.title}>{translations.scheduleTitle}</h2>
        </div>
      </div>

      <div className={styles.grid}>
        {prayers.map((prayerKey) => (
          <article key={prayerKey} className={`${styles.card} ${styles[`card${prayerKey}`]}`}>
            <div className={styles.titleRow}>
              <span className={`${styles.prayerChip} ${styles[`chip${prayerKey}`]}`}>
                {translations.prayerTitles[prayerKey] || prayerKey}
              </span>
            </div>
            <div className={styles.timeBlock}>
              <div className={styles.timeLine}>
                <span className={styles.time}>{formatDisplay(times[prayerKey], translations.todayLabel)}</span>
              </div>
              <div className={styles.timeLine}>
                <span className={styles.timeTomorrow}>
                  {formatDisplay(timesTomorrow?.[prayerKey], translations.tomorrowLabel)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
