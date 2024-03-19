"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import PolicyHolderTableListStyle from "./policyholderpayouts.module.scss";
import { connect } from "react-redux";
import { RootState } from "@/store/store";
import { fetchPolicySummaryTableAction } from "@/reducers/_adjuster_reducers/ContentsEvaluation/DetailedInventorySlice";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import CustomLoader from "@/components/common/CustomLoader/index";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

type PolicyHolderTableProps = {
  listData: any;
  fetchPolicySummaryTableAction: any;
  policyHolderTablefetching: boolean;
  handleRowClick: any;
};

interface policyHolderData {
  [key: string | number]: any;
}

function convertToFloatCurrency(value: any) {
  if (value) return `$${Number.parseFloat(value).toFixed(2)}`;
  else {
    return "$0.00";
  }
}

function PolicyHolderTable(props: PolicyHolderTableProps) {
  const columnHelper = createColumnHelper<policyHolderData>();
  const {
    listData,
    fetchPolicySummaryTableAction,
    policyHolderTablefetching,
    handleRowClick,
  } = props;
  const [totalAmountPaid, setTotalAmountPaid] = useState();
  const claimNumber = sessionStorage.getItem("claimNumber") || "";

  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  useEffect(() => {
    fetchPolicySummaryTableAction({
      claimNumber: claimNumber,
    });
  }, [claimNumber, fetchPolicySummaryTableAction]);

  useMemo(() => {
    if (!policyHolderTablefetching) {
      const value = listData?.paymentSummaryDetails?.reduce(function (
        prev: any,
        curr: any
      ) {
        return prev + curr.amountPaid;
      }, 0);
      setTotalAmountPaid(value);
    }
  }, [policyHolderTablefetching, listData?.paymentSummaryDetails]);

  const columns = [
    columnHelper.accessor("paymentID", {
      cell: (info: any) => info.getValue(),
      header: () =>
        translate?.contentsEvaluationTranslate?.policyholderPayouts?.columns.paymentId,
      footer: () => (
        <span>
          {translate?.contentsEvaluationTranslate?.policyholderPayouts?.columns.totalPaid}{" "}
        </span>
      ),
    }),
    columnHelper.accessor("amountPaid", {
      cell: (info: any) => <span>{convertToFloatCurrency(info.getValue())}</span>,
      header: () =>
        translate?.contentsEvaluationTranslate?.policyholderPayouts?.columns
          .paymentAmount,
      footer: () => <span>{convertToFloatCurrency(totalAmountPaid)}</span>,
    }),
    columnHelper.accessor("paymentDate", {
      cell: (info: any) => <span>{convertToFloatCurrency(info.getValue())}</span>,
      footer: () => {
        return <span></span>;
      },
      header: () =>
        translate?.contentsEvaluationTranslate?.policyholderPayouts?.columns.paymentDate,
    }),
    columnHelper.accessor("paymentMode", {
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      header: () =>
        translate?.contentsEvaluationTranslate?.policyholderPayouts?.columns.paymentMode,
    }),
    columnHelper.accessor("referenceNumber", {
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      header: () =>
        translate?.contentsEvaluationTranslate?.policyholderPayouts?.columns
          .referenceCheck,
    }),
    columnHelper.accessor("note", {
      cell: (info: any) => <span>{info.getValue()}</span>,
      footer: () => {
        return <span></span>;
      },
      header: () =>
        translate?.contentsEvaluationTranslate?.policyholderPayouts?.columns.note,
    }),
  ];

  const table = useReactTable({
    data: listData?.paymentSummaryDetails ?? [],
    columns,
    pageCount: 20,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
    enableColumnFilters: false,
  });
  // if (loading) {
  // return (
  <div className="col-12 d-flex flex-column position-relative">
    <CustomLoader loaderType="spinner2" />
  </div>;
  // );
  // }
  return (
    <div>
      <GenericComponentHeading
        title={translate?.contentsEvaluationTranslate?.policyholderPayouts?.title}
        customHeadingClassname={PolicyHolderTableListStyle.policyHolderListHeader}
      />
      <div className={PolicyHolderTableListStyle.detailListContainer}>
        <div
          className={`row col-12 ${PolicyHolderTableListStyle.detailListContentContainer}`}
        ></div>
      </div>
      {!policyHolderTablefetching && (
        <div>
          <CustomReactTable
            showFooter={true}
            tableDataErrorMsg={
              listData?.paymentSummaryDetails?.length === 0 &&
              translate?.contentsEvaluationTranslate?.detailedInventory?.noRecords
            }
            table={table}
            handleRowClick={handleRowClick}
          />
        </div>
      )}
      {policyHolderTablefetching && <CustomLoader />}
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  listData: state.detailedInventorydata?.policySummaryListDataFull,
  policyHolderTablefetching: state.detailedInventorydata?.policyHolderTablefetching,
});

const mapDispatchToProps = {
  fetchPolicySummaryTableAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(PolicyHolderTable);
