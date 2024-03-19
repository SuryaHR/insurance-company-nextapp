import React from "react";
import Image from "next/image";

import fPWDStyle from "./forgotPasswordContainerV2.module.scss";
import { GetComponyLogo } from "@/services/LoginService";
import clsx from "clsx";
import { forgotPwdTranslatePropType } from "@/app/[lang]/(adjuster)/(password)/forgot-password/page";
import ForgotPasswordComponent from "@/components/_adjuster_components/ForgotPasswordComponent";

async function ForgotPasswordContainerV2({
  translate,
}: {
  translate: forgotPwdTranslatePropType;
}) {
  const { data }: any = await GetComponyLogo();

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
