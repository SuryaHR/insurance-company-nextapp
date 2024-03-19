// import CommonLayout from "@/components/common/Layouts/CommonLayout";
import CommonLayout from "@/components/common/Layouts/CommonLayout";
import { adjusterMenu } from "@/constants/navBarMenuList/adjusterNavLink";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <CommonLayout menu={adjusterMenu}>{children}</CommonLayout>;
}
