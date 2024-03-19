import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from "./GlobalSearchStyle.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { parseTranslateString } from "@/utils/utitlity";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { adjusterGlobalSearchTranslatePropsType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-global-search/page";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectSearchPeople from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectSearchPeople";
import CustomReactTable from "@/components/common/CustomReactTable";
import { PAGINATION_LIMIT_10 } from "@/constants/constants";
import {
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ProfileCard from "./ProfileCard";

interface tableDataType {
  [key: string | number]: any;
}

function PeopleGlobalSearchTab({
  searchText,
  localSearch,
}: {
  searchText: string;
  localSearch: string;
}) {
  const remoteData = useAppSelector(selectSearchPeople);
  const [localData, setLocalData] = useState(remoteData);
  const pageLimit = PAGINATION_LIMIT_10;
  const { translate } =
    useContext<TranslateContextData<adjusterGlobalSearchTranslatePropsType>>(
      TranslateContext
    );
  const columnHelper = createColumnHelper<tableDataType>();
  const columns = [
    columnHelper.accessor("people", {
      enableSorting: true,
      cell: (info) => <ProfileCard data={info.row.original} />,
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

  const handlePagination = (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setLocalData(
      remoteData.filter((data) => {
        if (!localSearch) return data;
        return (
          data?.firstName?.includes(localSearch) ||
          data?.lastName?.includes(localSearch) ||
          data?.roleText?.includes(localSearch) ||
          data?.company?.name.includes(localSearch)
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

  return (
    <div className={styles.searchContainer}>
      <GenericComponentHeading
        title={parseTranslateString({
          parseString: translate?.adjusterGlobalSearchTranslate?.people?.foundFor,
          replaceMapper: { COUNT: remoteData.length ?? 0, TEXT: searchText },
        })}
        customTitleClassname={styles.textInfo}
      />
      <hr />
      <CustomReactTable
        table={table}
        data={tableData}
        pageLimit={pageLimit}
        totalDataCount={localData.length}
        tableDataErrorMsg={
          localData.length == 0 && translate?.adjusterGlobalSearchTranslate?.noDataError
        }
        hideHeader
        handleRowClick={false}
        customRowClassName={styles.profileRow}
      />
    </div>
  );
}

export default PeopleGlobalSearchTab;
