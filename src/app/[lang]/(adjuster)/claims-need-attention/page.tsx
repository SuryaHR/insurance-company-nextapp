import UrgentClaimContainer from "@/container/_adjuster_container/UrgentClaimContainer";
import React, { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { urgentClaimTranslateType } from "@/translations/urgentClaimTranslate/en";

export interface urgentClaimTranslateProp {
  urgentClaimTranslate: urgentClaimTranslateType;
}

export default async function ClaimsNeedAttention({
  params,
}: {
  params: { lang: Locale };
}) {
  const translate = await getTranslateList<urgentClaimTranslateProp>(params.lang, [
    "urgentClaimTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <UrgentClaimContainer translate={translate} />;
      </TranslateWrapper>
    </Suspense>
  );
}
