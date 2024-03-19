import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import React, { useState } from "react";
import Link from "next/link";
import CoverageSummaryTable from "./CoverageSummaryTable/CoverageSummaryTable";
import CoverageSummaryListStyle from "./CoverageSummaryList.module.scss";
import { exportCoverageSummaryToPDF } from "../DetailedInventoryList/DetailedInventoryFucn";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import CustomLoader from "@/components/common/CustomLoader/index";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

function CoverageSummaryList() {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const dispatch = useAppDispatch();
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const [isExportfetching, setIsExportfetching] = useState(false);

  return (
    <div className={CoverageSummaryListStyle.tabContent}>
      <div
        onClick={async () => {
          setIsExportfetching(true);
          const status = await exportCoverageSummaryToPDF(claimNumber);
          if (status === "success") {
            setIsExportfetching(false);
            dispatch(
              addNotification({
                message: "Successfully download the PDF!",
                id: "good",
                status: "success",
              })
            );
          } else if (status === "error") {
            setIsExportfetching(false);
            dispatch(
              addNotification({
                message: "Failed download the PDF!. Please try again..",
                id: "good",
                status: "error",
              })
            );
          }
        }}
        className={CoverageSummaryListStyle.link}
      >
        <Link href="#">
          {translate?.contentsEvaluationTranslate?.coverageSummary.exportText}
        </Link>
      </div>
      {isExportfetching && <CustomLoader />}
      <div>
        <div className={CoverageSummaryListStyle.CoverageSummaryTableScrollContainer}>
          <div
            className={`${CoverageSummaryListStyle.coverageSummaryListHeaderContainer} mt-4`}
          >
            <GenericComponentHeading
              title={translate?.contentsEvaluationTranslate?.coverageSummary?.title}
              customHeadingClassname={CoverageSummaryListStyle.coverageSummaryListHeader}
            />
          </div>
          <CoverageSummaryTable />
        </div>
      </div>
    </div>
  );
}

export default CoverageSummaryList;
