/*
 Здесь лежат маленькие функции для работы со временем.
 Отдельно вынесли форматирование обратного отсчёта, чтобы не дублировать вычисления.
*/
export function formatCountdown(milliseconds: number) {
  if (milliseconds <= 0) {
    return "00:00:00";
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
