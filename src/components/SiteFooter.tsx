/*
 Это нижняя часть страницы с краткой подписью о сервисе и источнике данных.
 Посетитель видит бренд и ссылку на источник расписания.
*/
import styles from "./SiteFooter.module.css";
import { TranslationContent } from "../data/translations";

type Props = {
  translations: TranslationContent;
};

export default function SiteFooter({ translations }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>{translations.footerBrand}</div>
        <div className={styles.meta}>
          {translations.footerMeta} • <span aria-label="Current year">{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
