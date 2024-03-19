import type { Metadata } from "next";
import React from "react";
import { PT_Sans } from "next/font/google";
import coreLogicLayoutClass from "@/app/[lang]/(core_logic)/coreLogic.module.scss";
export const metadata: Metadata = {
  title: "Core Artigem",
};
const openSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function CoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={openSans.className}>
      <div className={coreLogicLayoutClass.container}>{children}</div>
    </div>
  );
}
