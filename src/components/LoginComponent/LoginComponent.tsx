import React from "react";
import Image from "next/image";
import LoginForm from "./LoginForm";
import loginComponentStyle from "./loginComponent.module.scss";
import clsx from "clsx";
import { GetComponyLogo } from "@/services/LoginService";
// import getServerTranslation from "@/translations/getServerTranslation";
import { loginTranslateType } from "@/translations/loginTranslate/en";
import { Locale } from "@/i18n.config";
import { getTranslate } from "@/translations";

async function LoginComponent({ lang, heading = "" }: { lang: Locale; heading: string }) {
  // const translate: loginTranslateType = await getServerTranslation("loginTranslate");
  const translate: loginTranslateType = await getTranslate(lang, "loginTranslate");
  const { data }: any = await GetComponyLogo();
  return (
    <div className={loginComponentStyle.loginComponent}>
      <h1 className={loginComponentStyle.loginComponent__heading}>{heading}</h1>
      <div className={loginComponentStyle.loginComponent__container}>
        <div className={loginComponentStyle.loginComponent__content}>
          <Image
            className={loginComponentStyle.loginComponent__image}
            alt="company_logo"
            fill
            src={data?.logo}
            style={{ objectFit: "contain" }}
            sizes="100%"
          />
        </div>
        <div
          className={clsx({
            [loginComponentStyle.loginComponent__content]: true,
            [loginComponentStyle["loginComponent__content--right"]]: true,
          })}
        >
          <h3 className={loginComponentStyle.loginComponent__subHeading}>
            {translate.welcomeMsg}
          </h3>
          <LoginForm translate={translate} />
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
