/*
 Простые помощники, которые пытаются узнать, где находится пользователь.
 Сначала пробуем GPS браузера, потом IP, а если ничего не вышло — используем безопасный дефолт.
*/
import { CountryOption, matchCountryCity } from "../data/locationOptions";

export type LocatedPlace = {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  timezone: string;
  label: string;
};

// Безопасная точка по умолчанию, чтобы всегда было с чем работать
export const fallbackPlace: LocatedPlace = {
  latitude: 48.2082,
  longitude: 16.3738,
  country: "AT",
  city: "Vienna",
  timezone: "Europe/Vienna",
  label: "Vienna, Austria",
};

const guessTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const buildLabel = (countryValue: string, cityValue: string, options: CountryOption[]) => {
  const countryLabel = options.find((item) => item.value === countryValue)?.label || countryValue;
  const cityLabel =
    options.find((item) => item.value === countryValue)?.cities.find((city) => city.value === cityValue)?.label || cityValue;
  return countryLabel && cityLabel ? `${cityLabel}, ${countryLabel}` : cityLabel || countryLabel || "Неизвестное место";
};

const pickCityForCountry = (countryValue: string, options: CountryOption[], preferredCity?: string) => {
  const cities = options.find((item) => item.value === countryValue)?.cities || [];
  if (preferredCity && cities.some((city) => city.value === preferredCity)) {
    return preferredCity;
  }
  return cities[0]?.value || fallbackPlace.city;
};

const normalizeResult = (
  base: { latitude?: number; longitude?: number; country?: string; city?: string; timezone?: string },
  options: CountryOption[],
) => {
  const match = matchCountryCity(base.country, base.city);
  const country = match?.country || base.country || fallbackPlace.country;
  const city = pickCityForCountry(country, options, match?.city || base.city);
  const timezone = base.timezone || guessTimezone();

  return {
    latitude: base.latitude || fallbackPlace.latitude,
    longitude: base.longitude || fallbackPlace.longitude,
    country,
    city,
    timezone,
    label: buildLabel(country, city, options),
  };
};

const tryNavigatorLocation = async (options: CountryOption[]) => {
  if (typeof window === "undefined" || !("geolocation" in navigator)) return null;
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
    });
    const { latitude, longitude } = position.coords;
    let country: string | undefined;
    let city: string | undefined;
    let timezone: string | undefined;

    try {
      const resp = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      );
      if (resp.ok) {
        const data = await resp.json();
        country = data?.countryCode || data?.countryName;
        city = data?.city || data?.locality || data?.principalSubdivision;
        timezone = data?.timezone?.ianaTimeZone || data?.timeZone || data?.timezone;
      }
    } catch (error) {
      console.warn("Не удалось уточнить город через обратное геокодирование:", error);
    }

    return normalizeResult({ latitude, longitude, country, city, timezone }, options);
  } catch (error) {
    console.warn("Не удалось получить координаты из геолокации браузера:", error);
    return null;
  }
};

const tryIpLookup = async (options: CountryOption[]) => {
  try {
    const resp = await fetch("https://ipapi.co/json/");
    if (!resp.ok) return null;
    const data = await resp.json();
    return normalizeResult(
      {
        latitude: data?.latitude,
        longitude: data?.longitude,
        country: data?.country_code || data?.country,
        city: data?.city,
        timezone: data?.timezone,
      },
      options,
    );
  } catch (error) {
    console.warn("Не удалось определить город через IP-сервис:", error);
    return null;
  }
};

export async function detectBestLocation(options: CountryOption[]): Promise<LocatedPlace> {
  const byNavigator = await tryNavigatorLocation(options);
  if (byNavigator) return byNavigator;

  const byIp = await tryIpLookup(options);
  if (byIp) return byIp;

  return { ...fallbackPlace, label: buildLabel(fallbackPlace.country, fallbackPlace.city, options) };
}

export async function resolveCityCoordinates(
  countryValue: string,
  cityValue: string,
  fallback: LocatedPlace = fallbackPlace,
): Promise<{ latitude: number; longitude: number; timezone: string }> {
  try {
    const resp = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityValue)}&count=5&language=en&format=json`,
    );
    if (resp.ok) {
      const data = await resp.json();
      const results: Array<{
        latitude: number;
        longitude: number;
        timezone?: string;
        country_code?: string;
      }> = data?.results || [];
      const chosen =
        results.find((item) => item.country_code?.toUpperCase() === countryValue.toUpperCase()) || results[0] || null;
      if (chosen) {
        return {
          latitude: chosen.latitude,
          longitude: chosen.longitude,
          timezone: chosen.timezone || fallback.timezone || guessTimezone(),
        };
      }
    }
  } catch (error) {
    console.warn("Не удалось найти координаты выбранного города:", error);
  }

  return {
    latitude: fallback.latitude,
    longitude: fallback.longitude,
    timezone: fallback.timezone || guessTimezone(),
  };
}
