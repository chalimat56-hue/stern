/*
 Это карточка с конкретным азкаром.
 Показывает арабский текст, транслитерацию, перевод и краткое примечание.
 Кнопка «Отметить чтение» уменьшает счётчик «Читать N раз», чтобы пользователь видел, сколько повторов осталось.
*/
import { useMemo, useState } from "react";
import styles from "./AzkarCard.module.css";
import { AzkarItem } from "../types/azkar";
import { Language, TranslationContent } from "../data/translations";

type Props = {
  item: AzkarItem;
  translations: TranslationContent;
  language: Language;
};

// Определяем, с какого числа стартует счётчик повторов
const parseRepeatCount = (value: string) => {
  const match = value.match(/(\d+)/);
  if (!match) return 1;
  const parsed = Number(match[1]);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export default function AzkarCard({ item, translations, language }: Props) {
  // Счётчик показывает, сколько повторов осталось выполнить
  const initialCount = useMemo(() => parseRepeatCount(item.repeat), [item.repeat]);
  const [remaining, setRemaining] = useState(initialCount);

  // Уменьшаем число повторов и не даём уйти в минус
  const handleDecrease = () => {
    setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Подпись под бейджем: либо остаток, либо пометка о выполнении
  const repeatLabel = remaining > 0 ? translations.azkarRemaining(remaining) : translations.azkarCompleted;

  // Текст перевода и примечания показываем на языке интерфейса, при отсутствии английского ставим заглушку
  const translationText =
    language === "en" ? item.translationEn || item.translation || "Translation pending" : item.translation || "—";
  const noteText =
    language === "en" ? item.noteEn || item.note : item.note;
  const sourceText =
    language === "en"
      ? item.sourceEn || (item.source?.replace(/^Источник:/i, "Source:") || item.source)
      : item.source;

  // Транслитерация на нужном языке
  const translitText = language === "en" ? item.translitEn || item.translit : item.translit;

  // Подпись повторов в нужной локали
  const repeatLabelBase =
    language === "en"
      ? initialCount === 1
        ? "Read 1 time"
        : `Read ${initialCount} times`
      : item.repeat;

  return (
    <article className={styles.card} id={`azkar-${item.id}`}>
      <div className={`${styles.repeat} ${remaining === 0 ? styles.repeatDone : ""}`}>
        {repeatLabelBase}
        <span className={styles.repeatNote}>{repeatLabel}</span>
      </div>
      <div className={styles.source}>{sourceText}</div>
      <div className={styles.arabic} lang="ar" dir="rtl">
        {item.arabic}
      </div>
      <div className={styles.translit}>{translitText}</div>
      <div className={styles.translation}>{translationText}</div>
      <div className={styles.actions}>
        <button type="button" className={styles.button}>
          {translations.azkarListen}
        </button>
        <button type="button" className={`${styles.button} ${styles.copyButton}`}>
          {translations.azkarCopy}
        </button>
        <button type="button" className={`${styles.button} ${styles.countButton}`} onClick={handleDecrease}>
          {remaining > 0 ? translations.azkarMark : translations.azkarDone}
        </button>
      </div>
      {noteText ? <div className={styles.note}>{noteText}</div> : null}
    </article>
  );
}
