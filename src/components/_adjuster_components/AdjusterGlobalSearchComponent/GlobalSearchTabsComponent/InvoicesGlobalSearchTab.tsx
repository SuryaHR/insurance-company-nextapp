"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from "./GlobalSearchStyle.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { getUSDCurrency, parseTranslateString } from "@/utils/utitlity";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { adjusterGlobalSearchTranslatePropsType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-global-search/page";
import selectSearchInvoices from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectSearchInvoices";
import { useRouter } from "next/navigation";

interface tableDataType {
  [key: string | number]: any;
}

const InvoicesGlobalSearchTab = ({
  searchText,
  localSearch,
}: {
  searchText: string;
  localSearch: string;
}) => {
  const router = useRouter();
  const pageLimit = PAGINATION_LIMIT_20;
  const { translate } =
    useContext<TranslateContextData<adjusterGlobalSearchTranslatePropsType>>(
      TranslateContext
    );
  const remoteData = useAppSelector(selectSearchInvoices);
  const [localData, setLocalData] = useState(remoteData);
  const columnHelper = createColumnHelper<tableDataType>();

  const columns = [
    columnHelper.accessor("invoiceDetails.invoiceNumber", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.invoice?.header?.invoiceNumber,
      enableSorting: true,
    }),
    columnHelper.accessor("invoiceDetails.amount", {
      header: () => translate?.adjusterGlobalSearchTranslate?.invoice?.header?.amount,
      enableSorting: true,
      cell: (info) => getUSDCurrency(info.getValue()),
    }),
    columnHelper.accessor("invoiceDetails.status.status", {
      header: () => translate?.adjusterGlobalSearchTranslate?.invoice?.header?.status,
      enableSorting: true,
    }),
    columnHelper.accessor("invoiceDetails.createDate", {
      header: () => translate?.adjusterGlobalSearchTranslate?.invoice?.header?.createDate,
      enableSorting: true,
    }),
    columnHelper.accessor("vendor.vendorName", {
      header: () => translate?.adjusterGlobalSearchTranslate?.invoice?.header?.vendorName,
      enableSorting: true,
    }),
    columnHelper.accessor("claimNumber", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.invoice?.header?.claimNumber,
      enableSorting: true,
    }),
    columnHelper.accessor("invoiceDetails.adjuster", {
      header: () => translate?.adjusterGlobalSearchTranslate?.invoice?.header?.adjuster,
      enableSorting: true,
      cell: (info) => {
        return info.getValue()?.lastName + "," + info.getValue()?.firstName;
      },
    }),
    columnHelper.accessor("insured.name", {
      header: () => translate?.adjusterGlobalSearchTranslate?.invoice?.header?.holderName,
      enableSorting: true,
    }),
  ];
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageLimit,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setLocalData(
      remoteData.filter((data) => {
        if (!localSearch) return data;
        return (
          data?.invoiceDetails?.invoiceNumber?.includes(localSearch) ||
          data?.invoiceDetails?.amount?.toString()?.includes(localSearch) ||
          data?.invoiceDetails?.status?.status?.includes(localSearch) ||
          data?.vendor.vendorName?.includes(localSearch) ||
          data?.invoiceDetails?.adjuster?.firstName?.includes(localSearch) ||
          data?.invoiceDetails?.adjuster?.lastName?.includes(localSearch) ||
          data?.insured?.name?.includes(localSearch) ||
          data?.claimNumber?.includes(localSearch)
        );
      })
    );
  }, [localSearch, remoteData]);

  const tableData = useMemo(() => {
    return localData.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );
  }, [pagination, localData]);

  const handlePagination = (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
  };

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    pageCount: Math.ceil(localData.length / pageLimit),
    state: {
      pagination,
    },
    onPaginationChange: handlePagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    manualPagination: true,
    enableColumnFilters: false,
  });

  const handleRowClick = (rowData: any) => {
    router.push(`/view-invoice/${rowData?.invoiceDetails?.invoiceNumber}`);
  };

  return (
    <React.Fragment>
      <div className={styles.searchContainer}>
        <GenericComponentHeading
          title={parseTranslateString({
            parseString: translate?.adjusterGlobalSearchTranslate?.invoice?.foundFor,
            replaceMapper: { COUNT: remoteData.length ?? 0, TEXT: searchText },
          })}
          customTitleClassname={styles.textInfo}
        />
        <div className={styles.tableTop}></div>
        <CustomReactTable
          table={table}
          data={tableData}
          pageLimit={pageLimit}
          totalDataCount={localData.length}
          tableDataErrorMsg={
            localData.length == 0 && translate?.adjusterGlobalSearchTranslate?.noDataError
          }
          handleRowClick={handleRowClick}
        />
      </div>
    </React.Fragment>
  );
};

export default InvoicesGlobalSearchTab;
