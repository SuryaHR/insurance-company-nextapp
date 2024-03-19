import React from "react";
import SecurityQuestionContainer from "@/container/_adjuster_container/PasswordContainer/SecurityQuestionContainer";
import { Locale } from "@/i18n.config";
import { getTranslateList } from "@/translations";
import { securityQuestionTranslateType } from "@/translations/securityQuestionTranslate/en";
import TranslateWrapper from "@/store/TranslateWrapper";

export interface securityQuestionTranslatePropType {
  securityQuestionTranslate: securityQuestionTranslateType;
}

async function SecurityQuestion({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<securityQuestionTranslatePropType>(
    params.lang,
    ["securityQuestionTranslate"]
  );
  return (
    <TranslateWrapper translate={translate}>
      <SecurityQuestionContainer />
    </TranslateWrapper>
  );
}

export default SecurityQuestion;
