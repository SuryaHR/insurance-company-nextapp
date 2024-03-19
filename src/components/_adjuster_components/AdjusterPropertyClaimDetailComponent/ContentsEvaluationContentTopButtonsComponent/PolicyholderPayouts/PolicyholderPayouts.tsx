"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import Link from "next/link";

import style from "./components/policyholderCard.module.scss";

import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { fetchPolicyHolderTableAction } from "@/reducers/_adjuster_reducers/ContentsEvaluation/DetailedInventorySlice";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { RootState } from "@/store/store";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import Cards from "@/components/common/Cards";
import CustomLoader from "@/components/common/CustomLoader/index";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";

import { exportPaymentSummaryToPDF } from "../DetailedInventoryList/DetailedInventoryFucn";
import PolicyholderCard from "./components/PolicyholderCard";
import PayoutHolderInfo from "./PayoutHolderInfo/PayoutHolderInfo";
import PolicyHolderTable from "./PolicyHolderTable/PolicyHolderTable";

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
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const { policyholderPayoutsData, fetchPolicyHolderTableAction, isfetching, listData } =
    props;
  const dispatch = useAppDispatch();
  const [isExportfetching, setIsExportfetching] = useState(false);
  const [showPayoutPayout, setShowPayoutPayout] = useState(true);
  const [paymentId, setPaymentId] = useState<number>(0);

  const [totalAmountPaid, setTotalAmountPaid] = useState(0);

  useEffect(() => {
    fetchPolicyHolderTableAction({
      claimNumber: claimNumber,
    });
  }, [claimNumber, fetchPolicyHolderTableAction]);

  const getTotalPaidAmount = useCallback(() => {
    let totalAmountPaid = 0;
    if (listData?.length > 0) {
      listData?.paymentSummaryDetails?.forEach(function (item: any) {
        totalAmountPaid += item.amountPaid;
      });
      setTotalAmountPaid(totalAmountPaid);
    }
  }, [listData, setTotalAmountPaid]);

  useEffect(() => {
    getTotalPaidAmount();
  }, [listData?.length, getTotalPaidAmount]);

  const handleRowClick = (rowData: any) => {
    setPaymentId(rowData.paymentID);
    setShowPayoutPayout(!showPayoutPayout);
  };

  const handleBack = () => {
    setShowPayoutPayout(!showPayoutPayout);
  };

  return (
    <>
      {showPayoutPayout ? (
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
                <Link href="#">
                  {translate?.contentsEvaluationTranslate?.policyholderPayouts.exportText}
                </Link>
              </div>
              {isExportfetching && <CustomLoader />}
              <div className="d-flex justify-content-center">
                <PolicyholderCard
                  heading={
                    translate?.contentsEvaluationTranslate?.policyholderPayouts
                      .totalofitems || ""
                  }
                  value={policyholderPayoutsData?.totalNoOfItemsClaimed}
                />
                <PolicyholderCard
                  heading={
                    translate?.contentsEvaluationTranslate?.policyholderPayouts
                      .totalitemspaidcashfor || ""
                  }
                  value={
                    policyholderPayoutsData?.actualCashValueSettlementDTO?.noOfItemsCashed
                  }
                />
                <PolicyholderCard
                  heading={
                    translate?.contentsEvaluationTranslate?.policyholderPayouts
                      .totalitemsreplaced || ""
                  }
                  value={
                    policyholderPayoutsData?.replacementCostSettlement?.noOfItemsReplaced
                  }
                />
                <PolicyholderCard
                  heading={
                    translate?.contentsEvaluationTranslate?.policyholderPayouts
                      .total$paid || ""
                  }
                  value={`$${convertToFloatCurrency(totalAmountPaid)}`}
                />
              </div>
              <div className="col-12 d-flex justify-content-center">
                <div className="col-5 d-flex m-3">
                  <Cards className="col-12 p-3">
                    <GenericComponentHeading
                      title={
                        translate?.contentsEvaluationTranslate?.policyholderPayouts
                          .replacementCostTitle
                      }
                    ></GenericComponentHeading>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .itemsReplaced
                        }
                      </b>
                      <span className={style.value}>
                        $
                        {convertToFloatCurrency(
                          policyholderPayoutsData?.replacementCostSettlement
                            ?.noOfItemsReplaced
                        )}
                      </span>
                    </div>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .totalReplacementCost
                        }
                      </b>
                      <span className={style.value}>
                        $
                        {convertToFloatCurrency(
                          policyholderPayoutsData?.replacementCostSettlement
                            ?.totalReplacementCostIncludeTax
                        )}
                      </span>
                    </div>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .totalReceiptValue
                        }
                      </b>
                      <span className={style.value}>
                        $
                        {convertToFloatCurrency(
                          policyholderPayoutsData?.replacementCostSettlement
                            ?.totalReceiptValue
                        )}
                      </span>
                    </div>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .totalHoldoverPaid
                        }
                      </b>
                      <span className={style.value}>
                        $
                        {convertToFloatCurrency(
                          policyholderPayoutsData?.replacementCostSettlement
                            ?.totalHoldoverPaidIncludeTax
                        )}
                      </span>
                    </div>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .lessPolicyDeductible
                        }
                      </b>
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
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .netReplacementCost
                        }
                      </b>
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

                <div className="col-5 d-flex m-3">
                  <Cards className="col-12 p-3">
                    <GenericComponentHeading
                      title={
                        translate?.contentsEvaluationTranslate?.policyholderPayouts
                          .actualCashTitle
                      }
                    ></GenericComponentHeading>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .itemsCashed
                        }
                      </b>
                      <span className={style.value}>
                        $
                        {convertToFloatCurrency(
                          policyholderPayoutsData?.actualCashValueSettlementDTO
                            ?.noOfItemsCashed
                        )}
                      </span>
                    </div>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .actualTotalReplacementCost
                        }
                      </b>
                      <span className={style.value}>
                        $
                        {convertToFloatCurrency(
                          policyholderPayoutsData?.actualCashValueSettlementDTO
                            ?.totalReplacementCost
                        )}
                      </span>
                    </div>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .lessDepreciationCost
                        }
                      </b>
                      <span className={style.value}>
                        $
                        {convertToFloatCurrency(
                          policyholderPayoutsData?.actualCashValueSettlementDTO
                            ?.lessDepreciationCost
                        )}
                      </span>
                    </div>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .lessAmountOverLimit
                        }
                      </b>
                      <span className={style.value}>
                        $
                        {convertToFloatCurrency(
                          policyholderPayoutsData?.actualCashValueSettlementDTO
                            ?.lessAmountOverLimits
                        )}
                      </span>
                    </div>
                    <div className={style.label}>
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .actualLessPolicyDeductible
                        }
                      </b>
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
                      <b>
                        {
                          translate?.contentsEvaluationTranslate?.policyholderPayouts
                            .netClaimCost
                        }
                      </b>
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
              <PolicyHolderTable handleRowClick={handleRowClick} />
            </div>
          )}
        </>
      ) : (
        <PayoutHolderInfo id={paymentId} handleBack={handleBack} />
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
