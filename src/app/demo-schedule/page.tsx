/*
 Это отдельная демонстрационная страница с сеткой из восьми карточек намазов.
 На десктопе четыре карточки в ряд, на планшете две, на телефоне одна.
 Каждая карточка показывает название молитвы и время на сегодня и завтра.
*/
import styles from "./page.module.css";

// Список намазов для примера
const prayers = [
  { key: "fajr", label: "Фаджр", today: "сегодня в 05:50", tomorrow: "завтра в 05:51" },
  { key: "sunrise", label: "Восход", today: "сегодня в 07:23", tomorrow: "завтра в 07:24" },
  { key: "dhuhr", label: "Зухр", today: "сегодня в 11:44", tomorrow: "завтра в 11:44" },
  { key: "asr", label: "Аср", today: "сегодня в 13:45", tomorrow: "завтра в 13:45" },
  { key: "maghrib", label: "Магриб", today: "сегодня в 16:03", tomorrow: "завтра в 16:03" },
  { key: "isha", label: "Иша", today: "сегодня в 17:37", tomorrow: "завтра в 17:37" },
  { key: "midnight", label: "Полночь", today: "сегодня в 23:43", tomorrow: "завтра в 23:44" },
  { key: "lastthird", label: "Последняя треть", today: "сегодня в 02:17", tomorrow: "завтра в 02:17" },
];

export default function DemoSchedulePage() {
  return (
    <main className={styles.page}>
      <section className={styles.cardBoard} aria-labelledby="demo-schedule-title">
        <p className={styles.eyebrow}>Расписание</p>
        <h1 id="demo-schedule-title" className={styles.title}>
          Время намазов: сегодня и завтра
        </h1>

        <div className={styles.grid}>
          {prayers.map((prayer) => (
            <article key={prayer.key} className={styles.card}>
              <span className={styles.chip}>{prayer.label}</span>
              <div className={styles.timeToday}>{prayer.today}</div>
              <div className={styles.timeTomorrow}>{prayer.tomorrow}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
