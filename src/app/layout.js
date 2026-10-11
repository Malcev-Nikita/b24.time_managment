import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: {
    default: "Моё затреканное время",
    template: "%s · Учёт времени",
  },
  description:
    "Учёт затреканного времени по задачам Битрикс24: сводка за сегодня, неделю, месяц и год.",
  applicationName: "Учёт времени",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      className={`${firaCode.variable} h-full antialiased`}
    >
      <body className="container m-auto h-full w-full mt-6 px-4 sm:mt-10">
        {children}
      </body>
    </html>
  );
}
