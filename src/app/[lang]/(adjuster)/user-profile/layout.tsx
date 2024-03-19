import { ReactNode } from "react";
import CommonLayout from "@/components/common/Layouts/CommonLayout";
import { adjusterMenu } from "@/constants/navBarMenuList/adjusterNavLink";

export default function UserProfileLayout({ children }: { children: ReactNode }) {
  return <CommonLayout menu={adjusterMenu}>{children}</CommonLayout>;
}
