import React from "react";
import Image from "next/image";

import fPWDStyle from "./forgotPasswordContainerV2.module.scss";
import ForgotPasswordComponent from "@/components/ForgotPasswordComponent";
import { GetComponyLogo } from "@/services/LoginService";
import clsx from "clsx";
import { Locale } from "@/i18n.config";
import { getTranslate } from "@/translations";
import { forgotPwdTranslateType } from "@/translations/forgotPasswordTranslate/en";

async function ForgotPasswordContainerV2({ lang }: { lang: Locale }) {
  const { data }: any = await GetComponyLogo();
  const translate: forgotPwdTranslateType = await getTranslate(
    lang,
    "forgotPasswordTranslate"
  );

  return (
    <div className={fPWDStyle.root}>
      <div className={clsx(fPWDStyle.heading, fPWDStyle.heading2)}>
        Evolution Insurance Company
      </div>
      <div className={fPWDStyle.content}>
        <div className={fPWDStyle.logo}>
          {data?.logo && (
            <Image
              alt="company_logo"
              fill
              src={data?.logo}
              style={{ objectFit: "contain" }}
              sizes="100%"
            />
          )}
        </div>
        <div className={fPWDStyle.forgotPwdContainer}>
          <ForgotPasswordComponent translate={translate} />
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordContainerV2;
