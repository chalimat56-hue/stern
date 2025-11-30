/*
 Раздел с приглашением посетить страницы утренних и вечерних азкаров.
 Пользователь видит две карточки-ссылки: одну для утра, одну для вечера.
 При клике на карточку переходит на соответствующую страницу с текстами молитв.
*/
import styles from "./AzkarCta.module.css";
import { TranslationContent } from "../data/translations";

type Props = {
  translations: TranslationContent;
};

// Карточки-приглашения: куда можно перейти — утро или вечер
const cards = [
  { key: "morning", href: "/morning-azkar" },
  { key: "evening", href: "/evening-azkar" },
] as const;

export default function AzkarCta({ translations }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>{translations.azkarEyebrow}</p>
        <h2 className={styles.title}>{translations.azkarTitle}</h2>
        <p className={styles.text}>{translations.azkarText}</p>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <a key={card.href} className={styles.card} href={card.href}>
            <div className={styles.cardLabel}>
              {card.key === "morning" ? translations.azkarMorningLabel : translations.azkarEveningLabel}
            </div>
            <div className={styles.cardTitle}>
              {card.key === "morning" ? translations.azkarMorningTitle : translations.azkarEveningTitle}
            </div>
            <div className={styles.cardAction}>{translations.azkarAction}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
