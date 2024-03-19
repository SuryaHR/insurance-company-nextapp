"use client";
import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import cvStyle from "./content-evaluation.module.scss";
import CoverageSummaryList from "./CoverageSummaryList/CoverageSummaryList";
import DetailedInventoryList from "./DetailedInventoryList/DetailedInventoryList";
import PolicyholderPayouts from "./PolicyholderPayouts/PolicyholderPayouts";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

function ContentsEvaluationContentTopButtonsComponent() {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const tabsArray = [
    {
      name: translate?.contentsEvaluationTranslate?.detailedTabTitle || "",
      content: <DetailedInventoryList />,
    },
    {
      name: translate?.contentsEvaluationTranslate?.coverageTabTitle || "",
      content: <CoverageSummaryList />,
    },
    {
      name: translate?.contentsEvaluationTranslate?.policyTabTitle || "",
      content: <PolicyholderPayouts />,
    },
  ];
  return (
    <div className={cvStyle.TabContainer}>
      <TabsButtonComponent tabData={tabsArray} />
    </div>
  );
}

export default ContentsEvaluationContentTopButtonsComponent;
