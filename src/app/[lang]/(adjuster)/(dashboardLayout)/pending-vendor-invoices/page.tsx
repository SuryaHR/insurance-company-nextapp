import PendingInvoicesContainer from "@/container/_adjuster_container/PendingInvoicesContainer";
import React, { Suspense } from "react";
// import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { policyInvoicesTranslateType } from "@/translations/policyInvoicesTranslate/en";

export interface policyInvoicesTranslateProp {
  policyInvoicesTranslate: policyInvoicesTranslateType;
}

export default async function page({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<policyInvoicesTranslateProp>(params.lang, [
    "policyInvoicesTranslate",
  ]);
  return (
    <Suspense>
      <TranslateWrapper translate={translate}>
        <PendingInvoicesContainer translate={translate} />
      </TranslateWrapper>
    </Suspense>
  );
}
