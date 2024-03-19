import AllNotesContainer from "@/container/_adjuster_container/AllNotesContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";
import { breadCrumbTranslateType } from "@/translations/breadCrumbTranslate/en";
export interface allNotesTranslatePropType {
  breadCrumbTranslate: breadCrumbTranslateType;
}

export default async function AllNotes({
  params,
}: {
  params: { claimId: string; lang: Locale };
}) {
  const translate = await getTranslateList<allNotesTranslatePropType>(params.lang, [
    "breadCrumbTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <AllNotesContainer claimId={params.claimId} />
      </TranslateWrapper>
    </Suspense>
  );
}
