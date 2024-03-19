import ResetPasswordContainer from "@/container/_adjuster_container/PasswordContainer/ResetPasswordContainer";
import React from "react";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { resetPasswordTranslateType } from "@/translations/resetPasswordTranslate/en";

export interface resetPasswordTranslatePropType {
  resetPasswordTranslate: resetPasswordTranslateType;
}
async function ResetPassword({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<resetPasswordTranslatePropType>(params.lang, [
    "resetPasswordTranslate",
  ]);

  return (
    <TranslateWrapper translate={translate}>
      <ResetPasswordContainer translate={translate} />
    </TranslateWrapper>
  );
}

export default ResetPassword;
