"use client";
import React, { useEffect, useState } from "react";
import styles from "./QuoteByAssignments.module.scss";
import { getQuoteByAssData } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import CustomLoader from "@/components/common/CustomLoader";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { convertToCurrentTimezone } from "@/utils/helper";
import QuoteView from "../QuoteView/QuoteView";
import { getUSDCurrency } from "@/utils/utitlity";
import GenericButton from "@/components/common/GenericButton/index";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

function QuoteByAssignments() {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [viewQuote, setViewQuote] = useState<boolean>(false);
  const [quoteByAssData, setQuoteByAssData] = useState<any>([]);
  type AssignItemsData = {
    assignmentNumber: string;
    assignmentStartDate: any;
    vendorCompany: string;
    status: string;
    assignmentEndDate: any;
    originalCost: string;
    replacementCost: string;
    quoteDate: any;
    quoteNumber: string;
  };

  useEffect(() => {
    init();
  }, []);
  let table: any = {};
  const init = async () => {
    setIsLoader(true);
    let ListRes: any = await getQuoteByAssData();
    ListRes = ListRes?.data?.map(
      ({
        assignmentNumber,
        assignmentStartDate,
        vendorCompany,
        status,
        assignmentEndDate,
        originalCost,
        replacementCost,
        quoteDate,
        quoteNumber,
      }: any) => ({
        assignmentNumber,
        assignmentStartDate: assignmentStartDate
          ? convertToCurrentTimezone(assignmentStartDate)
          : "",
        vendorCompany,
        status,
        assignmentEndDate: assignmentEndDate
          ? convertToCurrentTimezone(assignmentEndDate)
          : "",
        originalCost: getUSDCurrency(originalCost),
        replacementCost: getUSDCurrency(replacementCost),
        quoteDate: quoteDate ? convertToCurrentTimezone(quoteDate) : "",
        quoteNumber: quoteNumber,
      })
    );
    setQuoteByAssData(ListRes);
    setIsLoader(false);
  };
  const columnHelper = createColumnHelper<AssignItemsData>();
  const columns = [
    columnHelper.accessor("assignmentNumber", {
      header: () => translate?.vendorAssignmentTranslate?.quoteByAssignments?.assignment,
      enableSorting: true,
    }),
    columnHelper.accessor("assignmentStartDate", {
      header: () =>
        translate?.vendorAssignmentTranslate?.quoteByAssignments?.assignmentStartDate,
      enableSorting: true,
    }),
    columnHelper.accessor("vendorCompany", {
      header: () =>
        translate?.vendorAssignmentTranslate?.quoteByAssignments?.vendorCompany,
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: () => translate?.vendorAssignmentTranslate?.quoteByAssignments?.status,
      enableSorting: true,
    }),
    columnHelper.accessor("assignmentEndDate", {
      header: () =>
        translate?.vendorAssignmentTranslate?.quoteByAssignments?.assignmentEndDate,
      enableSorting: true,
    }),
    columnHelper.accessor("originalCost", {
      header: () =>
        translate?.vendorAssignmentTranslate?.quoteByAssignments?.originalCost,
      enableSorting: true,
    }),
    columnHelper.accessor("replacementCost", {
      header: () =>
        translate?.vendorAssignmentTranslate?.quoteByAssignments?.replacementCost,
      enableSorting: true,
    }),
    columnHelper.accessor("quoteDate", {
      header: () => translate?.vendorAssignmentTranslate?.quoteByAssignments?.quoteDate,
      enableSorting: true,
    }),
    columnHelper.accessor("quoteNumber", {
      header: () => translate?.vendorAssignmentTranslate?.quoteByAssignments?.finalQuote,
      cell: (info) => <GenericButton label={info.getValue()} theme="linkBtn" />,
      enableSorting: true,
    }),
  ];

  table = useReactTable({
    data: quoteByAssData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    manualFiltering: false,
    enableColumnFilters: false,
  });

  const handleColClick = (data: any) => {
    sessionStorage.setItem("quoteNumber", data);
    setViewQuote(true);
  };

  return (
    <React.Fragment>
      {!viewQuote && (
        <div className={styles.assignmentsCont}>
          {isLoader && <CustomLoader loaderType="spinner1" />}
          <GenericComponentHeading
            title={
              translate?.vendorAssignmentTranslate?.quoteByAssignments
                ?.quotesummaryHeading
            }
          />
          <div className={styles.tableTop}></div>
          {!isLoader && (
            <CustomReactTable
              table={table}
              handleColClick={handleColClick}
              colClickColumn="Final Quote"
              tableDataErrorMsg={
                quoteByAssData?.length === 0
                  ? translate?.vendorAssignmentTranslate?.quoteByAssignments
                      ?.noRecordFound
                  : ""
              }
            />
          )}
        </div>
      )}
      {viewQuote && (
        <div>
          <QuoteView />
        </div>
      )}
    </React.Fragment>
  );
}

export default QuoteByAssignments;
