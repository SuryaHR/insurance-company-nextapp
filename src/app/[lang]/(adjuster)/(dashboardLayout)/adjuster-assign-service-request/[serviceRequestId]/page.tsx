import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import AdjusterAssignServiceRequestContainer from "@/container/_adjuster_container/AdjusterAssignServiceRequestContainer";
import { breadCrumbTranslateType } from "@/translations/breadCrumbTranslate/en";

export interface breadCrumbTranslateProp {
  breadCrumbTranslate: breadCrumbTranslateType;
}

export default async function Page({
  params,
}: {
  params: { lang: Locale; serviceRequestId: string };
}) {
  const translate = await getTranslateList<breadCrumbTranslateProp>(params.lang, [
    "breadCrumbTranslate",
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <AdjusterAssignServiceRequestContainer
          serviceRequestId={params.serviceRequestId}
        />
      </TranslateWrapper>
    </Suspense>
  );
}
