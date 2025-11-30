/*
 Это общий каркас приложения: подключаем шрифты, задаём язык страницы и оборачиваем всё содержимое.
 Здесь нет логики, только общее оформление, чтобы каждая страница выглядела единообразно.
 Пользователь увидит выбранные шрифты и корректный язык документа на каждой странице.
*/
import type { Metadata } from "next";
import { Amiri, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const arabicSerif = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "noxchiPro | Время намаза",
  description: "Онлайн расписание намаза по стране и городу, плюс подборки азкаров.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} ${arabicSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
