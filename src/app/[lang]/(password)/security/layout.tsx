import CommonLayout from "@/components/common/Layouts/CommonLayout";
import React from "react";

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <CommonLayout>{children}</CommonLayout>;
  // return (
  //   <div className={securityLayoutStyle.container}>
  //     <div>{children}</div>
  //   </div>
  // );
}
