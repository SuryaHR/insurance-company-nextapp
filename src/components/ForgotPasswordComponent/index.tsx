import React from "react";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import ForgotPasswordForm from "./ForgotPasswordForm";
import fPWDCStyle from "./forgotPasswordComponent.module.scss";
import { forgotPwdTranslateType } from "@/translations/forgotPasswordTranslate/en";

function ForgotPasswordComponent({ translate }: { translate: forgotPwdTranslateType }) {
  return (
    <div className={fPWDCStyle.main}>
      <GenericComponentHeading title={translate?.heading} />
      <div className={fPWDCStyle.fogotPasswordContent}>
        <div className={fPWDCStyle.subHeading}>{translate?.subHeading}</div>
      </div>
      <ForgotPasswordForm translate={translate} />
    </div>
  );
}

export default ForgotPasswordComponent;
