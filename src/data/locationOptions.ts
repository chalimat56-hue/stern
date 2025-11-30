/*
 Эта справка хранит список стран и городов для выбора расписания.
 Здесь ничего не вычисляем: только данные и простые помощники для сопоставления.
*/
export type CityOption = {
  value: string;
  label: string;
  labelEn?: string;
};

export type CountryOption = {
  value: string;
  label: string;
  labelEn?: string;
  apiCountry: string; // Название для запроса в Aladhan (английское название страны)
  cities: CityOption[];
};

export type SupportedLanguage = "ru" | "en";

// Базовый список стран и городов, русские подписи — для удобства поиска в matchCountryCity
const baseCountryOptions: CountryOption[] = [
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

// Готовый список с добавленным английским названием (labelEn) и без изменения русских подписей
export const countryOptions: CountryOption[] = baseCountryOptions.map((country) => ({
  ...country,
  labelEn: country.labelEn || country.apiCountry || country.label,
  cities: country.cities.map((city) => ({
    ...city,
    labelEn: city.labelEn || city.value || city.label,
  })),
}));

export const normalize = (value: string | undefined | null) => value?.toLowerCase().trim() || "";

const pickLabel = (label: string, labelEn: string | undefined, fallback: string, language: SupportedLanguage) =>
  language === "en" ? labelEn || fallback : label;

// Возвращает список стран и городов с подставленными под выбранный язык подписями
export const getLocalizedCountries = (language: SupportedLanguage): CountryOption[] =>
  countryOptions.map((country) => ({
    ...country,
    label: pickLabel(country.label, country.labelEn, country.apiCountry || country.value, language),
    cities: country.cities.map((city) => ({
      ...city,
      label: pickLabel(city.label, city.labelEn, city.value, language),
    })),
  }));

// Пытаемся сопоставить страну и город из внешнего источника с нашим списком
export function matchCountryCity(countryName?: string, cityName?: string) {
  const countryKey = normalize(countryName);
  const cityKey = normalize(cityName);

  const countryMatch = countryOptions.find(
    (item) =>
      countryKey &&
      [item.value, item.label, item.labelEn, item.apiCountry].some(
        (entry) => normalize(entry) === countryKey || normalize(entry).includes(countryKey),
      ),
  );

  if (!countryMatch) return null;

  const cityMatch = countryMatch.cities.find(
    (city) =>
      cityKey &&
      (normalize(city.value) === cityKey ||
        normalize(city.label) === cityKey ||
        normalize(city.labelEn) === cityKey ||
        normalize(city.label).includes(cityKey) ||
        normalize(city.labelEn).includes(cityKey)),
  );

  return cityMatch ? { country: countryMatch.value, city: cityMatch.value } : { country: countryMatch.value, city: "" };
}
