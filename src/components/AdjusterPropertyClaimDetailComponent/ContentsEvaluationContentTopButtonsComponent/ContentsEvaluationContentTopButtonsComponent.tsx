"use client";
import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import cvStyle from "./content-evaluation.module.scss";
import CoverageSummaryList from "./CoverageSummaryList/CoverageSummaryList";
import DetailedInventoryList from "./DetailedInventoryList/DetailedInventoryList";
import PolicyholderPayouts from "./PolicyholderPayouts/PolicyholderPayouts";
import useTranslation from "@/hooks/useTranslation";
import { contentsEvaluationTranslateType } from "@/translations/contentsEvaluationTranslate/en";
import CustomLoader from "@/components/common/CustomLoader/index";

function ContentsEvaluationContentTopButtonsComponent() {
  const {
    loading,
    translate,
  }: { loading: boolean; translate: contentsEvaluationTranslateType | undefined } =
    useTranslation("contentsEvaluationTranslate");

  if (loading) {
    return (
      <div className="col-12 d-flex flex-column position-relative">
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }
  const tabsArray = [
    {
      name: translate?.detailedTabTitle || "",
      content: <DetailedInventoryList />,
    },
    {
      name: translate?.coverageTabTitle || "",
      content: <CoverageSummaryList />,
    },
    {
      name: translate?.policyTabTitle || "",
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
