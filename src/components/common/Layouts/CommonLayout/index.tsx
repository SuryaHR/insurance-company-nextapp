import React from "react";
import NavBar from "@/components/common/Navbar";
import { TypedMenuObject } from "@/components/common/Navbar/NavbarComponent";
import securityLayoutStyle from "./commonLayout.module.scss";
import Header from "@/components/common/Header/index";

function CommonLayout({
  children,
  menu,
}: {
  children: React.ReactNode;
  menu: TypedMenuObject[];
}) {
  return (
    <div className={securityLayoutStyle.root}>
      <div className={securityLayoutStyle.container}>
        <Header />
        <NavBar menu={menu} />

        <div>{children}</div>
      </div>
    </div>
  );
}

export default CommonLayout;
