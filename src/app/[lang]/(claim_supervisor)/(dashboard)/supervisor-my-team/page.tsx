import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import SupervisoMyTeamContainer from "@/container/_claim_supervisor_container/SupervisorMyTeamContainer/index";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";
import { supervisorMyTeamType } from "@/translations/supervisorMyTeamTranslate/en";

export interface supervisorMyTeamPropType {
  supervisorMyTeamTranslate: supervisorMyTeamType;
}

export default async function NewClaims({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<supervisorMyTeamPropType>(params.lang, [
    "supervisorMyTeamTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <SupervisoMyTeamContainer />
      </TranslateWrapper>
    </Suspense>
  );
}
