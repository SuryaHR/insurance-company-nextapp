"use client";
import React, { useEffect, useState } from "react";
import styles from "./QuoteView.module.scss";
import {
  quoteViewData,
  exportQuotePdf,
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
import Modal from "@/components/common/ModalPopups";
import ApporveQuotePopup from "../ApporveQuotePopup/ApporveQuotePopup";
import { getUSDCurrency } from "@/utils/utitlity";

interface propsTypes {
  quoteId?: string;
}

const QuoteView: React.FC<propsTypes> = ({ quoteId }) => {
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [quoteViewRes, setQuoteViewRes] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  let totalOriginalPrice: any = 0;
  let totalReplacementCost: any = 0;
  const quoteNumber = quoteId ? quoteId : sessionStorage.getItem("quoteNumber");

  type QuoteData = {
    itemNumber: any;
    description: any;
    quotedPrice: string;
    adjusterDescription: string;
    rcvTotal: any;
  };
  const addLoader = () => {
    setIsLoader(true);
  };

  const removeLoader = () => {
    setIsLoader(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const init = React.useCallback(async () => {
    setIsLoader(true);
    const response: any = await quoteViewData(quoteId);
    setQuoteViewRes(response?.data);
    setIsLoader(false);
  }, [quoteId]);

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
    setIsModalOpen(false);
    init();
  };

  useEffect(() => {
    init();
  }, [init]);

  const columnHelper = createColumnHelper<QuoteData>();
  const columns = [
    columnHelper.accessor("itemNumber", {
      header: () => "Item #",
      enableSorting: true,
    }),
    columnHelper.accessor("description", {
      header: () => "Insurance Description",
      enableSorting: true,
    }),
    columnHelper.accessor("quotedPrice", {
      header: () => "Original Cost",
      enableSorting: true,
    }),
    columnHelper.accessor("adjusterDescription", {
      header: () => "Replacement Item",
      enableSorting: true,
    }),
    columnHelper.accessor("rcvTotal", {
      header: () => "Replacement Cost",
      enableSorting: true,
    }),
  ];
  const quoteTableDataForView = quoteViewRes?.itemComparables?.map((obj: any) => {
    const newObj: any = {};
    totalOriginalPrice += obj?.claimItem?.quotedPrice;
    totalReplacementCost += obj?.claimItem?.rcvTotal;
    newObj["itemNumber"] = obj?.claimItem?.itemNumber ? obj?.claimItem?.itemNumber : "";
    newObj["description"] = obj?.claimItem?.description;
    newObj["quotedPrice"] = getUSDCurrency(obj?.claimItem?.quotedPrice);
    newObj["adjusterDescription"] = obj?.claimItem?.adjusterDescription;
    newObj["rcvTotal"] = getUSDCurrency(obj?.claimItem?.rcvTotal);
    return newObj;
  });

  const table = useReactTable({
    data: quoteTableDataForView,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    manualFiltering: false,
    enableColumnFilters: false,
  });

  const exportPdfClick = async () => {
    const content = await exportQuotePdf({
      profile: "Contents",
      vendorQuoteId: quoteViewRes.id,
    });
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      "QUOT-" +
      quoteViewRes?.claimNumber +
      "-" +
      quoteViewRes?.insuredBaseDetails?.lastName +
      "," +
      quoteViewRes?.insuredBaseDetails?.firstName +
      ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.assignmentsCont}>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <GenericComponentHeading title={"Replacement Quote #" + quoteNumber} />
      <div className="row">
        <div className={`col-md-12 ${styles.paddingBottom20}`}>
          <div className={styles.buttonRowContainer}>
            <GenericButton
              className={styles.buttonCss}
              label={"Approve"}
              disabled={quoteViewRes?.quoteStatus?.status == "APPROVED"}
              onClick={openModal}
              size="small"
            />
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
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>Status</label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.quoteStatus?.status}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Date of Quote
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>{quoteViewRes?.createDate}</span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Insurance Company
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.companyDetails?.name}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Adjuster
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.adjsuterBaseDetails?.lastName +
                  ", " +
                  quoteViewRes?.adjsuterBaseDetails?.firstName}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>Address</label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.companyDetails?.address?.completeAddress}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>Claim #</label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>{quoteViewRes?.claimNumber}</span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Assignment #
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.assignmentNumber}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}># Items</label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.itemComparables
                  ? quoteViewRes?.itemComparables?.length
                  : "0"}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <label className={styles.qpf}>Quote Prepared For</label>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Policyholder
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.insuredBaseDetails?.lastName +
                  ", " +
                  quoteViewRes?.insuredBaseDetails?.firstName}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>Address</label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.insuredBaseDetails?.address?.completeAddress}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Policyholder Email :
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.insuredBaseDetails?.email}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Policyholder Phone :
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.insuredBaseDetails?.cellPhone}
              </span>
            </div>
          </div>
          <label className={styles.qpb}>Quote Prepared By</label>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Claim Associate
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.createdBy?.lastName +
                  ", " +
                  quoteViewRes?.createdBy?.firstName}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              On behalf of
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.vendor?.vendorName}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Associate Email
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.createdBy?.email}
              </span>
            </div>
          </div>
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Associate Phone
            </label>
            <div className="col-md-7 col-sm-6">
              <span className={styles.labelTextRight}>
                {quoteViewRes?.createdBy?.cellPhone}
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr className={styles.hr1} />
      <div className={styles.tableCont}>
        {!isLoader && quoteTableDataForView && (
          <CustomReactTable table={table} thBgColor="#3074aff2" />
        )}
      </div>
      <div className={`row ${styles.paddingT5B15}`}>
        <div className="col-md-8">
          <label className={styles.tableBtmCalHead}>
            Total Original Cost : {getUSDCurrency(totalOriginalPrice)}
          </label>
        </div>
        <div className="col-md-4">
          <label className={styles.tableBtmCalHead}>
            Total Replacement Cost : {getUSDCurrency(totalReplacementCost)}
          </label>
        </div>
      </div>

      <div className="row">
        <div className={`col-md-6 ${styles.additComme}`}>
          <GenericComponentHeading title={"Additional Comments"} />
          <p className={styles.vendorCommDesc}>{quoteViewRes?.vendorComment}</p>
        </div>
        <div className={`col-md-6 row ${styles.replaceCostDet}`}>
          <GenericComponentHeading title={"Replacement Cost Detailed"} />
          <div className="col-md-8">
            <label className={`${styles.labelTextLeft} ${styles.textAlignEnd}`}>
              Subtotal
            </label>
          </div>
          <div className="col-md-4">
            <label className={`${styles.labelTextRight} ${styles.textAlignEnd}`}>
              {getUSDCurrency(quoteViewRes?.subTotal)}
            </label>
          </div>
          <div className="col-md-8">
            <label className={`${styles.labelTextLeft} ${styles.textAlignEnd}`}>
              Taxes (@{quoteViewRes?.taxRate}%)
            </label>
          </div>
          <div className="col-md-4">
            <label className={`${styles.labelTextRight} ${styles.textAlignEnd}`}>
              {quoteViewRes?.tax?.toFixed(2)}
            </label>
          </div>
        </div>
        <div className={`col-md-12 ${styles.paddingTop10}`}>
          <div className={styles.buttonRowContainer}>
            <GenericButton
              className={styles.buttonCss}
              label={"Approve"}
              onClick={openModal}
              disabled={quoteViewRes?.quoteStatus?.status == "APPROVED"}
              size="small"
            />
            <GenericButton
              className={styles.buttonCss}
              label={"Export To PDF"}
              onClick={exportPdfClick}
              size="small"
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        childComp={
          <ApporveQuotePopup
            translate={{}}
            handleOpenModal={handleOpenModal}
            addLoader={addLoader}
            removeLoader={removeLoader}
            quoteViewData={quoteViewRes}
          />
        }
        headingName={"Approve Replacement Quote"}
        modalWidthClassName={styles.modalWidth}
      ></Modal>
    </div>
  );
};

export default QuoteView;
