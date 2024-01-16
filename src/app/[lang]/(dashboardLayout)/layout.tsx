// import CommonLayout from "@/components/common/Layouts/CommonLayout";
import CommonLayout from "@/components/common/Layouts/CommonLayout";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <CommonLayout>{children}</CommonLayout>;
}
