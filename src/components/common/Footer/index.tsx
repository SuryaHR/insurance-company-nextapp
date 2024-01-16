import React from "react";
import footerStyle from "./footer.module.scss";
import { GetVersionNumberData } from "@/services/LoginService";

async function Footer() {
  const {buildVersion=""}:any = await GetVersionNumberData();

  return (
    <div className={footerStyle.footer__main}>
      <div>Powered by Artigem Streamline , ver. {buildVersion} © Artigem</div>
    </div>
  );
}

export default Footer;

