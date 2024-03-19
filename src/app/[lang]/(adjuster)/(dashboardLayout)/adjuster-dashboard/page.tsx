import AdjusterDashboard from "@/container/_adjuster_container/AdjusterDashboardContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { adjusterDashboardTranslateType } from "@/translations/adjusterDashboardTranslate/en";

export interface adjusterDashboardTranslateProp {
  adjusterDashboardTranslate: adjusterDashboardTranslateType;
}

export default async function adjusterDashboard({
  params,
}: {
  params: { lang: Locale };
}) {
  const translate = await getTranslateList<adjusterDashboardTranslateProp>(params.lang, [
    "adjusterDashboardTranslate",
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <AdjusterDashboard translate={translate} />;
      </TranslateWrapper>
    </Suspense>
  );
}
