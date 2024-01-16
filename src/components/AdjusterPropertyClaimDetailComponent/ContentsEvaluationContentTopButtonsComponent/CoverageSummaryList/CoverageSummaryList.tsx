import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import React, { useState } from "react";
import Link from "next/link";
import CoverageSummaryTable from "./CoverageSummaryTable/CoverageSummaryTable";
import CoverageSummaryListStyle from "./CoverageSummaryList.module.scss";
import { exportCoverageSummaryToPDF } from "../DetailedInventoryList/DetailedInventoryFucn";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import useTranslation from "@/hooks/useTranslation";
import { contentsEvaluationTranslateType } from "@/translations/contentsEvaluationTranslate/en";
import CustomLoader from "@/components/common/CustomLoader/index";

function CoverageSummaryList() {
  const dispatch = useAppDispatch();
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const [isExportfetching, setIsExportfetching] = useState(false);
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
        <Link href="#">{translate?.coverageSummary.exportText}</Link>
      </div>
      {isExportfetching && <CustomLoader />}
      <div>
        <div className={CoverageSummaryListStyle.CoverageSummaryTableScrollContainer}>
          <div
            className={`${CoverageSummaryListStyle.coverageSummaryListHeaderContainer} mt-4`}
          >
            <GenericComponentHeading
              title={translate?.coverageSummary?.title}
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
