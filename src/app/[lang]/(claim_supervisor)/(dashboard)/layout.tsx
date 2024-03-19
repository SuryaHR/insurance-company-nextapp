import CommonLayout from "@/components/common/Layouts/CommonLayout";
import { claimSupervisorMenu } from "@/constants/navBarMenuList/claimSupervisorNavLink";
import React from "react";

export default function ClaimSupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommonLayout menu={claimSupervisorMenu}>{children}</CommonLayout>;
}
