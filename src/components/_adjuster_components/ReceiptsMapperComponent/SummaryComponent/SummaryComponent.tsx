"use client";
import React, { useState, useEffect, useRef } from "react";
import SummaryTableComponent from "./SummaryTableComponent/SummaryTableComponent";
import { useParams } from "next/navigation";
import {
  exportSummaryToPDF,
  getClaimedItems,
} from "@/services/_adjuster_services/ReceiptMapper/ReceiptMapperService";
import CategorySelectList from "../CategorySelectList/CategorySelectList";
import GenericButton from "@/components/common/GenericButton/index";
import receiptMapperStyle from "../receiptMapperComponent.module.scss";
import { LuRefreshCw } from "react-icons/lu";
import clsx from "clsx";
import SummarySearchComponent from "./SummarySearchComponent/SummarySearchComponent";
import { ConnectedProps, connect } from "react-redux";
import { getUSDCurrency } from "@/utils/utitlity";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import HoldOverPaidModal from "./HoldOverPaidModal/index";
import {
  addClaimedItemsKeyWord,
  setSelectedCategory,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";

interface typeProps {
  [key: string | number]: any;
}
const SummaryComponent: React.FC<connectorType & typeProps> = (props) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const { claimId } = useParams();
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const {
    claimedItemsList,
    totalCashPaid,
    noOfHoldoverItems,
    TotalHoldoverPaid,
    TotalHoldoverDue,
    addNotification,
    addClaimedItemsKeyWord,
    setSelectedCategory,
  } = props;

  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [dueAmountCalc, setdueAmount] = useState<number>(0);
  const [selectedClaimedItems, setSelectedItems] = useState<any>([]);
  const [selectedRows, setSelectedRows] = React.useState<any>({});

  const getItems = async () => {
    setTableLoader(true);
    await getClaimedItems({
      claimId: claimId,
      reqForReceiptMapper: true,
    });
    setTableLoader(false);
  };
  const hasApiCalledRef = useRef(false);

  useEffect(() => {
    if (!hasApiCalledRef.current) {
      hasApiCalledRef.current = true;
      getItems();
    }
    return () => {
      const selectedCategory = { value: 0, label: "All" };
      addClaimedItemsKeyWord({ searchKeyword: "" });
      setSelectedCategory(selectedCategory);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId]);

  const handleDownloadSummaryPDF = async () => {
    setTableLoader(true);
    const status = await exportSummaryToPDF(claimNumber);
    if (status === "success") {
      addNotification({
        message: "Successfully download the PDF!",
        id: "good",
        status: "success",
      });
    } else if (status === "error") {
      addNotification({
        message: "Failed to export the details. Please try again..",
        id: "error",
        status: "error",
      });
    }
    setTableLoader(false);
  };
  useEffect(() => {
    const selectedItems = claimedItemsList.filter((item: any) => item.selected);
    setSelectedItems(selectedItems);
  }, [claimedItemsList]);

  const handleModalToggle = () => {
    setModalOpen(!isModalOpen);
  };
  const holdoverCheck = () => {
    let dueAmmount = 0;
    let count = 0;
    selectedClaimedItems.map((item: any) => {
      if (
        item.status &&
        item.status.status &&
        (item.status.status == "REPLACED" || item.status.status == "PARTIAL REPLACED") &&
        item.selected
      ) {
        count++;
        if (item.holdOverDue) dueAmmount = dueAmmount + item.holdOverDue;
      }
    });

    if (dueAmmount == 0 && count == 0) {
      addNotification({
        message: `Paying a sum of Holdover for all items should be greater than $0.00`,
        id: "holdover_Error",
        status: "error",
      });
      return false;
    }

    if (dueAmmount == 0) {
      addNotification({
        message: `Due amount is $0.00`,
        id: "holdover_Error",
        status: "error",
      });
      return false;
    }
    if (dueAmmount) {
      handleModalToggle();
      setdueAmount(dueAmmount);
    } else if (count > 0) {
      // to do some calculation and API call
    }
  };

  return (
    <div className="row mt-2">
      {isModalOpen && (
        <HoldOverPaidModal
          isOpen={isModalOpen}
          onClose={handleModalToggle}
          // handleLoader={handleLoader}
          claimId={claimId}
          selectedClaimedItems={selectedClaimedItems}
          dueAmmount={dueAmountCalc}
          setSelectedRows={setSelectedRows}
          setTableLoader={setTableLoader}
        />
      )}

      <div className="col-12">
        <div className={receiptMapperStyle.holdOverSection}>
          <GenericButton
            label={translate?.receiptMapperTranslate?.summary?.payHoldover}
            size="medium"
            btnClassname={receiptMapperStyle.holdOverBtn}
            disabled={selectedClaimedItems.length < 1}
            onClick={() => holdoverCheck()}
          />
          <GenericButton
            label={translate?.receiptMapperTranslate?.summary?.downloadAsPdf}
            size="medium"
            btnClassname={receiptMapperStyle.holdOverBtn}
            onClick={() => handleDownloadSummaryPDF()}
          />
          <LuRefreshCw
            color="#337ab7"
            className="mx-1 cursor-pointer"
            onClick={() => {
              getItems();
            }}
          />
        </div>
        <div className={receiptMapperStyle.paidSection}>
          <div className={clsx(receiptMapperStyle.cashValueSection, "col-3")}>
            <div className="my-1">
              <label className={receiptMapperStyle.labelText}>
                {translate?.receiptMapperTranslate?.summary?.cashValuePaid}
              </label>
            </div>
            <div className={receiptMapperStyle.itemPrice}>
              <div>
                <span className={receiptMapperStyle.labelText}>
                  {claimedItemsList.length}
                </span>{" "}
                <span>{translate?.receiptMapperTranslate?.summary?.items}</span>
              </div>
              <div>
                <span className={receiptMapperStyle.spanMargin}>|</span>
                <span className={receiptMapperStyle.labelText}>
                  {getUSDCurrency(totalCashPaid)}
                </span>
              </div>
            </div>
          </div>
          <div className={clsx(receiptMapperStyle.holderPaymentSection, "col-3")}>
            <div className="my-1">
              <label className={receiptMapperStyle.labelText}>
                {translate?.receiptMapperTranslate?.summary?.holdoverPayments}
              </label>
            </div>
            <div className={receiptMapperStyle.itemPrice}>
              <div>
                <span className={receiptMapperStyle.labelText}>{noOfHoldoverItems}</span>{" "}
                <span>{translate?.receiptMapperTranslate?.summary?.items}</span>
              </div>
              <div>
                <span className={receiptMapperStyle.spanMargin}>|</span>{" "}
                <span className={receiptMapperStyle.labelTextGreen}>
                  {getUSDCurrency(TotalHoldoverPaid)}
                </span>{" "}
                <span className={receiptMapperStyle.spanMargin}>
                  {translate?.receiptMapperTranslate?.summary?.of}
                </span>{" "}
                <span className={receiptMapperStyle.labelTextRed}>
                  {getUSDCurrency(TotalHoldoverPaid + TotalHoldoverDue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className={receiptMapperStyle.claimedItemListContainer}>
          <div className="col-3">
            <GenericButton
              btnClassname={receiptMapperStyle.clearAll}
              label={translate?.receiptMapperTranslate?.summary?.clearAllFilter}
              theme="linkBtn"
              onClickHandler={async () => {
                const selectedCategory = { value: 0, label: "All" };
                addClaimedItemsKeyWord({ searchKeyword: "" });
                setSelectedCategory(selectedCategory);
                await getItems();
                setClearFilter(true);
              }}
            />
          </div>
          <div className="col-4">
            <CategorySelectList />
          </div>
          <div className="col-4">
            <SummarySearchComponent setTableLoader={setTableLoader} />
          </div>
        </div>
        <SummaryTableComponent
          setTableLoader={setTableLoader}
          tableLoader={tableLoader}
          clearFilter={clearFilter}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          setClearFilter={setClearFilter}
        />
      </div>
    </div>
  );
};
const mapStateToProps = ({ claimedItems }: any) => ({
  claimedItemsList: claimedItems.claimedItemsList,
  totalCashPaid: claimedItems.totalCashPaid,
  noOfHoldoverItems: claimedItems.noOfHoldoverItems,
  TotalHoldoverPaid: claimedItems.TotalHoldoverPaid,
  TotalHoldoverDue: claimedItems.TotalHoldoverDue,
});

const mapDispatchToProps = {
  addNotification,
  setSelectedCategory,
  addClaimedItemsKeyWord,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(SummaryComponent);
