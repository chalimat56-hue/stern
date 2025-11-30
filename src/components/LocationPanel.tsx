/*
 Этот блок помогает выбрать страну и город и получить актуальное расписание.
 Здесь только форма: человек выбирает страну и город, отправляет запрос и видит статус.
 После отправки формы показываем статус запроса и передаём новые времена выше по дереву.
*/
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./LocationPanel.module.css";

type Props = {
  onTimesUpdate?: (data: {
    timesToday: Record<string, string>;
    timesTomorrow: Record<string, string>;
    methodName: string;
    locationLabel: string;
    timezone?: string;
  }) => void;
};

type CityOption = {
  value: string;
  label: string;
};

type CountryOption = {
  value: string;
  label: string;
  apiCountry: string; // Название для запроса в Aladhan (английское название страны)
  cities: CityOption[];
};

// Список стран и городов, чтобы сразу дать выбор без ручного ввода
const countryOptions: CountryOption[] = [
  {
    value: "RU",
    label: "Россия",
    apiCountry: "Russia",
    cities: [
      { value: "Moscow", label: "Москва" },
      { value: "Saint Petersburg", label: "Санкт-Петербург" },
      { value: "Kazan", label: "Казань" },
      { value: "Makhachkala", label: "Махачкала" },
      { value: "Groznyy", label: "Грозный" },
    ],
  },
  {
    value: "KZ",
    label: "Казахстан",
    apiCountry: "Kazakhstan",
    cities: [
      { value: "Astana", label: "Астана" },
      { value: "Almaty", label: "Алматы" },
      { value: "Shymkent", label: "Шымкент" },
      { value: "Aktobe", label: "Актобе" },
      { value: "Karagandy", label: "Караганда" },
    ],
  },
  {
    value: "TR",
    label: "Турция",
    apiCountry: "Turkey",
    cities: [
      { value: "Istanbul", label: "Стамбул" },
      { value: "Ankara", label: "Анкара" },
      { value: "Izmir", label: "Измир" },
      { value: "Bursa", label: "Бурса" },
    ],
  },
  {
    value: "SA",
    label: "Саудовская Аравия",
    apiCountry: "Saudi Arabia",
    cities: [
      { value: "Makkah", label: "Мекка" },
      { value: "Madinah", label: "Медина" },
      { value: "Riyadh", label: "Эр-Рияд" },
      { value: "Jeddah", label: "Джидда" },
    ],
  },
  // Ключевые страны ЕС с важными городами
  {
    value: "DE",
    label: "Германия",
    apiCountry: "Germany",
    cities: [
      { value: "Berlin", label: "Берлин" },
      { value: "Hamburg", label: "Гамбург" },
      { value: "Munich", label: "Мюнхен" },
      { value: "Cologne", label: "Кёльн" },
      { value: "Frankfurt", label: "Франкфурт-на-Майне" },
      { value: "Stuttgart", label: "Штутгарт" },
      { value: "Dusseldorf", label: "Дюссельдорф" },
      { value: "Leipzig", label: "Лейпциг" },
      { value: "Dortmund", label: "Дортмунд" },
      { value: "Hanover", label: "Ганновер" },
      { value: "Bremen", label: "Бремен" },
    ],
  },
  {
    value: "FR",
    label: "Франция",
    apiCountry: "France",
    cities: [
      { value: "Paris", label: "Париж" },
      { value: "Marseille", label: "Марсель" },
      { value: "Lyon", label: "Лион" },
      { value: "Toulouse", label: "Тулуза" },
      { value: "Nice", label: "Ницца" },
      { value: "Bordeaux", label: "Бордо" },
      { value: "Lille", label: "Лилль" },
      { value: "Nantes", label: "Нант" },
      { value: "Strasbourg", label: "Страсбург" },
      { value: "Montpellier", label: "Монпелье" },
      { value: "Rennes", label: "Ренн" },
    ],
  },
  {
    value: "ES",
    label: "Испания",
    apiCountry: "Spain",
    cities: [
      { value: "Madrid", label: "Мадрид" },
      { value: "Barcelona", label: "Барселона" },
      { value: "Valencia", label: "Валенсия" },
      { value: "Seville", label: "Севилья" },
      { value: "Malaga", label: "Малага" },
      { value: "Zaragoza", label: "Сарагоса" },
      { value: "Bilbao", label: "Бильбао" },
      { value: "Murcia", label: "Мурсия" },
      { value: "Palma", label: "Пальма-де-Майорка" },
      { value: "Granada", label: "Гранада" },
      { value: "Alicante", label: "Аликанте" },
    ],
  },
  {
    value: "IT",
    label: "Италия",
    apiCountry: "Italy",
    cities: [
      { value: "Rome", label: "Рим" },
      { value: "Milan", label: "Милан" },
      { value: "Naples", label: "Неаполь" },
      { value: "Turin", label: "Турин" },
      { value: "Palermo", label: "Палермо" },
      { value: "Florence", label: "Флоренция" },
      { value: "Bologna", label: "Болонья" },
      { value: "Genoa", label: "Генуя" },
      { value: "Verona", label: "Верона" },
      { value: "Bari", label: "Бари" },
      { value: "Catania", label: "Катания" },
    ],
  },
  {
    value: "GB",
    label: "Великобритания",
    apiCountry: "United Kingdom",
    cities: [
      { value: "London", label: "Лондон" },
      { value: "Birmingham", label: "Бирмингем" },
      { value: "Manchester", label: "Манчестер" },
      { value: "Glasgow", label: "Глазго" },
      { value: "Edinburgh", label: "Эдинбург" },
      { value: "Leeds", label: "Лидс" },
      { value: "Liverpool", label: "Ливерпуль" },
      { value: "Sheffield", label: "Шеффилд" },
      { value: "Bristol", label: "Бристоль" },
      { value: "Nottingham", label: "Ноттингем" },
      { value: "Leicester", label: "Лестер" },
    ],
  },
  {
    value: "PL",
    label: "Польша",
    apiCountry: "Poland",
    cities: [
      { value: "Warsaw", label: "Варшава" },
      { value: "Krakow", label: "Краков" },
      { value: "Lodz", label: "Лодзь" },
      { value: "Wroclaw", label: "Вроцлав" },
      { value: "Gdansk", label: "Гданьск" },
      { value: "Poznan", label: "Познань" },
      { value: "Szczecin", label: "Щецин" },
      { value: "Lublin", label: "Люблин" },
      { value: "Bydgoszcz", label: "Быдгощ" },
    ],
  },
  {
    value: "NL",
    label: "Нидерланды",
    apiCountry: "Netherlands",
    cities: [
      { value: "Amsterdam", label: "Амстердам" },
      { value: "Rotterdam", label: "Роттердам" },
      { value: "The Hague", label: "Гаага" },
      { value: "Utrecht", label: "Утрехт" },
      { value: "Eindhoven", label: "Эйндховен" },
      { value: "Tilburg", label: "Тилбург" },
      { value: "Groningen", label: "Гронинген" },
      { value: "Nijmegen", label: "Неймеген" },
    ],
  },
  {
    value: "BE",
    label: "Бельгия",
    apiCountry: "Belgium",
    cities: [
      { value: "Brussels", label: "Брюссель" },
      { value: "Antwerp", label: "Антверпен" },
      { value: "Ghent", label: "Гент" },
      { value: "Liege", label: "Льеж" },
      { value: "Bruges", label: "Брюгге" },
      { value: "Leuven", label: "Лёвен" },
    ],
  },
  {
    value: "SE",
    label: "Швеция",
    apiCountry: "Sweden",
    cities: [
      { value: "Stockholm", label: "Стокгольм" },
      { value: "Gothenburg", label: "Гётеборг" },
      { value: "Malmo", label: "Мальмё" },
      { value: "Uppsala", label: "Уппсала" },
      { value: "Linkoping", label: "Линчёпинг" },
    ],
  },
  {
    value: "NO",
    label: "Норвегия",
    apiCountry: "Norway",
    cities: [
      { value: "Oslo", label: "Осло" },
      { value: "Bergen", label: "Берген" },
      { value: "Trondheim", label: "Тронхейм" },
      { value: "Stavanger", label: "Ставангер" },
      { value: "Drammen", label: "Драммен" },
    ],
  },
  {
    value: "DK",
    label: "Дания",
    apiCountry: "Denmark",
    cities: [
      { value: "Copenhagen", label: "Копенгаген" },
      { value: "Aarhus", label: "Орхус" },
      { value: "Odense", label: "Оденсе" },
      { value: "Aalborg", label: "Ольборг" },
      { value: "Esbjerg", label: "Эсбьерг" },
    ],
  },
  {
    value: "FI",
    label: "Финляндия",
    apiCountry: "Finland",
    cities: [
      { value: "Helsinki", label: "Хельсинки" },
      { value: "Espoo", label: "Эспоо" },
      { value: "Tampere", label: "Тампере" },
      { value: "Vantaa", label: "Вантаа" },
      { value: "Oulu", label: "Оулу" },
    ],
  },
  {
    value: "PT",
    label: "Португалия",
    apiCountry: "Portugal",
    cities: [
      { value: "Lisbon", label: "Лиссабон" },
      { value: "Porto", label: "Порту" },
      { value: "Braga", label: "Брага" },
      { value: "Coimbra", label: "Коимбра" },
      { value: "Faro", label: "Фару" },
    ],
  },
  {
    value: "GR",
    label: "Греция",
    apiCountry: "Greece",
    cities: [
      { value: "Athens", label: "Афины" },
      { value: "Thessaloniki", label: "Салоники" },
      { value: "Patras", label: "Патры" },
      { value: "Heraklion", label: "Ираклион" },
      { value: "Larissa", label: "Лариса" },
    ],
  },
  {
    value: "AT",
    label: "Австрия",
    apiCountry: "Austria",
    cities: [
      { value: "Vienna", label: "Вена" },
      { value: "Graz", label: "Грац" },
      { value: "Linz", label: "Линц" },
      { value: "Salzburg", label: "Зальцбург" },
      { value: "Innsbruck", label: "Инсбрук" },
      { value: "Klagenfurt", label: "Клагенфурт" },
      { value: "Villach", label: "Филлах" },
      { value: "Wels", label: "Вельс" },
      { value: "Sankt Polten", label: "Санкт-Пёльтен" },
      { value: "Dornbirn", label: "Дорнбирн" },
      { value: "Bregenz", label: "Брегенц" },
      { value: "Wiener Neustadt", label: "Винер-Нойштадт" },
      { value: "Steyr", label: "Штайр" },
      { value: "Feldkirch", label: "Фельдкирх" },
      { value: "Wolfsberg", label: "Вольфсберг" },
    ],
  },
  {
    value: "CZ",
    label: "Чехия",
    apiCountry: "Czech Republic",
    cities: [
      { value: "Prague", label: "Прага" },
      { value: "Brno", label: "Брно" },
      { value: "Ostrava", label: "Острава" },
      { value: "Pilsen", label: "Пльзень" },
      { value: "Liberec", label: "Либерец" },
    ],
  },
  {
    value: "HU",
    label: "Венгрия",
    apiCountry: "Hungary",
    cities: [
      { value: "Budapest", label: "Будапешт" },
      { value: "Debrecen", label: "Дебрецен" },
      { value: "Szeged", label: "Сегед" },
      { value: "Miskolc", label: "Мишкольц" },
      { value: "Pecs", label: "Печ" },
    ],
  },
  {
    value: "RO",
    label: "Румыния",
    apiCountry: "Romania",
    cities: [
      { value: "Bucharest", label: "Бухарест" },
      { value: "Cluj-Napoca", label: "Клуж-Напока" },
      { value: "Iasi", label: "Яссы" },
      { value: "Timisoara", label: "Тимишоара" },
      { value: "Constanta", label: "Констанца" },
      { value: "Brasov", label: "Брашов" },
    ],
  },
  {
    value: "BG",
    label: "Болгария",
    apiCountry: "Bulgaria",
    cities: [
      { value: "Sofia", label: "София" },
      { value: "Plovdiv", label: "Пловдив" },
      { value: "Varna", label: "Варна" },
      { value: "Burgas", label: "Бургас" },
      { value: "Ruse", label: "Русе" },
    ],
  },
  {
    value: "HR",
    label: "Хорватия",
    apiCountry: "Croatia",
    cities: [
      { value: "Zagreb", label: "Загреб" },
      { value: "Split", label: "Сплит" },
      { value: "Rijeka", label: "Риека" },
      { value: "Zadar", label: "Задар" },
      { value: "Osijek", label: "Осиек" },
    ],
  },
  {
    value: "SK",
    label: "Словакия",
    apiCountry: "Slovakia",
    cities: [
      { value: "Bratislava", label: "Братислава" },
      { value: "Kosice", label: "Кошице" },
      { value: "Presov", label: "Прешов" },
      { value: "Nitra", label: "Нитра" },
    ],
  },
  {
    value: "SI",
    label: "Словения",
    apiCountry: "Slovenia",
    cities: [
      { value: "Ljubljana", label: "Любляна" },
      { value: "Maribor", label: "Марибор" },
      { value: "Celje", label: "Целе" },
      { value: "Koper", label: "Копер" },
    ],
  },
  {
    value: "IE",
    label: "Ирландия",
    apiCountry: "Ireland",
    cities: [
      { value: "Dublin", label: "Дублин" },
      { value: "Cork", label: "Корк" },
      { value: "Limerick", label: "Лимерик" },
      { value: "Galway", label: "Голуэй" },
      { value: "Waterford", label: "Уотерфорд" },
    ],
  },
  {
    value: "CH",
    label: "Швейцария",
    apiCountry: "Switzerland",
    cities: [
      { value: "Zurich", label: "Цюрих" },
      { value: "Geneva", label: "Женева" },
      { value: "Basel", label: "Базель" },
      { value: "Lausanne", label: "Лозанна" },
      { value: "Bern", label: "Берн" },
      { value: "Lucerne", label: "Люцерн" },
    ],
  },
  {
    value: "IS",
    label: "Исландия",
    apiCountry: "Iceland",
    cities: [
      { value: "Reykjavik", label: "Рейкьявик" },
      { value: "Kopavogur", label: "Коупавогюр" },
      { value: "Hafnarfjordur", label: "Хабнарфьордюр" },
      { value: "Akureyri", label: "Акурейри" },
      { value: "Reykjanesbaer", label: "Рейкьянесбер" },
    ],
  },
];

