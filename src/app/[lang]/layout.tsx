import type { Metadata } from "next";
import { ReactNode } from "react";
import { Open_Sans } from "next/font/google";
import "@/scss/globals.scss";
import { StoreProvider } from "@/store/store";
import { Locale } from "@/i18n.config";
import NotifyMessage from "@/components/common/NotifyMessage";
import parentLayoutClass from "./layout.module.scss";

const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Artigem Streamline",
};

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={params.lang} className={openSans.className}>
      <body className={parentLayoutClass.container}>
        <StoreProvider lang={params.lang}>
          <NotifyMessage />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
