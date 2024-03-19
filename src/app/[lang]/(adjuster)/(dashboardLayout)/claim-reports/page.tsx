import ClaimReports from "@/container/_adjuster_container/ClaimReportsContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { claimReportType } from "@/translations/claimReportTranslate/en";

export interface claimReportPropType {
  claimReportTranslate: claimReportType;
}

export default async function adjusterDashboard({
  params,
}: {
  params: { lang: Locale };
}) {
  const translate = await getTranslateList<claimReportPropType>(params.lang, [
    "claimReportTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <ClaimReports />
      </TranslateWrapper>
    </Suspense>
  );
}
