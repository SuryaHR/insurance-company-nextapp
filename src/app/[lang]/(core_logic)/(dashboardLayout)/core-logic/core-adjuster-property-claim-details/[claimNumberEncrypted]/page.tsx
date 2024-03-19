import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { breadCrumbTranslateType } from "@/translations/breadCrumbTranslate/en";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import { claimDocumentsTranslateType } from "@/translations/claimDocumentsTranslate/en";
import { contentListTranslateType } from "@/translations/contentListTranslate/en";
import { claimParticipantsTranslateType } from "@/translations/claimParticipantsTranslate/en";
import { adjusterPropertyClaimActivityLogType } from "@/translations/adjusterPropertyClaimActivityLog/en";
import { contentsEvaluationTranslateType } from "@/translations/contentsEvaluationTranslate/en";
import { vendorAssignmentTranslateType } from "@/translations/vendorAssignmentTranslate/en";
import { PolicyAndCoverageDetailsTranslateType } from "@/translations/PolicyAndCoverageDetailsTranslate/en";
import { addItemModalTranslateType } from "@/translations/addItemModalTranslate/en";
import CoreAdjusterPropertyClaimDetailContainer from "@/container/_core_logic_container/CoreAdjusterPropertyClaimDetailContainer/CoreAdjusterPropertyClaimDetailContainer";

export interface claimDetailTranslatePropType {
  breadCrumbTranslate: breadCrumbTranslateType;
  claimDetailsTabTranslate: claimDetailsTabTranslateType;
  claimDocumentsTranslate: claimDocumentsTranslateType;
  contentListTranslate: contentListTranslateType;
  claimParticipantsTranslate: claimParticipantsTranslateType;
  adjusterPropertyClaimActivityLog: adjusterPropertyClaimActivityLogType;
  contentsEvaluationTranslate: contentsEvaluationTranslateType;
  vendorAssignmentTranslate: vendorAssignmentTranslateType;
  PolicyAndCoverageDetailsTranslate: PolicyAndCoverageDetailsTranslateType;
  addItemModalTranslate: addItemModalTranslateType;
}

export default async function Page({
  params,
}: {
  params: { claimNumberEncrypted: string; lang: Locale };
}) {
  const translate = await getTranslateList<claimDetailTranslatePropType>(params.lang, [
    "breadCrumbTranslate",
    "claimDetailsTabTranslate",
    "claimDocumentsTranslate",
    "contentListTranslate",
    "claimParticipantsTranslate",
    "adjusterPropertyClaimActivityLog",
    "contentsEvaluationTranslate",
    "vendorAssignmentTranslate",
    "PolicyAndCoverageDetailsTranslate",
    "addItemModalTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <CoreAdjusterPropertyClaimDetailContainer
          claimNumberEncrypted={params.claimNumberEncrypted}
        />
      </TranslateWrapper>
    </Suspense>
  );
}
