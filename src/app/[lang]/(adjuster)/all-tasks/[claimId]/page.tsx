import AllTasksContainer from "@/container/_adjuster_container/AllTasksContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";

export interface allTaskTranslatePropType {
  claimDetailsTabTranslate: claimDetailsTabTranslateType;
}

export default async function AllTasks({
  params,
}: {
  params: { claimId: string; lang: Locale };
}) {
  const translate = await getTranslateList<allTaskTranslatePropType>(params.lang, [
    "claimDetailsTabTranslate",
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <AllTasksContainer claimId={params.claimId} />
      </TranslateWrapper>
    </Suspense>
  );
}
