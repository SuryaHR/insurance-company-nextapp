"use client";
import React, { useEffect, useState } from "react";
import PolicyholderCard from "./components/PolicyholderCard";
import Cards from "@/components/common/Cards";
import Link from "next/link";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import style from "./components/policyholderCard.module.scss";
import PolicyHolderTable from "./PolicyHolderTable/PolicyHolderTable";
import { connect } from "react-redux";
import { RootState } from "@/store/store";
import { fetchPolicyHolderTableAction } from "@/reducers/ContentsEvaluation/DetailedInventorySlice";
import { exportPaymentSummaryToPDF } from "../DetailedInventoryList/DetailedInventoryFucn";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { contentsEvaluationTranslateType } from "@/translations/contentsEvaluationTranslate/en";
import useTranslation from "@/hooks/useTranslation";
import CustomLoader from "@/components/common/CustomLoader/index";

type PolicyHolderPayouts = {
  policyholderPayoutsData: any;
  fetchPolicyHolderTableAction: any;
  isfetching: boolean;
  listData: any;
};

function convertToFloatCurrency(value: any) {
  if (value) return Number.parseFloat(value).toFixed(2);
  else {
    return "0.00";
  }
}

function PolicyholderPayouts(props: PolicyHolderPayouts) {
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const { policyholderPayoutsData, fetchPolicyHolderTableAction, isfetching, listData } =
    props;
  const dispatch = useAppDispatch();
  const [isExportfetching, setIsExportfetching] = useState(false);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);

  useEffect(() => {
    fetchPolicyHolderTableAction({
      claimNumber: claimNumber,
    });
  }, [claimNumber, fetchPolicyHolderTableAction]);
  const {
    loading,
    translate,
  }: { loading: boolean; translate: contentsEvaluationTranslateType | undefined } =
    useTranslation("contentsEvaluationTranslate");

  useEffect(() => {
    getTotalPaidAmount();
  }, [listData.length]);

  function getTotalPaidAmount() {
    let totalAmountPaid = 0;
    if (listData) {
      listData.paymentSummaryDetails?.map(function (item: any) {
        totalAmountPaid += item.amountPaid;
      });
      setTotalAmountPaid(totalAmountPaid);
    }
  }

  if (loading) {
    return (
      <div className="col-12 d-flex flex-column position-relative">
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }
  return (
    <>
      {isfetching ? (
        <div>
          <CustomLoader />
        </div>
      ) : (
        <div className="row mb-4 mt-3 p-3">
          <div
            onClick={async () => {
              setIsExportfetching(true);
              const status = await exportPaymentSummaryToPDF(claimNumber);
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
                    message: "Failed download the PDF!",
                    id: "good",
                    status: "error",
                  })
                );
              }
            }}
            className={style.link}
          >
            <Link href="#">{translate?.policyholderPayouts.exportText}</Link>
          </div>
          {isExportfetching && <CustomLoader />}
          <div className="d-flex justify-content-center">
            <PolicyholderCard
              heading={translate?.policyholderPayouts.totalofitems || ""}
              value={policyholderPayoutsData?.totalNoOfItemsClaimed}
            />
            <PolicyholderCard
              heading={translate?.policyholderPayouts.totalitemspaidcashfor || ""}
              value={
                policyholderPayoutsData?.actualCashValueSettlementDTO?.noOfItemsCashed
              }
            />
            <PolicyholderCard
              heading={translate?.policyholderPayouts.totalitemsreplaced || ""}
              value={
                policyholderPayoutsData?.replacementCostSettlement?.noOfItemsReplaced
              }
            />
            <PolicyholderCard
              heading={translate?.policyholderPayouts.total$paid || ""}
              value={`$${convertToFloatCurrency(totalAmountPaid)}`}
            />
          </div>
          <div className="d-flex justify-content-center">
            <div className="d-flex m-3">
              <Cards className="p-3">
                <GenericComponentHeading
                  title={translate?.policyholderPayouts.replacementCostTitle}
                ></GenericComponentHeading>
                <div className={style.label}>
                  <b>{translate?.policyholderPayouts.itemsReplaced}</b>
                  <span className={style.value}>
                    $
                    {convertToFloatCurrency(
                      policyholderPayoutsData?.replacementCostSettlement
                        ?.noOfItemsReplaced
                    )}
                  </span>
                </div>
                <div className={style.label}>
                  <b>{translate?.policyholderPayouts.totalReplacementCost}</b>
                  <span className={style.value}>
                    $
                    {convertToFloatCurrency(
                      policyholderPayoutsData?.replacementCostSettlement
                        ?.totalReplacementCostIncludeTax
                    )}
                  </span>
                </div>
                <div className={style.label}>
                  <b>{translate?.policyholderPayouts.totalReceiptValue}</b>
                  <span className={style.value}>
                    $
                    {convertToFloatCurrency(
                      policyholderPayoutsData?.replacementCostSettlement
                        ?.totalReceiptValue
                    )}
                  </span>
                </div>
                <div className={style.label}>
                  <b>{translate?.policyholderPayouts.totalHoldoverPaid}</b>
                  <span className={style.value}>
                    $
                    {convertToFloatCurrency(
                      policyholderPayoutsData?.replacementCostSettlement
                        ?.totalHoldoverPaidIncludeTax
                    )}
                  </span>
                </div>
                <div className={style.label}>
                  <b>{translate?.policyholderPayouts.lessPolicyDeductible}</b>
                  <span className={style.value}>
                    $
                    {convertToFloatCurrency(
                      policyholderPayoutsData?.replacementCostSettlement
                        ?.lessPolicyDeductible
                    )}
                  </span>
                </div>
                <hr />
                <div className={style.label}>
                  <b>{translate?.policyholderPayouts.netReplacementCost}</b>
                  <span className={style.value}>
                    $
                    {convertToFloatCurrency(
                      policyholderPayoutsData?.replacementCostSettlement
                        ?.netReplacementCost
                    )}
                  </span>
                </div>
              </Cards>
            </div>
            <div>
              <div className="d-flex m-3">
                <Cards className="p-3">
                  <GenericComponentHeading
                    title={translate?.policyholderPayouts.actualCashTitle}
                  ></GenericComponentHeading>
                  <div className={style.label}>
                    <b>{translate?.policyholderPayouts.itemsCashed}</b>
                    <span className={style.value}>
                      $
                      {convertToFloatCurrency(
                        policyholderPayoutsData?.actualCashValueSettlementDTO
                          ?.noOfItemsCashed
                      )}
                    </span>
                  </div>
                  <div className={style.label}>
                    <b>{translate?.policyholderPayouts.actualTotalReplacementCost}</b>
                    <span className={style.value}>
                      $
                      {convertToFloatCurrency(
                        policyholderPayoutsData?.actualCashValueSettlementDTO
                          ?.totalReplacementCost
                      )}
                    </span>
                  </div>
                  <div className={style.label}>
                    <b>{translate?.policyholderPayouts.lessDepreciationCost}</b>
                    <span className={style.value}>
                      $
                      {convertToFloatCurrency(
                        policyholderPayoutsData?.actualCashValueSettlementDTO
                          ?.lessDepreciationCost
                      )}
                    </span>
                  </div>
                  <div className={style.label}>
                    <b>{translate?.policyholderPayouts.lessAmountOverLimit}</b>
                    <span className={style.value}>
                      $
                      {convertToFloatCurrency(
                        policyholderPayoutsData?.actualCashValueSettlementDTO
                          ?.lessAmountOverLimits
                      )}
                    </span>
                  </div>
                  <div className={style.label}>
                    <b>{translate?.policyholderPayouts.actualLessPolicyDeductible}</b>
                    <span className={style.value}>
                      $
                      {convertToFloatCurrency(
                        policyholderPayoutsData?.actualCashValueSettlementDTO
                          ?.lessPolicyDeductible
                      )}
                    </span>
                  </div>
                  <hr />
                  <div className={style.label}>
                    <b>{translate?.policyholderPayouts.netClaimCost}</b>
                    <span className={style.value}>
                      $
                      {convertToFloatCurrency(
                        policyholderPayoutsData?.actualCashValueSettlementDTO
                          ?.netClaimCost
                      )}
                    </span>
                  </div>
                </Cards>
              </div>
            </div>
          </div>

          <PolicyHolderTable />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  policyholderPayoutsData: state.detailedInventorydata?.policyHolderListDataFull,
  isfetching: state.detailedInventorydata?.policyHolderfetching,
  listData: state.detailedInventorydata?.policySummaryListDataFull,
});

const mapDispatchToProps = {
  fetchPolicyHolderTableAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(PolicyholderPayouts);
