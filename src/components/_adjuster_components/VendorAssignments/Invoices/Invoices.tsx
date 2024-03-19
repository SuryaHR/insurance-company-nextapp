"use client";
import React, { useEffect, useState } from "react";
import styles from "./Invoices.module.scss";
import { getInvoiceData } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import CustomLoader from "@/components/common/CustomLoader";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import InvoiceTable from "@/components/_adjuster_components/VendorAssignments/InvoiceTable";
import { convertToCurrentTimezone } from "@/utils/helper";
import InvoiceView from "../InvoiceView/InvoiceView";
import { getUSDCurrency } from "@/utils/utitlity";
import Modal from "@/components/common/ModalPopups";
import PayNowPopup from "../PayNowPopup/PayNowPopup";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

interface InvoiceState {
  data: any[];
  count: number;
  totalInvoicesPaid: number;
  totalOfInvoices: number;
  totalAmountPaid: number;
  totalAmountToBePaid: number;
  viewInvoice: boolean;
}

function Invoices() {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const initialInvoiceState: InvoiceState = {
    data: [],
    count: 0,
    totalInvoicesPaid: 0,
    totalOfInvoices: 0,
    totalAmountPaid: 0,
    totalAmountToBePaid: 0,
    viewInvoice: false,
  };

  const [invoiceState, setInvoiceState] = useState<InvoiceState>(initialInvoiceState);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [payNowData, setPayNowData] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);

  const init = React.useCallback(async () => {
    setIsLoader(true);
    const payload = {
      claimNumber: sessionStorage.getItem("claimNumber"),
      assignmentNumber: null,
    };
    try {
      const res: any = await getInvoiceData(payload);

      const allInvoices: any = [];
      let totalOfInvoices = 0;
      const totalAmountPaid = 0;

      const updatedRes = res?.data?.map((item: any) => {
        let totalAmount = 0;
        const updatedInvoices = item?.invoices?.map((subItem: any) => {
          allInvoices.push(subItem);
          totalAmount += subItem.amount;
          totalOfInvoices += subItem.amount;

          return {
            "Invoice Id": subItem?.invoiceNumber,
            Amount: "$" + subItem?.amount,
            "Invoice Date": convertToCurrentTimezone(subItem?.createDate),
            "Due Date": convertToCurrentTimezone(subItem?.dueDate),
            Status: subItem?.status?.status,
            "Vendor Note": subItem?.vendorNote,
            Attachments: subItem?.Attachments,
            Action: "",
            completeData: JSON.stringify(item),
          };
        });

        return {
          ...item,
          totalAmount: totalAmount,
          invoices: updatedInvoices,
        };
      });

      const paidInvoices = allInvoices.filter((invoice: any) => invoice.status.id == 2);
      setInvoiceState({
        ...invoiceState,
        data: updatedRes,
        count: allInvoices?.length,
        totalInvoicesPaid: paidInvoices.length,
        totalOfInvoices: totalOfInvoices,
        totalAmountPaid: paidInvoices.reduce((a: any, b: any) => a + b.amount, 0),
        totalAmountToBePaid: totalOfInvoices - totalAmountPaid,
      });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const addLoader = () => {
    setIsLoader(true);
  };

  const removeLoader = () => {
    setIsLoader(false);
  };

  const payNowClick = (data: any) => {
    setIsModalOpen(true);
    setPayNowData(data);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
    setIsModalOpen(false);
    init();
  };

  const columns: any = [
    translate?.vendorAssignmentTranslate?.invoices?.invoiceId,
    translate?.vendorAssignmentTranslate?.invoices?.amount,
    translate?.vendorAssignmentTranslate?.invoices?.invoiceDate,
    translate?.vendorAssignmentTranslate?.invoices?.dueDate,
    translate?.vendorAssignmentTranslate?.invoices?.status,
    translate?.vendorAssignmentTranslate?.invoices?.vendorNote,
    translate?.vendorAssignmentTranslate?.invoices?.attachments,
    translate?.vendorAssignmentTranslate?.invoices?.action,
  ];

  const invoiceRowClick = (data: any) => {
    sessionStorage.setItem("invoiceNumber", data["Invoice Id"]);
    setInvoiceState((prevState) => ({
      ...prevState,
      viewInvoice: true,
    }));
  };

  return (
    <React.Fragment>
      {!invoiceState?.viewInvoice && (
        <div className={styles.assignmentsCont}>
          {isLoader && <CustomLoader loaderType="spinner1" />}
          <GenericComponentHeading
            title={
              translate?.vendorAssignmentTranslate?.invoices
                ?.replacementQuotesSummaryTitle
            }
          />

          <div className={styles.cardCont}>
            <div className={styles.cardBorderTop}>
              <label className={styles.h2Replacement}>
                <a className={styles.totVenInvoCount} href="#">
                  {invoiceState?.count}
                </a>
              </label>
              <label className={styles.totVenInvoHead}>
                {translate?.vendorAssignmentTranslate?.invoices?.totalVendorInvoices}
              </label>
              <label
                className={`${styles.h6Replacement} ${styles.colorGreen} ${styles.totVenInvoSta}`}
              >
                {invoiceState?.totalInvoicesPaid}{" "}
                {translate?.vendorAssignmentTranslate?.invoices?.invoicesPaid}
              </label>
            </div>
            <div className={styles.cardBorderTop}>
              <label
                className={`${styles.h2Replacement} ${styles.marginTop18} ${styles.totalDollInvoiceCount}`}
              >
                {getUSDCurrency(invoiceState?.totalOfInvoices)}
              </label>
              <label className={styles.totalDollInvoice}>
                {translate?.vendorAssignmentTranslate?.invoices?.totalInvoices}
              </label>
            </div>
            <div className={styles.cardBorderTop}>
              <label
                className={`${styles.h2Replacement} ${styles.totalDollInvoiceCount}`}
              >
                {getUSDCurrency(invoiceState?.totalAmountPaid)}
              </label>
              <label className={styles.totalDollInvoice}>
                {translate?.vendorAssignmentTranslate?.invoices?.totalPaid}
              </label>
              <label
                className={`${styles.h6Replacement} ${styles.colorRed} ${styles.totVenInvoSta}`}
              >
                {getUSDCurrency(invoiceState?.totalAmountToBePaid)}{" "}
                {translate?.vendorAssignmentTranslate?.invoices?.toBePaid}
              </label>
            </div>
          </div>

          <div className={styles.tableTop}></div>
          <InvoiceTable
            invoiceRowClick={invoiceRowClick}
            data={invoiceState?.data ?? []}
            columns={columns}
            actionPayNowMethod={payNowClick}
          />
        </div>
      )}
      {invoiceState?.viewInvoice && (
        <div>
          <InvoiceView />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        childComp={
          <PayNowPopup
            translate={{}}
            payNowData={payNowData}
            handleOpenModal={handleOpenModal}
            addLoader={addLoader}
            removeLoader={removeLoader}
          />
        }
        headingName={"Invoice# : " + payNowData["Invoice Id"]}
        modalWidthClassName={styles.modalWidth}
      ></Modal>
    </React.Fragment>
  );
}

export default Invoices;
