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
import { adjusterGlobalSearchTranslatePropsType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-global-search/page";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { parseTranslateString } from "@/utils/utitlity";
import { FaBus, FaHome } from "react-icons/fa";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import selectClaims from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectClaims";
import { useRouter } from "next/navigation";
import { updateReferer } from "@/reducers/Session/SessionSlice";

interface tableDataType {
  [key: string | number]: any;
}

function CliamsGlobalSearchTab({
  searchText,
  localSearch,
}: {
  searchText: string;
  localSearch: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pageLimit = PAGINATION_LIMIT_20;
  const { translate } =
    useContext<TranslateContextData<adjusterGlobalSearchTranslatePropsType>>(
      TranslateContext
    );
  const remoteData = useAppSelector(selectClaims);
  const [localData, setLocalData] = useState(remoteData);
  const columnHelper = createColumnHelper<tableDataType>();
  const columns = [
    columnHelper.accessor("type", {
      header: () => translate?.adjusterGlobalSearchTranslate?.claims?.header?.types,
      enableSorting: true,
      cell: (info) => {
        return (
          <div className="d-flex justify-content-center align-items-center">
            {info?.getValue() === "HOME" && <FaHome size={18} />}
            {info?.getValue() === "AUTO" && <FaBus size={18} />}
          </div>
        );
      },
    }),
    columnHelper.accessor("claimNumber", {
      header: () => translate?.adjusterGlobalSearchTranslate?.claims?.header?.claims,
      enableSorting: true,
    }),
    columnHelper.accessor("createDate", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.claims?.header?.created_date,
      enableSorting: true,
    }),
    columnHelper.accessor("policyNumber", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.claims?.header?.policy_number,
      enableSorting: true,
    }),
    columnHelper.accessor("policyHolder", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.claims?.header?.policy_holder,
      enableSorting: true,
    }),
    columnHelper.accessor("adjuster", {
      header: () => translate?.adjusterGlobalSearchTranslate?.claims?.header?.adjuster,
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: () => translate?.adjusterGlobalSearchTranslate?.claims?.header?.status,
      enableSorting: true,
      cell: (info) => info.getValue().status,
    }),
    columnHelper.accessor("lastNote", {
      header: () => translate?.adjusterGlobalSearchTranslate?.claims?.header?.last_note,
      enableSorting: false,
      cell: (info) => info.getValue().message,
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
          data.claimNumber.includes(localSearch) ||
          data.policyNumber.includes(localSearch) ||
          data.policyHolder.includes(localSearch) ||
          data.adjuster.includes(localSearch) ||
          data.status.status.includes(localSearch)
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
    dispatch(updateReferer({ referer: "search" }));
    router.push(`/adjuster-property-claim-details/${rowData.id}`);
  };

  return (
    <div className={styles.searchContainer}>
      <GenericComponentHeading
        title={parseTranslateString({
          parseString: translate?.adjusterGlobalSearchTranslate?.claims?.foundFor,
          replaceMapper: { COUNT: remoteData.length ?? 0, TEXT: searchText },
        })}
        customTitleClassname={styles.searchContainer}
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
  );
}

export default CliamsGlobalSearchTab;
