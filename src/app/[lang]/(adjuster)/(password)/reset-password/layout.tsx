import CommonLayout from "@/components/common/Layouts/CommonLayout";
import { adjusterMenu } from "@/constants/navBarMenuList/adjusterNavLink";
import React from "react";

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <CommonLayout menu={adjusterMenu}>{children}</CommonLayout>;
  // return (
  //   <div className={securityLayoutStyle.container}>
  //     <div>{children}</div>
  //   </div>
  // );
}
