/*
 Это главная страница расписания намазов.
 Здесь сразу сверху два поля выбора страны и города, а рядом карточка ближайшего намаза с таймером.
 После смены города обновляются карточки на странице: времена на сегодня, завтра и отсчёт до следующей молитвы.
*/
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import Topbar from "../components/Topbar";
import HeroSection from "../components/HeroSection";
import PrayerGrid from "../components/PrayerGrid";
import AzkarCta from "../components/AzkarCta";
import SiteFooter from "../components/SiteFooter";
import { countryOptions, getLocalizedCountries, matchCountryCity } from "../data/locationOptions";
import { detectBestLocation, fallbackPlace, resolveCityCoordinates } from "../utils/locationDetection";
import { fetchPrayerTimes } from "../utils/prayerApi";
import { translations, Language } from "../data/translations";

type PrayerTimes = Record<string, string>;

export default function Home() {
  // Времена намазов для выбранного города
  const [timesToday, setTimesToday] = useState<PrayerTimes>({});
  const [timesTomorrow, setTimesTomorrow] = useState<PrayerTimes>({});
  const [methodName, setMethodName] = useState("Ум Аль-Кура (по умолчанию)");
  const [locationLabel, setLocationLabel] = useState(fallbackPlace.label);
  const [timezone, setTimezone] = useState(fallbackPlace.timezone);
  const [selectedCountry, setSelectedCountry] = useState(fallbackPlace.country);
  const [selectedCity, setSelectedCity] = useState(fallbackPlace.city);
  const [coordinates, setCoordinates] = useState({ latitude: fallbackPlace.latitude, longitude: fallbackPlace.longitude });
  const [loading, setLoading] = useState(false);
  const [statusKind, setStatusKind] = useState<"detecting" | "loading" | "ready" | "error" | "">("");
  const [statusLabel, setStatusLabel] = useState("");
  const getStoredLanguage = () => {
    if (typeof window === "undefined") return "ru";
    const saved = localStorage.getItem("preferredLanguage");
    return saved === "ru" || saved === "en" ? (saved as Language) : "ru";
  };

  const [language, setLanguage] = useState<Language>(getStoredLanguage);
  const [geoError, setGeoError] = useState("");
  const [geoDone, setGeoDone] = useState(false);

  // Локализованный список стран и городов для текущего языка
  const localizedOptions = useMemo(() => getLocalizedCountries(language), [language]);

  // Сохраняем язык в localStorage, чтобы переключатель работал одинаково на всех страницах
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", language);
    }
  }, [language]);

  // Строим человекочитаемую подпись выбранного города на нужном языке
  const buildLabel = useCallback((country: string, city: string) => {
    const countryLabel = localizedOptions.find((item) => item.value === country)?.label || country;
    const cityLabel = localizedOptions.find((item) => item.value === country)?.cities.find((item) => item.value === city)?.label || city;
    return cityLabel && countryLabel ? `${cityLabel}, ${countryLabel}` : cityLabel || countryLabel || "—";
  }, [localizedOptions]);

  const t = translations[language];
  const statusText =
    statusKind === "loading"
      ? t.statusLoading
      : statusKind === "ready"
        ? t.statusReady(statusLabel)
        : statusKind === "error"
          ? t.statusError
          : t.statusDetecting;

  const parseMinutes = (value?: string) => {
    if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
    const [h, m] = value.split(":").map(Number);
    return h * 60 + m;
  };

  const nowMinutes = (() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  })();

  const fajr = parseMinutes(timesToday.Fajr);
  const sunrise = parseMinutes(timesToday.Sunrise);
  const asr = parseMinutes(timesToday.Asr);
  const maghrib = parseMinutes(timesToday.Maghrib);

  const isMorningWindow = fajr !== null && sunrise !== null && nowMinutes >= fajr && nowMinutes < sunrise;
  const isEveningWindow = asr !== null && maghrib !== null && nowMinutes >= asr && nowMinutes < maghrib;

  const showMorning = isMorningWindow;
  const showEvening = isEveningWindow;

  const azkarPrompt = showEvening
    ? { href: "/evening-azkar", label: language === "en" ? "Evening adhkar — read now" : "Вечерние азкары — открыть" }
    : showMorning
      ? { href: "/morning-azkar", label: language === "en" ? "Morning adhkar — start now" : "Утренние азкары — открыть" }
      : null;

  // Запрашиваем время намазов для выбранных координат и сохраняем всё, что нужно для карточек
  const loadForLocation = async (
    latitude: number,
    longitude: number,
    tz: string,
    label: string,
    shouldCancel?: () => boolean,
  ) => {
    setLoading(true);
    setStatusKind("loading");
    setStatusLabel(label);
    try {
      const response = await fetchPrayerTimes({ latitude, longitude, timezone: tz });
      if (shouldCancel?.()) return;
      setTimesToday(response.timesToday);
      setTimesTomorrow(response.timesTomorrow);
      setMethodName(response.methodName);
      setTimezone(response.timezone || tz);
      setLocationLabel(label);
      setCoordinates({ latitude, longitude });
      setStatusKind("ready");
      setStatusLabel(label);
    } catch (error) {
      console.error("Не получилось загрузить время намазов:", error);
      setStatusKind("error");
    } finally {
      if (!shouldCancel?.()) {
        setLoading(false);
      }
    }
  };

  // Когда пользователь меняет страну или город — находим координаты и перезапрашиваем расписание
  const handleLocationChange = async (countryValue: string, cityValue: string) => {
    const label = buildLabel(countryValue, cityValue);
    setSelectedCountry(countryValue);
    setSelectedCity(cityValue);
    const coords = await resolveCityCoordinates(countryValue, cityValue, {
      ...fallbackPlace,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      timezone,
      label,
    });
    await loadForLocation(coords.latitude, coords.longitude, coords.timezone, label);
  };

  // При первом заходе пытаемся определить город автоматически и сразу загружаем его расписание
  useEffect(() => {
    let cancelled = false;
    if (geoDone) return undefined;

    const init = async () => {
      setStatusKind("detecting");
      const detected = await detectBestLocation(localizedOptions);
      if (cancelled || geoDone) return;
      setSelectedCountry(detected.country);
      setSelectedCity(detected.city);
      setTimezone(detected.timezone);
      setLocationLabel(detected.label);
      await loadForLocation(detected.latitude, detected.longitude, detected.timezone, detected.label, () => cancelled || geoDone);
    };

    init().catch(async () => {
      if (!cancelled && !geoDone) {
        const fallbackLabel = buildLabel(fallbackPlace.country, fallbackPlace.city);
        await loadForLocation(
          fallbackPlace.latitude,
          fallbackPlace.longitude,
          fallbackPlace.timezone,
          fallbackLabel,
          () => cancelled || geoDone,
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [localizedOptions, geoDone]);

  // При смене языка обновляем подпись выбранного города, чтобы она отображалась на актуальном языке
  useEffect(() => {
    const label = buildLabel(selectedCountry, selectedCity);
    setLocationLabel(label);
    if (statusKind === "ready" || statusKind === "loading") {
      setStatusLabel(label);
    }
  }, [language, selectedCountry, selectedCity, statusKind, buildLabel]);

  // Здесь язык независим для этой страницы; запоминаем только в состоянии страницы

  // Автоматическая загрузка через браузерную геолокацию (Aladhan API) и попытка синхронизировать дропдауны
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Geolocation is not available in this browser.");
      return;
    }

    const reverseGeocode = async (latitude: number, longitude: number) => {
      try {
        const resp = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        );
        if (!resp.ok) return null;
        const data = await resp.json();
        return {
          country: data?.countryCode || data?.countryName || "",
          city: data?.city || data?.locality || data?.principalSubdivision || "",
        };
      } catch (error) {
        console.warn("Reverse geocode failed", error);
        return null;
      }
    };

    setStatusKind("detecting");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setStatusKind("loading");
          const { latitude, longitude } = pos.coords;
          const geoMatch = await reverseGeocode(latitude, longitude);
          if (geoMatch) {
            const matched = matchCountryCity(geoMatch.country, geoMatch.city);
            if (matched?.country) {
              setSelectedCountry(matched.country);
              if (matched.city) {
                setSelectedCity(matched.city);
                const label = buildLabel(matched.country, matched.city);
                const timezone = (geoMatch as any)?.timezone || fallbackPlace.timezone;
                await loadForLocation(latitude, longitude, timezone, label);
                setStatusLabel(label);
                setGeoDone(true);
                return;
              }
            }
          }

          const fallbackLabel = buildLabel(fallbackPlace.country, fallbackPlace.city);
          await loadForLocation(latitude, longitude, fallbackPlace.timezone, fallbackLabel);
          setGeoDone(true);
        } catch (error) {
          console.error(error);
          setGeoError("Could not load prayer times for your location.");
          setStatusKind("error");
        }
      },
      (geoErr) => {
        console.warn("Geolocation error", geoErr);
        setGeoError("Location permission denied or unavailable.");
        setStatusKind("error");
      },
      { timeout: 8000 },
    );
  }, [buildLabel]);

  return (
    <div className={styles.page}>
      {/* Основной контейнер страницы: собирает секции по порядку */}
      <Topbar language={language} translations={t} onLanguageChange={setLanguage} />
      <main className={styles.main}>
        {/* Первый экран с выбором города и карточкой ближайшего намаза */}
        <HeroSection
          country={selectedCountry}
          city={selectedCity}
          onLocationChange={handleLocationChange}
          countryOptions={localizedOptions}
          methodName={methodName}
          locationLabel={locationLabel}
          times={timesToday}
          timesTomorrow={timesTomorrow}
          timezone={timezone}
          loading={loading}
          status={statusText}
          translations={t}
        />
        {azkarPrompt ? (
          <section className={styles.azkarPromptHero} aria-label="Рекомендация азкаров">
            <a className={styles.azkarPromptButton} href={azkarPrompt.href}>
              {azkarPrompt.label}
            </a>
          </section>
        ) : null}
        {/* Сетка карточек с временем намазов */}
        <PrayerGrid times={timesToday} timesTomorrow={timesTomorrow} timezone={timezone} translations={t} />
        {/* Блок приглашения к утренним и вечерним азкарам */}
        <AzkarCta translations={t} />
        {geoError ? <p aria-live="polite">{geoError}</p> : null}
      </main>
      <SiteFooter translations={t} />
    </div>
  );
}
