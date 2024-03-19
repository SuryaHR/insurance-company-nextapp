import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import AdjusterPropertyClaimDetailContainer from "@/container/_adjuster_container/AdjusterPropertyClaimDetailContainer";
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
import { serviceRequestTranslateType } from "@/translations/serviceRequestTranslate/en";

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
  serviceRequestTranslate: serviceRequestTranslateType;
}

export default async function Page({
  params,
}: {
  params: { claimId: string; lang: Locale };
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
    "serviceRequestTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <AdjusterPropertyClaimDetailContainer claimId={params.claimId} />
      </TranslateWrapper>
    </Suspense>
  );
}
