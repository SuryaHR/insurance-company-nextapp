"use client";
import React, { useMemo, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb/index";
import clsx from "clsx";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import { RootState } from "@/store/store";
import { unknownObjectType } from "@/constants/customTypes";
import pendingInvoiceStyle from "./pendingInvoiceTable.module.scss";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import {
  handlePendingInvoicePagination,
  handlePendingInvoiceSort,
} from "@/reducers/_adjuster_reducers/PendingInvoice/PendingInvoiceSlice";

interface PendingInvoiceTableProps {
  translate?: any;
}

const PendingInvoiceTable: React.FC<connectorType & PendingInvoiceTableProps> = (
  props
) => {
  const {
    claimListData,
    currentPageNumber,
    totalinvoice,
    claimErrorMsg,
    isFetching,
    handlePendingInvoicePagination,
    handlePendingInvoiceSort,
  } = props;
  const pageLimit = PAGINATION_LIMIT_20;

  type ClaimData = {
    claimNumber: string;
    invoiceNumber: string;
    vendorName: string;
    createdBy: string;
    amount: number;
    createDate: string;
    status: unknownObjectType;
  };

  const { translate } = props;

  const pathList = [
    {
      name: translate?.policyInvoicesTranslate?.policyInvoices?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: translate?.policyInvoicesTranslate?.policyInvoices?.pendingVendorInvoices,
      path: "/login",
      active: true,
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<ClaimData>();
  const columns = [
    columnHelper.accessor("claimNumber", {
      header: "Claim #",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("invoiceNumber", {
      header: "Invoice Number",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("vendorName", {
      header: "Vendor",
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("createdBy", {
      header: "Created By",
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("amount", {
      header: "Invoice Amount",
      cell: (info) => <span>{`$${info.getValue().toFixed(2)}`}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("createDate", {
      header: "Invoice Date",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: "Status Days",
      cell: (info) => info.getValue()?.name,
      enableSorting: true,
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: currentPageNumber - 1,
    pageSize: pageLimit,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const resetPage = () => {
    setPagination({
      pageIndex: 0,
      pageSize: pageLimit,
    });
  };

  const handleSorting = async (sortingUpdater: any) => {
    const newSortVal: SortingState = sortingUpdater(sorting);
    setSorting(newSortVal);
    resetPage();
    handlePendingInvoiceSort(newSortVal[0]);
  };

  const handlePagination = async (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    const pageNumber = newPaginationValue.pageIndex + 1;
    handlePendingInvoicePagination({ pageNumber });
  };

  const table = useReactTable({
    data: claimListData,
    columns,
    pageCount: Math.ceil(totalinvoice / pageLimit),
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: handlePagination,
    onSortingChange: handleSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableColumnFilters: false,
  });

  return (
    <div className="row">
      <div>
        <GenericBreadcrumb dataList={pathList} />
      </div>
      <hr className={pendingInvoiceStyle.divider} />
      <div
        className={clsx(
          "col-lg-12 col-md-12 col-12 m-2",
          pendingInvoiceStyle.tableHeading
        )}
      >
        <label>{`${translate?.policyInvoicesTranslate?.policyInvoices?.pendingVendorInvoices} (${totalinvoice})`}</label>
      </div>
      <div className={pendingInvoiceStyle.claimTableContainer}>
        <CustomReactTable
          table={table}
          totalDataCount={totalinvoice}
          pageLimit={pageLimit}
          loader={isFetching}
          tableDataErrorMsg={claimErrorMsg}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({
  pendingInvoice: {
    pendingInvoiceListData,
    currentPageNumber,
    totalinvoice,
    claimErrorMsg,
    isFetchingPendingInvoice,
  },
}: RootState) => ({
  claimListData: pendingInvoiceListData,
  currentPageNumber,
  totalinvoice,
  claimErrorMsg,
  isFetching: isFetchingPendingInvoice,
});

const mapDispatchToProps = {
  handlePendingInvoicePagination,
  handlePendingInvoiceSort,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(PendingInvoiceTable);
