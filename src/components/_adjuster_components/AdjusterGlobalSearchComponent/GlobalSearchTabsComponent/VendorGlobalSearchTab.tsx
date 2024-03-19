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
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { adjusterGlobalSearchTranslatePropsType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-global-search/page";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import selectSearchVendors from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectSearchVendors";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import { parseTranslateString } from "@/utils/utitlity";
import { useRouter } from "next/navigation";

interface tableDataType {
  [key: string | number]: any;
}

const VendorGlobalSearchTab = ({
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
  const remoteData = useAppSelector(selectSearchVendors);
  const [localData, setLocalData] = useState(remoteData);

  const columnHelper = createColumnHelper<tableDataType>();
  const columns = [
    columnHelper.accessor("vendorNumber", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.suppliers?.header?.vendorNumber,
      enableSorting: true,
    }),
    columnHelper.accessor("vendorName", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.suppliers?.header?.vendorName,
      enableSorting: true,
    }),
    columnHelper.accessor("billingAddress.completeAddress", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.suppliers?.header?.billingAddress,
      enableSorting: true,
    }),
    columnHelper.accessor("contact", {
      header: () => translate?.adjusterGlobalSearchTranslate?.suppliers?.header?.contact,
      enableSorting: true,
      cell: (info) => {
        <div>
          {info?.getValue()?.firstName} {info?.getValue()?.lastName}
        </div>;
      },
    }),
    columnHelper.accessor("cellPhone", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.suppliers?.header?.cellPhone,
      enableSorting: true,
    }),
    columnHelper.accessor("isActive", {
      header: () => translate?.adjusterGlobalSearchTranslate?.suppliers?.header?.status,
      enableSorting: true,
      cell: (info) => (info.getValue() ? "Active" : "Inactive"),
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
          data?.vendorNumber?.includes(localSearch) ||
          data?.vendorName?.includes(localSearch) ||
          data?.contact?.firstName.includes(localSearch) ||
          data?.contact?.lastName.includes(localSearch) ||
          data?.cellPhone?.toString().includes(localSearch) ||
          data?.billingAddress?.completeAddress?.includes(localSearch)
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
    router.push(`/vendor-info/${rowData.vendorId}`);
  };

  return (
    <React.Fragment>
      <div className={styles.searchContainer}>
        <GenericComponentHeading
          title={parseTranslateString({
            parseString: translate?.adjusterGlobalSearchTranslate?.suppliers?.foundFor,
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

export default VendorGlobalSearchTab;
