"use client";
import React, { useEffect, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import CoverageSummaryListStyle from "../CoverageSummaryList.module.scss";
import { connect } from "react-redux";
import { RootState } from "@/store/store";
import { fetchCoverageSummaryAction } from "@/reducers/ContentsEvaluation/DetailedInventorySlice";
import useTranslation from "@/hooks/useTranslation";
import { contentsEvaluationTranslateType } from "@/translations/contentsEvaluationTranslate/en";
import CustomLoader from "@/components/common/CustomLoader/index";

type CoverageSummaryProps = {
  listData: any;
  fetchCoverageSummaryAction: any;
  isfetching: boolean;
};

interface coverageSummaryData {
  [key: string | number]: any;
}

function CoverageSummaryTable(props: CoverageSummaryProps) {
  const columnHelper = createColumnHelper<coverageSummaryData>();
  const { listData, fetchCoverageSummaryAction, isfetching } = props;
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const [newData, setData] = useState<typeof listData>();
  const pageLimit = 20;
  const fetchSize = 20;
  const {
    loading,
    translate,
  }: { loading: boolean; translate: contentsEvaluationTranslateType | undefined } =
    useTranslation("contentsEvaluationTranslate");
  useEffect(() => {
    fetchCoverageSummaryAction({
      claimNumber: claimNumber,
    });
  }, [claimNumber, fetchCoverageSummaryAction]);

  const columns = [
    columnHelper.accessor("categoryName", {
      cell: (info: any) => info.getValue(),
      header: () => translate?.coverageSummary.columns.category,
    }),
    columnHelper.accessor("categoryAggregateLimit", {
      cell: (info: any) => (
        <span>{`$${Number.parseFloat(info.getValue()).toFixed(2)}`}</span>
      ),
      header: () => translate?.coverageSummary.columns.aggregateLimit,
    }),
    columnHelper.accessor("categoryIndividualItemLimit", {
      cell: (info: any) => (
        <span>{`$${Number.parseFloat(info.getValue()).toFixed(2)}`}</span>
      ),
      header: () => translate?.coverageSummary.columns.itemLimit,
    }),
    columnHelper.accessor("totalItems", {
      cell: (info: any) => info.getValue(),
      header: () => translate?.coverageSummary.columns.itemsClaimed,
    }),
    columnHelper.accessor("noOfItemsAboveLimit", {
      cell: (info: any) => info.getValue(),
      header: () => translate?.coverageSummary.columns.itemsOverLimit,
    }),
    columnHelper.accessor("actualsRCV", {
      cell: (info: any) => (
        <span>{`$${Number.parseFloat(info.getValue()).toFixed(2)}`}</span>
      ),
      header: () => translate?.coverageSummary.columns.totalReplacementCost,
    }),
    columnHelper.accessor("actualsACV", {
      cell: (info: any) => (
        <span>{`$${Number.parseFloat(info.getValue()).toFixed(2)}`}</span>
      ),
      header: () => translate?.coverageSummary.columns.totalACV,
    }),
    columnHelper.accessor("totalOverage", {
      cell: (info: any) => (
        <span>{`$${Number.parseFloat(info.getValue()).toFixed(2)}`}</span>
      ),
      header: () => translate?.coverageSummary.columns.totalOverage,
    }),
    columnHelper.accessor("totalCashExposure", {
      cell: (info: any) => (
        <span>{`$${Number.parseFloat(info.getValue()).toFixed(2)}`}</span>
      ),
      header: () => translate?.coverageSummary.columns.totalCashExposure,
    }),
    columnHelper.accessor("totalAmountPaid", {
      cell: (info: any) => (
        <span>{`$${Number.parseFloat(info.getValue()).toFixed(2)}`}</span>
      ),
      header: () => translate?.coverageSummary.columns.totalHoldoverPaid,
    }),
    columnHelper.accessor("totalSettlementValue", {
      cell: (info: any) => (
        <span>{`$${Number.parseFloat(info.getValue()).toFixed(2)}`}</span>
      ),
      header: () => translate?.coverageSummary.columns.totalSettlementValue,
    }),
  ];

  useEffect(() => {
    if (listData) {
      const defaultData: (typeof listData)[] = [...listData];
      const recvData = [...defaultData.slice(0, fetchSize)];
      setData(recvData);
    }
  }, [listData]);

  const table = useReactTable({
    data: newData || [],
    columns,
    pageCount: Math.ceil(listData?.length / pageLimit),
    state: {},
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: false,
    enableColumnFilters: false,
  });

  const fetchNextPage = () => {
    if (newData) {
      const nextPageData = listData.slice(newData?.length, newData?.length + fetchSize);
      const recvData = [...newData, ...nextPageData];
      setData(recvData);
    }
    return true;
  };

  if (loading) {
    return (
      <div className="col-12 d-flex flex-column position-relative">
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }
  return (
    <div>
      <div className={CoverageSummaryListStyle.detailListContainer}>
        <div
          className={`row col-12 ${CoverageSummaryListStyle.detailListContentContainer}`}
        ></div>
      </div>
      <div>
        {isfetching ? (
          <CustomLoader />
        ) : (
          <CustomReactTable
            table={table}
            totalDataCount={listData?.length}
            tableDataErrorMsg={!listData && translate?.coverageSummary?.noRecords}
            fetchNextPage={fetchNextPage}
            totalFetched={newData?.length}
            totalDBRowCount={listData?.length}
          />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  listData: state.detailedInventorydata?.claimCategoryDetails,
  isfetching: state.detailedInventorydata?.coverageSummaryfetching,
});

const mapDispatchToProps = {
  fetchCoverageSummaryAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(CoverageSummaryTable);
