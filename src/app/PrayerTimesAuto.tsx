/*
 Эта клиентская секция автоматически берёт ваш браузерный геопункт.
 После разрешения геолокации запрашивает времена намазов и выводит их в таблицу.
 Если доступ к местоположению отклонён или произошла ошибка, показывает короткое сообщение без падения страницы.
*/
"use client";

import { useEffect, useState } from "react";

type Timings = {
  Fajr?: string;
  Sunrise?: string;
  Dhuhr?: string;
  Asr?: string;
  Maghrib?: string;
  Isha?: string;
};

export default function PrayerTimesAuto() {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not available in this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
          const resp = await fetch(url);
          if (!resp.ok) {
            throw new Error("Failed to load prayer times.");
          }
          const data = await resp.json();
          const t = data?.data?.timings;
          setTimings({
            Fajr: t?.Fajr,
            Sunrise: t?.Sunrise,
            Dhuhr: t?.Dhuhr,
            Asr: t?.Asr,
            Maghrib: t?.Maghrib,
            Isha: t?.Isha,
          });
        } catch (fetchError) {
          console.error(fetchError);
          setError("Could not load prayer times.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        console.warn("Geolocation error", geoError);
        setError("Location permission denied or unavailable.");
        setLoading(false);
      },
      { timeout: 8000 },
    );
  }, []);

  if (loading) {
    return <p>Detecting your location and fetching prayer times...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!timings) {
    return <p>Prayer times are not available.</p>;
  }

  return (
    <section>
      <h2>Prayer times for your location</h2>
      <table>
        <thead>
          <tr>
            <th>Prayer</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(timings).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value || "--:--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
