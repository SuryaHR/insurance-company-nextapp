import React, { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import SupervisorClaimReportsContainer from "@/container/_claim_supervisor_container/SupervisorClaimReportsContainer";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { claimReportType } from "@/translations/claimReportTranslate/en";

export interface SupervisorClaimReportPropType {
  claimReportTranslate: claimReportType;
}

export default async function SupervisorMyInvoices({
  params,
}: {
  params: { lang: Locale };
}) {
  const translate = await getTranslateList<SupervisorClaimReportPropType>(params.lang, [
    "claimReportTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <SupervisorClaimReportsContainer />
      </TranslateWrapper>
    </Suspense>
  );
}
