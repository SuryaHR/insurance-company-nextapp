import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { breadCrumbTranslateType } from "@/translations/breadCrumbTranslate/en";
import AdjusterServiceRequestContainer from "@/container/_adjuster_container/AdjusterServiceRequestContainer";

export interface breadCrumbTranslateProp {
  breadCrumbTranslate: breadCrumbTranslateType;
}

export default async function Page({
  params,
}: {
  params: { lang: Locale; serviceRequestId: string; claimId: string };
}) {
  const translate = await getTranslateList<breadCrumbTranslateProp>(params.lang, [
    "breadCrumbTranslate",
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <AdjusterServiceRequestContainer claimId={params.claimId} />
      </TranslateWrapper>
    </Suspense>
  );
}
