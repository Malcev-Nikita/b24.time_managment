import { Fira_Code } from "next/font/google";
import "./globals.css";

import Header from "@/widgets/header";
import StoreProvider from "@/store/store-provide";
import Footer from "@/widgets/footer";

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
    "Учёт затреканного времени по задачам Битрикс24: сводка за сегодня, неделю, месяц и всё время.",
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
      <body className="container m-auto h-full w-full mt-15">
        <StoreProvider>
          <Header/>

          {children}

          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
