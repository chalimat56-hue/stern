/*
 Это страница вечерних азкаров с полным списком карточек.
 Здесь посетитель читает арабский текст, транслит и перевод, кнопки пока служат макетом для прослушивания и копирования.
 Пользователь может пролистать 24 вечерние дуа и выбрать нужную перед сном или после заката.
*/
"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Topbar from "../../components/Topbar";
import AzkarCard from "../../components/AzkarCard";
import { eveningAzkar } from "../../data/eveningAzkar";
import { translations, Language } from "../../data/translations";

// Полный список вечерних азкаров в исходном порядке
const eveningList = eveningAzkar;

export default function EveningAzkarPage() {
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
        {/* Вступительный блок о том, для чего эта подборка */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>{t.eveningEyebrow}</p>
          <h1 className={styles.title}>{t.eveningTitle}</h1>
          <p className={styles.lead}>{t.eveningLead}</p>
        </section>

        {/* Список карточек азкаров */}
        <section className={styles.listSection}>
          {eveningList.map((item) => (
            <AzkarCard key={item.id} item={item} translations={t} language={language} />
          ))}
        </section>
      </main>
    </div>
  );
}
