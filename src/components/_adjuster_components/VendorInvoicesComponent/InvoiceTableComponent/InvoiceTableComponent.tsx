"use client";
import React, { useEffect } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

import { useRouter } from "next/navigation";

import {
  createColumnHelper,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import InvoiceTableComponentStyle from "./InvoiceTableComponent.module.scss";

import dayjs from "dayjs";
import { get } from "lodash";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import {
  addSelectedVendorInvoiceId,
  fetchVendorInvoice,
} from "@/reducers/_adjuster_reducers/VendorInvoicePayments/VendorInvoiceSlice";

import CustomLoader from "@/components/common/CustomLoader/index";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { getUSDCurrency } from "@/utils/utitlity";

import { findTotal, getDate } from "./TableCalculate";

interface typeProps {
  [key: string | number]: any;
}

interface ClaimData {
  [key: string | number]: any;
}

const InvoiceTableComponent: React.FC<typeProps> = (props) => {
  const {
    resetPagination,
    setResetPagination,
    tableLoader,
    fromSelectedDate,
    toSelectedDate,
    apiParams,
    view,
  } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);
  const [finalData, setFinalData] = React.useState<any>({});
  const [totalData, setTotalData] = React.useState<any>(0);

  const router = useRouter();

  const vendorInvoiceList = useAppSelector(
    ({ vendorInvoiceSlice }: any) => vendorInvoiceSlice?.vendorInvoice
  );
  const vendorInvoicefetching = useAppSelector(
    ({ vendorInvoiceSlice }: any) => vendorInvoiceSlice?.vendorInvoicefetching
  );
  const dispatch = useAppDispatch();
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: vendorInvoiceList?.currentPageNumber - 1,
    pageSize: PAGINATION_LIMIT_20,
  });
  const columnHelper = createColumnHelper<ClaimData>();

  const changeNameHandler = (evt: any, row: any) => {
    evt.stopPropagation();
    row.toggleExpanded();
  };
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const columns = [
    columnHelper.accessor("", {
      id: "Total",
      header: () => `Total`,
      cell: ({ row }) => findTotal(row),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("invoiceNumber", {
      id: "Invoice",
      header: () => <span>{`Invoice #`}</span>,
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("createdBy", {
      id: "Created_By",
      header: () => `Created By`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("amount", {
      id: "Invoice_Amount",
      header: () => `Invoice Amount`,
      cell: (info) => getUSDCurrency(info.getValue() ?? 0),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("createDate", {
      id: "Invoice_Date",
      header: "Invoice Date",
      cell: (info) => getDate(info.renderValue()),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("dueDate", {
      id: "Due_Date",
      header: "Due Date",
      cell: (info) => getDate(info.renderValue()),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("status", {
      id: "Status",
      cell: (info) => info.getValue(),
      header: () => <span>Status</span>,
      enableColumnFilter: false,
      size: 200,
    }),

    columnHelper.accessor("invoiceAttachments", {
      id: "Attachment",
      header: () => `Attachments`,
      cell: (info) => info?.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("", {
      id: "Action",
      header: "Action",
      cell: () => "",
      enableSorting: false,
    }),
  ];

  const addClaimColumn = columnHelper.accessor((row) => [row.claimNumber], {
    id: "Claim_Number",
    header: () => `Claim #`,
    cell: ({ row, renderValue }) => {
      return (
        <>
          <span className={InvoiceTableComponentStyle.expandingMargin}>
            {renderValue()}
          </span>
          {row.getCanExpand() ? (
            row.getIsExpanded() ? (
              <span onClick={(e) => changeNameHandler(e, row)}>
                <AiFillCaretUp />
              </span>
            ) : (
              <span onClick={(e) => changeNameHandler(e, row)}>
                <AiFillCaretDown />
              </span>
            )
          ) : (
            ""
          )}
        </>
      );
    },
    enableSorting: true,
    enableColumnFilter: false,
  });
  const addVendorColumn = columnHelper.accessor("vendorName", {
    id: "Vendor_Name",
    header: () => `Vendor Name`,
    cell: ({ row, renderValue }) => {
      return (
        <>
          <span className={InvoiceTableComponentStyle.expandingMargin}>
            {renderValue()}
          </span>
          {row.getCanExpand() ? (
            row.getIsExpanded() ? (
              <span onClick={(e) => changeNameHandler(e, row)}>
                <AiFillCaretUp />
              </span>
            ) : (
              <span onClick={(e) => changeNameHandler(e, row)}>
                <AiFillCaretDown />
              </span>
            )
          ) : (
            ""
          )}
        </>
      );
    },
    enableSorting: true,
    enableColumnFilter: false,
  });

  const addVendorNameColumn = columnHelper.accessor("vendorName", {
    id: "Vendor",
    header: () => `Vendor`,
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: false,
  });

  if (view.isClaimWise) {
    columns.unshift(addClaimColumn);
    columns.splice(3, 0, addVendorNameColumn);
  }
  if (view.isVendorWise) {
    columns.unshift(addVendorColumn);
  }

  const handleSorting = async (sortingUpdater: any) => {
    const newSortVal = sortingUpdater(sorting);
    setSorting(newSortVal);

    if (newSortVal.length > 0) {
      const orderBy = newSortVal[0].desc ? "desc" : "asc";
      const sortBy = newSortVal[0].id;
      const payload = {
        claimNumber: apiParams.claimNumber,
        invoicesStatus: apiParams.invoicesStatus,
        vendor: apiParams.vendor,
        reportStartDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        reportEndDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        limit: PAGINATION_LIMIT_20,
        page: pagination.pageIndex,
        sortBy: sortBy,
        orderBy: orderBy,
      };
      dispatch(fetchVendorInvoice(payload));
    } else if (newSortVal.length === 0 && totalData?.length > 0) {
      const payload = {
        claimNumber: apiParams.claimNumber,
        invoicesStatus: apiParams.invoicesStatus,
        vendor: apiParams.vendor,
        reportStartDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        reportEndDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        limit: PAGINATION_LIMIT_20,
        page: pagination.pageIndex,
        orderBy: "asc",
        sortBy: "createDate",
      };
      dispatch(fetchVendorInvoice(payload));
    }
  };

  const handlePagination = async (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    const pageNumber = newPaginationValue.pageIndex + 1;

    if (sorting.length > 0) {
      const orderBy = sorting[0].desc ? "desc" : "asc";
      const sortBy = sorting[0].id;
      const payload = {
        claimNumber: apiParams.claimNumber,
        invoicesStatus: apiParams.invoicesStatus,
        vendor: apiParams.vendor,
        reportStartDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        reportEndDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        limit: PAGINATION_LIMIT_20,
        page: pageNumber,
        orderBy: orderBy,
        sortBy: sortBy,
      };
      dispatch(fetchVendorInvoice(payload));
    } else if (sorting.length === 0 && totalData?.length > 0) {
      const payload = {
        claimNumber: apiParams.claimNumber,
        invoicesStatus: apiParams.invoicesStatus,
        vendor: apiParams.vendor,
        reportStartDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        reportEndDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        limit: PAGINATION_LIMIT_20,
        page: pageNumber,
      };
      dispatch(fetchVendorInvoice(payload));
    }
  };

  const handleRowClick = async (rowData: any) => {
    localStorage.setItem("invoiceNumber", rowData?.invoiceNumber),
      dispatch(
        addSelectedVendorInvoiceId({
          invoiceNumber: rowData?.invoiceNumber,
        })
      );
    router.push(`/vendor-invoice-details`);
  };

  useEffect(() => {
    setPagination({
      pageIndex: vendorInvoiceList?.currentPageNumber - 1,
      pageSize: PAGINATION_LIMIT_20,
    });

    let columnsToGenerate = {};
    let data: any = null;
    let totalData: any = 0;
    if (view.isClaimWise) {
      data = vendorInvoiceList?.claims;
      totalData = vendorInvoiceList?.totalRecords;
      columnsToGenerate = {
        invoiceNumber: "invoiceNumber",
        vendorName: "vendorName",
        createdBy: "createdBy",
        amount: "amount",
        createDate: "createDate",
        dueDate: "dueDate",
        status: "status.status",
        invoiceAttachments: "invoiceAttachments",
      };
    }
    if (view.isVendorWise) {
      data = vendorInvoiceList?.vendors;
      totalData = vendorInvoiceList?.totalRecords;
      columnsToGenerate = {
        invoiceNumber: "invoiceNumber",
        createdBy: "createdBy",
        amount: "amount",
        createDate: "createDate",
        dueDate: "dueDate",
        status: "status.status",
        invoiceAttachments: "invoiceAttachments",
      };
    }

    const newArray = data?.map((obj: any) => {
      const newAssignArr = [];
      if (obj?.invoices) {
        for (let i = 0; i < obj?.invoices.length; i++) {
          const newObj: any = {};
          if (columnsToGenerate) {
            for (const [key, value] of Object.entries(columnsToGenerate)) {
              newObj[key] = get(obj?.invoices[i], value as string);
            }
          }
          newAssignArr.push(newObj);
        }
      }
      const [firstObj, ...remaining] = newAssignArr;
      const newObj = Object.assign({}, obj, firstObj);
      newObj["invoices"] = remaining;
      return newObj;
    });
    setFinalData(newArray);
    setTotalData(totalData);
  }, [
    vendorInvoiceList,
    setPagination,
    setFinalData,
    setTotalData,
    view.isClaimWise,
    view.isVendorWise,
  ]);

  useEffect(() => {
    if (resetPagination) {
      setPagination({ pageIndex: 0, pageSize: PAGINATION_LIMIT_20 });
      setResetPagination(false);
    }
  }, [resetPagination, setResetPagination]);

  const table = useReactTable({
    data: finalData ?? [],
    columns,
    pageCount: Math.ceil(totalData / PAGINATION_LIMIT_20),
    state: {
      sorting,
      pagination,
      expanded,
    },
    getSubRows: (row: any) => row.invoices,
    enableExpanding: true,
    onPaginationChange: handlePagination,
    onExpandedChange: setExpanded,
    onSortingChange: handleSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
  });

  return (
    <div className={InvoiceTableComponentStyle.claimTableContainer}>
      {vendorInvoicefetching && <CustomLoader />}
      <CustomReactTable
        table={table}
        totalDataCount={totalData}
        showStatusColor={true}
        loader={tableLoader}
        tableDataErrorMsg={!finalData && "No Data found."}
        handleRowClick={handleRowClick}
        pageLimit={PAGINATION_LIMIT_20}
      />
    </div>
  );
};
export default InvoiceTableComponent;
