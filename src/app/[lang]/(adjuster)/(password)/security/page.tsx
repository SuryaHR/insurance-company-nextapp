import SecurityContainer from "@/container/_adjuster_container/PasswordContainer/SecurityContainer";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { securityTranslateType } from "@/translations/securityTranslate/en";
import React from "react";

export interface securityTranslatePropType {
  securityTranslate: securityTranslateType;
}

async function Security({ params }: { params: { lang: Locale } }) {
  const translate: securityTranslatePropType = await getTranslateList(params.lang, [
    "securityTranslate",
  ]);

  return (
    <TranslateWrapper translate={translate}>
      <SecurityContainer translate={translate} />
    </TranslateWrapper>
  );
}

export default Security;
