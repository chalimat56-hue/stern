/*
 Главный блок приложения встречает пользователя прямо при входе.
 Здесь можно выбрать свою страну и город, чтобы получить расписание намазов.
 Справа (на десктопе) или сверху (на мобильном) видна карточка ближайшего намаза с обратным отсчётом.
 Все выбранные данные автоматически обновляют расписание на странице и таймер.
*/
"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./HeroSection.module.css";
import NextPrayerCard from "./NextPrayerCard";
import { CountryOption } from "../data/locationOptions";
import { TranslationContent } from "../data/translations";

type Props = {
  country: string;
  city: string;
  countryOptions: CountryOption[];
  onLocationChange: (country: string, city: string) => void;
  times: Record<string, string>;
  timesTomorrow?: Record<string, string>;
  methodName: string;
  locationLabel: string;
  timezone?: string;
  loading?: boolean;
  status?: string;
  translations: TranslationContent;
};

export default function HeroSection({
  country,
  city,
  countryOptions,
  onLocationChange,
  times,
  timesTomorrow,
  methodName,
  locationLabel,
  timezone,
  loading,
  status,
  translations,
}: Props) {
  // Вращающиеся фоновые кадры: используем готовые изображения из assets
  const heroImages = [
    { src: "/assets/sky-sunrise.jpg", alt: "Рассвет над мечетью" },
    { src: "/assets/sky-sunset.jpg", alt: "Закат над минаретами" },
    { src: "/assets/sky-night.jpg", alt: "Ночное небо" },
    { src: "/assets/sky-twilight.jpg", alt: "Сумерки" },
    { src: "/assets/sky-moon.jpg", alt: "Луна над небом" },
  ];

  const [activeBackdrop, setActiveBackdrop] = useState(0);

  // Готовим список городов для выбранной страны, чтобы показать в выпадающем списке
  const cities = useMemo(
    () => countryOptions.find((item) => item.value === country)?.cities || [],
    [country, countryOptions],
  );

  // Если меняется страна, подставляем первый доступный город и сразу перезапрашиваем данные
  const handleCountryChange = (value: string) => {
    const targetCities = countryOptions.find((item) => item.value === value)?.cities || [];
    const nextCity = targetCities.find((entry) => entry.value === city)?.value || targetCities[0]?.value || "";
    if (nextCity) {
      onLocationChange(value, nextCity);
    }
  };

  // Если меняется город, сразу отправляем выбранную пару выше
  const handleCityChange = (value: string) => {
    if (!value) return;
    onLocationChange(country, value);
  };

  // Меняем фоновые фото каждые несколько секунд, чтобы фон оставался живым
  useEffect(() => {
    if (heroImages.length < 2) return;
    const timer = setInterval(() => {
      setActiveBackdrop((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section className={styles.heroSection}>
      <div className={styles.backdrops} aria-hidden="true">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className={styles.backdrop}
            data-active={index === activeBackdrop}
            style={{ backgroundImage: `url(${image.src})` }}
            role="presentation"
          />
        ))}
        <div className={styles.overlayLayer} />
      </div>
      <div className={styles.container}>
        <div className={`${styles.heroCard} ${styles.selectorCard}`}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>{translations.heroTitle}</h2>
            <p className={styles.cardSubtitle}>{translations.heroSubtitle}</p>
          </div>
          <form className={styles.selectorForm} aria-label="Выбор страны и города">
            <div className={styles.field}>
              <label className={styles.label} htmlFor="hero-country">
                {translations.selectCountry}
              </label>
              <select
                className={styles.select}
                id="hero-country"
                name="hero-country"
                value={country}
                onChange={(event) => handleCountryChange(event.target.value)}
                disabled={loading}
              >
                <option value="">Выберите страну</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="hero-city">
                {translations.selectCity}
              </label>
              <select
                className={styles.select}
                id="hero-city"
                name="hero-city"
                value={city}
                onChange={(event) => handleCityChange(event.target.value)}
                disabled={!country || loading || !cities.length}
              >
                <option value="">{country ? translations.cityPlaceholder : translations.cityPlaceholderEmpty}</option>
                {cities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.contextLine}>
              {translations.contextLabel}: {locationLabel || "—"}
            </div>

            <div className={styles.status} aria-live="polite">
              {loading ? translations.statusLoading : status || translations.statusDetecting}
            </div>
          </form>
        </div>

        <NextPrayerCard
          times={times}
          timesTomorrow={timesTomorrow}
          methodName={methodName}
          locationLabel={locationLabel}
          timezone={timezone}
          translations={translations}
        />
      </div>
    </section>
  );
}
