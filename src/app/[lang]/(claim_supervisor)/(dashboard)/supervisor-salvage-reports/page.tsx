import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { slavageReportType } from "@/translations/slavageReportTranslate/en";
import SupervisorSalvageReportsContainer from "@/container/_claim_supervisor_container/SupervisorSalvageReportsContainer/SupervisorSalvageReportsContainer";

export interface slavageReportProp {
  slavageReportTranslate: slavageReportType;
}

export default async function adjusterDashboard({
  params,
}: {
  params: { lang: Locale };
}) {
  const translate = await getTranslateList<slavageReportProp>(params.lang, [
    "slavageReportTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <SupervisorSalvageReportsContainer />;
      </TranslateWrapper>
    </Suspense>
  );
}