const normalize = (value: string | undefined | null) => value?.toLowerCase().trim() || "";

// Пытаемся сопоставить страну и город из внешнего источника с нашим списком
function matchCountryCity(countryName?: string, cityName?: string) {
  const countryKey = normalize(countryName);
  const cityKey = normalize(cityName);

  const countryMatch = countryOptions.find(
    (item) =>
      countryKey &&
      [item.value, item.label, item.apiCountry].some((entry) => normalize(entry) === countryKey || normalize(entry).includes(countryKey)),
  );

  if (!countryMatch) return null;

  const cityMatch = countryMatch.cities.find(
    (city) => cityKey && (normalize(city.value) === cityKey || normalize(city.label) === cityKey || normalize(city.label).includes(cityKey)),
  );

  return cityMatch ? { country: countryMatch.value, city: cityMatch.value } : { country: countryMatch.value, city: "" };
}

// Коды ключевых молитв, которые приходят с сервиса
const prayerKeys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Midnight", "LastThird"] as const;

export default function LocationPanel({ onTimesUpdate }: Props) {
  // Выбранная страна и город (стартуем с Австрии, чтобы сразу увидеть расписание)
  const [country, setCountry] = useState("AT");
  const [city, setCity] = useState("Vienna");

  // Статус для пользователя: ожидание, успех или ошибка
  const [status, setStatus] = useState("После выбора города нажмите «Получить время намаза».");
  const [loading, setLoading] = useState(false);
  const [methodName, setMethodName] = useState("Ум Аль-Кура (по умолчанию)");
  const [autoTried, setAutoTried] = useState(false);

  // Подготовим список городов для выбранной страны
  const cities = useMemo(() => countryOptions.find((c) => c.value === country)?.cities || [], [country]);

  const loadTimings = useCallback(async (targetCountry: string, targetCity: string) => {
    if (!targetCountry || !targetCity) {
      setStatus("Сначала выберите страну и город.");
      return;
    }
    setLoading(true);
    setStatus("Получаем расписание...");

    try {
      const apiCountry = countryOptions.find((item) => item.value === targetCountry)?.apiCountry || targetCountry;
      const baseParams = {
        city: targetCity,
        country: apiCountry,
        method: "2",
      };
      const todayParams = new URLSearchParams(baseParams);
      const tomorrowDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const dd = d.getDate().toString().padStart(2, "0");
        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      })();
      const tomorrowParams = new URLSearchParams({ ...baseParams, date: tomorrowDate });

      const [todayRes, tomorrowRes] = await Promise.all([
        fetch(`https://api.aladhan.com/v1/timingsByCity?${todayParams.toString()}`),
        fetch(`https://api.aladhan.com/v1/timingsByCity?${tomorrowParams.toString()}`),
      ]);

      if (!todayRes.ok || !tomorrowRes.ok) {
        throw new Error("Не удалось получить расписание на сегодня или завтра.");
      }

      const [todayData, tomorrowData] = await Promise.all([todayRes.json(), tomorrowRes.json()]);

      const normalize = (timings: Record<string, string>) => {
        const normalized: Record<string, string> = {};
        prayerKeys.forEach((key) => {
          if (key === "LastThird") {
            normalized[key] = timings["Last third"] || timings["LastThird"] || timings["Lastthird"] || "--:--";
          } else {
            normalized[key] = timings[key] || "--:--";
          }
        });
        return normalized;
      };

      const todayTimings = normalize(todayData?.data?.timings || {});
      const tomorrowTimings = normalize(tomorrowData?.data?.timings || {});
      const apiMethodName = todayData?.data?.meta?.method?.name || methodName;
      const tzName = todayData?.data?.meta?.timezone || todayData?.data?.meta?.timezoneName;
      setMethodName(apiMethodName);

      const countryLabel = countryOptions.find((item) => item.value === targetCountry)?.label || targetCountry;
      const cityLabel =
        countryOptions
          .find((item) => item.value === targetCountry)
          ?.cities.find((c) => c.value === targetCity)?.label || targetCity;

      onTimesUpdate?.({
        timesToday: todayTimings,
        timesTomorrow: tomorrowTimings,
        methodName: apiMethodName,
        locationLabel: `${cityLabel}, ${countryLabel}`,
        timezone: tzName,
      });
      setStatus(`Данные обновлены для города: ${targetCity} (${apiCountry})`);
    } catch (error) {
      console.error("Не получилось получить время намаза:", error);
      setStatus("Не получилось загрузить время. Попробуйте другой город или ещё раз.");
    } finally {
      setLoading(false);
    }
  }, [methodName, onTimesUpdate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadTimings(country, city);
  };

  // Пробуем определить город автоматически, затем при неуспехе используем безопасный дефолт
  // Автоопределение запускаем один раз при первом заходе на страницу
  useEffect(() => {
    if (autoTried) return;
    let cancelled = false;
    setAutoTried(true);

    const resolveAndLoad = async (match: { country: string; city: string } | null, sourceLabel: string) => {
      if (cancelled) return;
      if (match?.country && match.city) {
        setCountry(match.country);
        setCity(match.city);
        setStatus(`Определили город (${sourceLabel}), загружаем расписание...`);
        await loadTimings(match.country, match.city);
        return true;
      }
      return false;
    };

    const detect = async () => {
      setStatus("Пробуем определить ваш город...");
      // 1) Геолокация браузера
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
          });
          const { latitude, longitude } = position.coords;
          const resp = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          if (resp.ok) {
            const data = await resp.json();
            const match = matchCountryCity(data?.countryName, data?.city || data?.locality || data?.principalSubdivision);
            const done = await resolveAndLoad(match, "геолокация");
            if (done) return;
          }
        } catch (error) {
          console.warn("Не удалось определить через геолокацию:", error);
        }
      }

      // 2) IP-гео как запасной вариант
      try {
        const resp = await fetch("https://ipapi.co/json/");
        if (resp.ok) {
          const data = await resp.json();
          const match = matchCountryCity(data?.country_name, data?.city);
          const done = await resolveAndLoad(match, "IP-гео");
          if (done) return;
        }
      } catch (error) {
        console.warn("Не удалось определить через IP:", error);
      }

      // 3) Безопасный дефолт
      if (!cancelled) {
        setStatus("Используем город по умолчанию.");
        setCountry("AT");
        setCity("Vienna");
        await loadTimings("AT", "Vienna");
      }
    };

    detect();

    return () => {
      cancelled = true;
    };
  }, [autoTried, loadTimings]);

  return (
    <section className={styles.panel} aria-labelledby="location-heading">
      <div className={styles.container}>
        {/* Форма выбора страны и города + запрос расписания */}
        <div className={styles.formBox}>
          <div className={styles.formHead}>
            <h2 id="location-heading" className={styles.title}>
              Найдите своё расписание
            </h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="country">
                Страна
              </label>
              <select
                className={styles.select}
                id="country"
                name="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity("");
                }}
                required
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
              <label className={styles.label} htmlFor="city">
                Город
              </label>
              <select
                className={styles.select}
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={!country}
              >
                <option value="">{country ? "Выберите город" : "Сначала выберите страну"}</option>
                {cities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.badge} aria-live="polite">
              Метод: {methodName || "—"}
            </div>

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Загружаем..." : "Получить время намаза"}
            </button>
            <div className={styles.hint} aria-live="polite">
              {status}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
