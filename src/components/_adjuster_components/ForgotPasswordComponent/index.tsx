import React from "react";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import ForgotPasswordForm from "./ForgotPasswordForm";
import fPWDCStyle from "./forgotPasswordComponent.module.scss";
import { forgotPwdTranslatePropType } from "@/app/[lang]/(adjuster)/(password)/forgot-password/page";

function ForgotPasswordComponent({
  translate,
}: {
  translate: forgotPwdTranslatePropType;
}) {
  return (
    <div className={fPWDCStyle.main}>
      <GenericComponentHeading title={translate?.forgotPasswordTranslate?.heading} />
      <div className={fPWDCStyle.fogotPasswordContent}>
        <div className={fPWDCStyle.subHeading}>
          {translate?.forgotPasswordTranslate?.subHeading}
        </div>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}

export default ForgotPasswordComponent;
