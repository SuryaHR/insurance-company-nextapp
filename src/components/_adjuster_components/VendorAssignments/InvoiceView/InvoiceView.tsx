"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./InvoiceView.module.scss";
import {
  quoteInvoiceData,
  exportInvoicePdf,
  invoiceVoid,
  invoiceSupReview,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import CustomLoader from "@/components/common/CustomLoader";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import GenericButton from "@/components/common/GenericButton";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { convertToCurrentTimezone } from "@/utils/helper";
import { getUSDCurrency } from "@/utils/utitlity";
import PayNowInvoice from "./PayNowInvoice/PayNowInvoice";
import PaymentDetails from "./PaymentDetails/PaymentDetails";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import Modal from "@/components/common/ModalPopups";
import ContractDetails from "./ContractDetails/ContractDetails";

interface propsTypes {
  invoiceId?: string;
}
const InvoiceView: React.FC<propsTypes> = ({ invoiceId }) => {
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [invoiceViewRes, setInvoiceViewRes] = useState<any>([]);
  const [showPayNow, setShowPayNow] = useState<boolean>(false);
  const [showVoidBtn, setShowVoidBtn] = useState<boolean>(false);
  const [showPayBtn, setShowPayBtn] = useState<boolean>(false);
  const [showSupReviewBtn, setShowSupReviewBtn] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [totalPay, setTotalPay] = useState<any>(0);
  const invoiceNumber = invoiceId ? invoiceId : sessionStorage.getItem("invoiceNumber");
  const dispatch = useAppDispatch();

  type InvoiceData = {
    billingCode: any;
    description: any;
    units: string;
    rate: string;
    subTotal: any;
    taxRate: any;
    total: any;
  };

  const init = useCallback(async () => {
    setIsLoader(true);
    try {
      const response = await quoteInvoiceData(invoiceId);
      const invoiceData = response?.data;
      const { invoiceDetails } = invoiceData ?? {};
      const {
        advancePayment = 0,
        deductible = 0,
        amount = 0,
        status,
      } = invoiceDetails ?? {};
      const payInvoice = status?.status === "APPROVED" || status?.status === "PAID";
      const roleList = sessionStorage.getItem("RoleList") || "";
      const isClaimSupervisor = roleList.includes("CLAIM SUPERVISOR");
      const isSupervisorApproval = status?.status === "SUPERVISOR APPROVAL";
      const isPay = status?.status !== "PAID";
      setShowSupReviewBtn(!payInvoice && !isClaimSupervisor && !isSupervisorApproval);
      setShowVoidBtn(!payInvoice);
      setShowPayBtn(isPay);
      setInvoiceViewRes(invoiceData);
      setTotalPay(amount - (advancePayment + deductible));
    } catch (error) {
      console.error("Error fetching quote invoice data:", error);
    } finally {
      setShowPayNow(false);
      setIsLoader(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    init();
  }, [init]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const columnHelper = createColumnHelper<InvoiceData>();
  const columns = [
    columnHelper.accessor("billingCode", {
      header: () => "Billing Code",
      enableSorting: true,
    }),
    columnHelper.accessor("description", {
      header: () => "Description",
      enableSorting: true,
    }),
    columnHelper.accessor("units", {
      header: () => "Quantity",
      enableSorting: true,
    }),
    columnHelper.accessor("rate", {
      header: () => "Rate",
      enableSorting: true,
    }),
    columnHelper.accessor("subTotal", {
      header: () => "Sub-Total",
      enableSorting: true,
    }),
    columnHelper.accessor("taxRate", {
      header: () => "Tax Rate	",
      enableSorting: true,
    }),
    columnHelper.accessor("total", {
      header: () => "Total",
      enableSorting: true,
    }),
  ];

  const invoiceTableDataForView = invoiceViewRes?.invoiceItems?.map((obj: any) => {
    const newObj: any = {};
    newObj["billingCode"] = obj?.lineItemServiceType?.billingCode;
    newObj["description"] = obj?.lineItemServiceType?.description;
    newObj["units"] = obj?.units;
    newObj["rate"] = getUSDCurrency(obj?.rate ? obj?.rate : 0);
    newObj["subTotal"] = getUSDCurrency(obj?.subTotal ? obj?.subTotal : 0);
    newObj["taxRate"] = obj?.taxRate ? obj?.taxRate?.toFixed(2) : "0.00" + "%";
    newObj["total"] = getUSDCurrency(obj?.total);
    return newObj;
  });

  const table = useReactTable({
    data: invoiceTableDataForView,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    manualFiltering: false,
    enableColumnFilters: false,
  });

  const payClick = () => {
    if (!showPayNow) {
      setShowPayNow(true);
    }
  };

  const exportPdfClick = async () => {
    const content = await exportInvoicePdf({
      claimNumber: sessionStorage.getItem("claimNumber"),
      claimId: sessionStorage.getItem("claimId"),
      id: 564,
      invoiceNumber: sessionStorage.getItem("invoiceNumber"),
    });
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      "INV-" +
      invoiceViewRes?.claimNumber +
      "-" +
      invoiceViewRes?.insured?.lastName +
      "," +
      invoiceViewRes?.insured?.firstName +
      ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const voidClick = async () => {
    setIsLoader(true);
    const payload: any = {
      id: invoiceViewRes?.invoiceDetails?.id,
      isApproved: false,
    };
    const res: any = await invoiceVoid(payload);
    if (res.status == 200) {
      dispatch(
        addNotification({
          message: res?.message,
          id: "void_success",
          status: "success",
        })
      );
      init();
    } else {
      dispatch(
        addNotification({
          message: res?.message,
          id: "void_error",
          status: "error",
        })
      );
    }
    setIsLoader(false);
  };

  const supervisorReviewClick = async () => {
    setIsLoader(true);
    const payload: any = {
      invoiceId: invoiceViewRes?.invoiceDetails?.id,
    };
    const res: any = await invoiceSupReview(payload);
    if (res.status == 200) {
      dispatch(
        addNotification({
          message: res?.message,
          id: "review_success",
          status: "success",
        })
      );
      init();
    } else {
      dispatch(
        addNotification({
          message: res?.message,
          id: "review_error",
          status: "error",
        })
      );
    }
    setIsLoader(false);
  };
  return (
    <div className={styles.assignmentsCont}>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        childComp={<ContractDetails />}
        modalHeaderClass={styles.modalHead}
        headingName={"Contract Details"}
        modalWidthClassName={styles.modalWidth}
        animate={true}
      ></Modal>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <GenericComponentHeading title={"Invoice# " + invoiceNumber} />
      <div className="row">
        <div className={`col-md-12 ${styles.paddingBottom20}`}>
          <div className={styles.buttonRowContainer}>
            {showSupReviewBtn && (
              <GenericButton
                className={styles.buttonCss}
                label={"Supervisor Review"}
                onClick={supervisorReviewClick}
                size="small"
              />
            )}
            {showVoidBtn && (
              <GenericButton
                className={styles.buttonCss}
                label={"Void"}
                disabled={invoiceViewRes?.invoiceDetails?.status?.status == "REJECTED"}
                onClick={voidClick}
                size="small"
              />
            )}
            {showPayBtn && (
              <GenericButton
                className={styles.buttonCss}
                label={"Pay"}
                disabled={invoiceViewRes?.invoiceDetails?.status?.status == "PROCESSING"}
                onClick={payClick}
                size="small"
              />
            )}
            <GenericButton
              className={styles.buttonCss}
              label={"Export To PDF"}
              onClick={exportPdfClick}
              size="small"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Invoice Id
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.invoiceDetails?.invoiceNumber}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>Status</label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.invoiceDetails?.status?.status}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Invoice Date
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {convertToCurrentTimezone(invoiceViewRes?.invoiceDetails?.createDate)}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Payment Terms
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.invoiceDetails?.paymentTerm?.name}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Due Date
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {convertToCurrentTimezone(invoiceViewRes?.invoiceDetails?.dueDate)}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Currency
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.invoiceDetails?.currencyDetails}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>Claim #</label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>{invoiceViewRes?.claimNumber}</span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Policyholder&apos;s Name
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.insured?.name}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Tax Rate
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.invoiceDetails?.taxRate?.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Attachments
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={`${styles.colorRed} ${styles.labelTextRight}`}>
                {invoiceViewRes?.invoiceDetails?.invoiceAttachments
                  ? invoiceViewRes?.invoiceDetails?.invoiceAttachments.length
                  : 0}{" "}
                Attachments
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Contract Details
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                <a
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Claim Contract
                </a>
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <label className={styles.qpf}>From</label>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Vendor Company
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.vendor?.vendorName}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Invoice Created By
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.invoiceDetails?.createdBy}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Remit To Address
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.vendorRemitAddress?.completeAddress}
              </span>
            </div>
          </div>
          <label className={styles.qpb}>To</label>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Insurance Company
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.invoiceDetails?.insuranceCompany?.name}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Adjuster&apos;s Name
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.invoiceDetails?.adjuster?.lastName +
                  ", " +
                  invoiceViewRes?.invoiceDetails?.adjuster?.firstName}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Branch Office
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.branchDetails?.branchName}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Billing Address
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {invoiceViewRes?.branchDetails?.completeAddress}
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr className={styles.hr1} />
      <label className={styles.linesText}>Lines</label>
      <hr className={styles.hr2} />
      <div className={styles.tableCont}>
        {!isLoader && invoiceTableDataForView && <CustomReactTable table={table} />}
      </div>
      <div className="row">
        <div className={`col-md-9 ${styles.additComme}`}>
          <label className={styles.vendorNoteHead}>Vendor Note</label>
          <p className={styles.vendorCommDesc}>
            {invoiceViewRes?.invoiceDetails?.vendorNote}
          </p>
        </div>
        <div className={`col-md-3 ${styles.replaceCostDet}`}>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeftBold}`}>
              Grand Total
            </label>
            <div className="col-md-7 col-sm-6">
              <input
                className={styles.totalInputFields}
                disabled
                value={
                  invoiceViewRes?.invoiceDetails?.amount
                    ? getUSDCurrency(invoiceViewRes?.invoiceDetails?.amount)
                    : ""
                }
              />
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeftBold}`}>
              (-) Deductible
            </label>
            <div className="col-md-7 col-sm-6">
              <input
                className={styles.totalInputFields}
                disabled
                value={
                  invoiceViewRes?.invoiceDetails?.deductible
                    ? getUSDCurrency(invoiceViewRes?.invoiceDetails?.deductible)
                    : ""
                }
              />
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeftBold}`}>
              (-) Advance payment
            </label>
            <div className="col-md-7 col-sm-6">
              <input
                className={styles.totalInputFields}
                disabled
                value={
                  invoiceViewRes?.invoiceDetails?.advancePayment
                    ? getUSDCurrency(invoiceViewRes?.invoiceDetails?.advancePayment)
                    : ""
                }
              />
            </div>
          </div>

          <hr className={styles.hr3} />

          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeftBold}`}>
              Total Payable
            </label>
            <div className="col-md-7 col-sm-6">
              <input
                className={styles.totalInputFields}
                disabled
                value={totalPay ? getUSDCurrency(totalPay) : ""}
              ></input>
            </div>
          </div>
        </div>
        <div className={`col-md-12 ${styles.paddingTop10}`}>
          <hr className={styles.hr4} />
          <div className={styles.buttonRowContainer}>
            {showSupReviewBtn && (
              <GenericButton
                className={styles.buttonCss}
                label={"Supervisor Review"}
                onClick={supervisorReviewClick}
                size="small"
              />
            )}
            {showVoidBtn && (
              <GenericButton
                className={styles.buttonCss}
                label={"Void"}
                disabled={invoiceViewRes?.invoiceDetails?.status?.status == "REJECTED"}
                onClick={voidClick}
                size="small"
              />
            )}
            {showPayBtn && (
              <GenericButton
                className={styles.buttonCss}
                label={"Pay"}
                disabled={invoiceViewRes?.invoiceDetails?.status?.status == "PROCESSING"}
                onClick={payClick}
                size="small"
              />
            )}
            <GenericButton
              className={styles.buttonCss}
              label={"Export To PDF"}
              onClick={exportPdfClick}
              size="small"
            />
          </div>
          {showPayNow && (
            <PayNowInvoice updateData={() => init()} payNowData={invoiceViewRes} />
          )}
          {invoiceViewRes?.invoiceDetails?.status?.status == "PROCESSING" && (
            <PaymentDetails paymentDetails={invoiceViewRes?.paymentInfo} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
