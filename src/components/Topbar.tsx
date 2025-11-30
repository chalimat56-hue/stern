/*
 Шапка приложения noxchiPro с логотипом, навигацией и языковым переключателем.
 На десктопе видны все ссылки (Утренние азкары, Вечерние азкары, Расписание).
 На мобильных устройствах (< 768px) меню прячется в гамбургер-кнопку с плавной анимацией.
 Пользователь может в любой момент переключить язык между русским и английским.
*/
"use client";

import { useState } from "react";
import styles from "./Topbar.module.css";
import Link from "next/link";
import { TranslationContent, Language } from "../data/translations";

type Props = {
  language: Language;
  translations: TranslationContent;
  onLanguageChange: (lang: Language) => void;
};

export default function Topbar({ language, translations, onLanguageChange }: Props) {
  // Состояние гамбургер-меню: открыто (true) или закрыто (false)
  const [menuOpen, setMenuOpen] = useState(false);

  // Список ссылок навигации для всех страниц
  const navLinks = [
    { label: translations.navMorning, href: "/morning-azkar" },
    { label: translations.navEvening, href: "/evening-azkar" },
    { label: translations.navSchedule, href: "/#prayer-block" },
  ];

  // Закрыть меню при клике на ссылку
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.container}>
        {/* Логотип приложения "noxchiPro" с ссылкой на главную */}
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark} aria-hidden="true" />
          <span className={styles.brandName}>noxchiPro</span>
        </Link>

        {/* Полноценная навигация на десктопе, прячется на мобильных */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Основная навигация">
          {navLinks.map((link) => (
            <Link key={link.href} className={styles.navLink} href={link.href} onClick={handleNavClick}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Правая часть: кнопка переключения языка и гамбургер-меню */}
        <div className={styles.controls}>
          {/* Кнопка переключения языка */}
          <button
            className={styles.langButton}
            type="button"
            aria-label={translations.languageLabel}
            onClick={() => onLanguageChange(language === "ru" ? "en" : "ru")}
          >
            {translations.languageSwitch}
          </button>

          {/* Гамбургер-кнопка: видна только на мобильных (<768px) */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
            type="button"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      {/* Полупрозрачный оверлей при открытом мобильном меню, закрывает меню при клике */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
