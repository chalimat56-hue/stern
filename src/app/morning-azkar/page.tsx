/*
 Это страница утренних азкаров с полным списком карточек.
 Здесь посетитель читает арабский текст, транслит и перевод, может скопировать или прослушать (кнопки пока без логики).
 Пользователь может пролистать 24 карточки подряд и выбрать нужную дуа для утра.
*/
"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Topbar from "../../components/Topbar";
import AzkarCard from "../../components/AzkarCard";
import { morningAzkar } from "../../data/morningAzkar";
import { translations, Language } from "../../data/translations";

// Полный список утренних азкаров в исходном порядке
const morningList = morningAzkar;

export default function MorningAzkarPage() {
  const getStoredLanguage = () => {
    if (typeof window === "undefined") return "ru";
    const saved = localStorage.getItem("preferredLanguage");
    return saved === "ru" || saved === "en" ? (saved as Language) : "ru";
  };

  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", language);
    }
  }, [language]);
  const t = translations[language];

  return (
    <div className={styles.page}>
      <Topbar language={language} translations={t} onLanguageChange={setLanguage} />
      <main className={styles.main}>
        {/* Вступительный блок с объяснением, что за подборка перед пользователем */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>{t.morningEyebrow}</p>
          <h1 className={styles.title}>{t.morningTitle}</h1>
          <p className={styles.lead}>{t.morningLead}</p>
        </section>

        {/* Сетка карточек с азкарами */}
        <section className={styles.listSection}>
          {morningList.map((item) => (
            <AzkarCard key={item.id} item={item} translations={t} language={language} />
          ))}
        </section>
      </main>
    </div>
  );
}
