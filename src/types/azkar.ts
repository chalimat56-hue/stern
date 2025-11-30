// Базовый тип для карточек азкаров
export interface AzkarItem {
  id: number;
  repeat: string;
  source: string;
  sourceEn?: string;
  arabic: string;
  translit: string;
  translitEn?: string;
  translation: string;
  translationEn?: string;
  note: string | null;
  noteEn?: string | null;
}
