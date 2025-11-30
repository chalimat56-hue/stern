/*
 Это карточка с конкретным азкаром.
 Показывает арабский текст, транслитерацию, перевод и краткое примечание.
 Кнопка «Отметить чтение» уменьшает счётчик «Читать N раз», чтобы пользователь видел, сколько повторов осталось.
*/
import { useState } from "react";
import styles from "./AzkarCard.module.css";
import { AzkarItem } from "../types/azkar";

type Props = {
  item: AzkarItem;
};

// Определяем, с какого числа стартует счётчик повторов
const parseRepeatCount = (value: string) => {
  const match = value.match(/(\d+)/);
  if (!match) return 1;
  const parsed = Number(match[1]);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export default function AzkarCard({ item }: Props) {
  // Счётчик показывает, сколько повторов осталось выполнить
  const [remaining, setRemaining] = useState(() => parseRepeatCount(item.repeat));

  // Уменьшаем число повторов и не даём уйти в минус
  const handleDecrease = () => {
    setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Подпись под бейджем: либо остаток, либо пометка о выполнении
  const repeatLabel = remaining > 0 ? `Remaining ${remaining} times` : "Reading completed";

  return (
    <article className={styles.card} id={`azkar-${item.id}`}>
      <div className={`${styles.repeat} ${remaining === 0 ? styles.repeatDone : ""}`}>
        {item.repeat}
        <span className={styles.repeatNote}>{repeatLabel}</span>
      </div>
      <div className={styles.source}>{item.source}</div>
      <div className={styles.arabic} lang="ar" dir="rtl">
        {item.arabic}
      </div>
      <div className={styles.translit}>{item.translit}</div>
      <div className={styles.translation}>{item.translation}</div>
      <div className={styles.actions}>
        <button type="button" className={styles.button}>
          Listen
        </button>
        <button type="button" className={`${styles.button} ${styles.copyButton}`}>
          Copy
        </button>
        <button type="button" className={`${styles.button} ${styles.countButton}`} onClick={handleDecrease}>
          {remaining > 0 ? "Mark reading" : "Done"}
        </button>
      </div>
      {item.note ? <div className={styles.note}>{item.note}</div> : null}
    </article>
  );
}
