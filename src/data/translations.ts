import { PrayerKey } from "../utils/nextPrayer";

export type Language = "ru" | "en";

export type TranslationContent = {
  languageLabel: string;
  languageSwitch: string;
  brand: string;
  navMorning: string;
  navEvening: string;
  navSchedule: string;
  heroTitle: string;
  heroSubtitle: string;
  contextLabel: string;
  selectCountry: string;
  selectCity: string;
  cityPlaceholder: string;
  cityPlaceholderEmpty: string;
  statusDetecting: string;
  statusLoading: string;
  statusReady: (label: string) => string;
  statusError: string;
  nearestTitle: string;
  nearestCityMissing: string;
  nearestPending: string;
  methodLabel: string;
  timezoneLabel: string;
  countdownPrefix: string;
  scheduleEyebrow: string;
  scheduleTitle: string;
  todayLabel: string;
  tomorrowLabel: string;
  azkarEyebrow: string;
  azkarTitle: string;
  azkarText: string;
  azkarMorningLabel: string;
  azkarMorningTitle: string;
  azkarEveningLabel: string;
  azkarEveningTitle: string;
  azkarAction: string;
  footerBrand: string;
  footerMeta: string;
  morningEyebrow: string;
  morningTitle: string;
  morningLead: string;
  eveningEyebrow: string;
  eveningTitle: string;
  eveningLead: string;
  prayerTitles: Record<PrayerKey, string>;
};

export const translations: Record<Language, TranslationContent> = {
  ru: {
    languageLabel: "Русский",
    languageSwitch: "EN",
    brand: "Меню",
    navMorning: "Утренние азкары",
    navEvening: "Вечерние азкары",
    navSchedule: "Расписание",
    heroTitle: "Найди время намаза в своём городе",
    heroSubtitle: "Выбери страну и город — получи актуальное расписание.",
    contextLabel: "Расписание для",
    selectCountry: "Страна",
    selectCity: "Город",
    cityPlaceholder: "Выберите город",
    cityPlaceholderEmpty: "Сначала выберите страну",
    statusDetecting: "Пробуем определить ваш город...",
    statusLoading: "Обновляем расписание...",
    statusReady: (label: string) => `Расписание получено для: ${label}`,
    statusError: "Не удалось загрузить расписание. Проверьте подключение или выберите город вручную.",
    nearestTitle: "Ближайший намаз",
    nearestCityMissing: "Город не выбран",
    nearestPending: "Определяем ближайший намаз...",
    methodLabel: "Метод",
    timezoneLabel: "Часовой пояс",
    countdownPrefix: "Осталось",
    scheduleEyebrow: "Расписание",
    scheduleTitle: "Время намазов: сегодня и завтра",
    todayLabel: "сегодня в",
    tomorrowLabel: "завтра в",
    azkarEyebrow: "Азкары",
    azkarTitle: "Укрепите утро и вечер",
    azkarText: "Стеклянные карточки с арабским текстом, транслитом и переводом. У каждой — озвучка и копирование.",
    azkarMorningLabel: "Утро",
    azkarMorningTitle: "Утренние азкары",
    azkarEveningLabel: "Вечер",
    azkarEveningTitle: "Вечерние азкары",
    azkarAction: "Перейти →",
    footerBrand: "noxchiPro • Намаз и азкары",
    footerMeta: "Данные: Aladhan API",
    morningEyebrow: "Утро",
    morningTitle: "Утренние азкары",
    morningLead:
      "Спокойные широкие карточки с арабским текстом, транслитом и переводом. Кнопки ниже пока макет для прослушивания и копирования.",
    eveningEyebrow: "Вечер",
    eveningTitle: "Вечерние азкары",
    eveningLead:
      "Те же широкие карточки: арабский текст, транслит и перевод. Кнопки ниже оставлены под будущий звук и копирование.",
    prayerTitles: {
      Fajr: "Фаджр",
      Sunrise: "Восход",
      Dhuhr: "Зухр",
      Asr: "Аср",
      Maghrib: "Магриб",
      Isha: "Иша",
      Midnight: "Полночь",
      LastThird: "Последняя треть",
      Qiyam: "Киям",
    },
  },
  en: {
    languageLabel: "English",
    languageSwitch: "RU",
    brand: "Menu",
    navMorning: "Morning adhkar",
    navEvening: "Evening adhkar",
    navSchedule: "Schedule",
    heroTitle: "Find prayer times in your city",
    heroSubtitle: "Pick your country and city to see today and tomorrow.",
    contextLabel: "Schedule for",
    selectCountry: "Country",
    selectCity: "City",
    cityPlaceholder: "Select a city",
    cityPlaceholderEmpty: "Pick a country first",
    statusDetecting: "Trying to detect your city...",
    statusLoading: "Refreshing schedule...",
    statusReady: (label: string) => `Times loaded for: ${label}`,
    statusError: "Could not load times. Check your connection or pick a city manually.",
    nearestTitle: "Next prayer",
    nearestCityMissing: "City is not set",
    nearestPending: "Figuring out the next prayer...",
    methodLabel: "Method",
    timezoneLabel: "Time zone",
    countdownPrefix: "Remaining",
    scheduleEyebrow: "Schedule",
    scheduleTitle: "Prayer times: today and tomorrow",
    todayLabel: "today at",
    tomorrowLabel: "tomorrow at",
    azkarEyebrow: "Adhkar",
    azkarTitle: "Strengthen morning and evening",
    azkarText: "Glass cards with Arabic, translit, translation, audio, and copy.",
    azkarMorningLabel: "Morning",
    azkarMorningTitle: "Morning adhkar",
    azkarEveningLabel: "Evening",
    azkarEveningTitle: "Evening adhkar",
    azkarAction: "Open →",
    footerBrand: "noxchiPro • Prayer times and adhkar",
    footerMeta: "Data: Aladhan API",
    morningEyebrow: "Morning",
    morningTitle: "Morning adhkar",
    morningLead:
      "Wide calm cards with Arabic, translit, and translation. Buttons below are placeholders for audio and copy.",
    eveningEyebrow: "Evening",
    eveningTitle: "Evening adhkar",
    eveningLead:
      "Same wide cards with Arabic, translit, and translation. Buttons are placeholders for audio and copy.",
    prayerTitles: {
      Fajr: "Fajr",
      Sunrise: "Sunrise",
      Dhuhr: "Dhuhr",
      Asr: "Asr",
      Maghrib: "Maghrib",
      Isha: "Isha",
      Midnight: "Midnight",
      LastThird: "Last third",
      Qiyam: "Qiyam",
    },
  },
};
