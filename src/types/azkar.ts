// Базовый тип для карточек азкаров
export interface AzkarItem {
  id: number;
  repeat: string;
  source: string;
  arabic: string;
  translit: string;
  translation: string;
  note: string | null;
}
