import CommonLayout from "@/components/common/Layouts/CommonLayout";
import { adminMenu } from "@/constants/navBarMenuList/adminNavLink";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <CommonLayout menu={adminMenu}>{children}</CommonLayout>;
}
