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
import { useAppSelector } from "@/hooks/reduxCustomHook";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { downloadFileFromUrl, parseTranslateString } from "@/utils/utitlity";
import GenericButton from "@/components/common/GenericButton";
import selectSearchDocuments from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectSearchDocuments";
import PreviewMedia from "@/components/common/PreviewMedia";

interface tableDataType {
  [key: string | number]: any;
}

const DocumentsGlobalSearchTab = ({
  searchText,
  localSearch,
}: {
  searchText: string;
  localSearch: string;
}) => {
  const [isOpenModalMedia, setIsOpenModalMedia] = useState<boolean>(false);
  const [prevSelected, setPrevSelected] = useState<any>();
  const handleModalMedia = () => setIsOpenModalMedia((prev: any) => !prev);

  const pageLimit = PAGINATION_LIMIT_20;
  const { translate } =
    useContext<TranslateContextData<adjusterGlobalSearchTranslatePropsType>>(
      TranslateContext
    );
  const remoteData = useAppSelector(selectSearchDocuments);
  const [localData, setLocalData] = useState(remoteData);
  const columnHelper = createColumnHelper<tableDataType>();

  const columns = [
    columnHelper.accessor("fileName", {
      header: () => translate?.adjusterGlobalSearchTranslate?.documents?.header?.fileName,
      enableSorting: true,
    }),
    columnHelper.accessor("claimNumber", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.documents?.header?.claimNumber,
      enableSorting: true,
    }),
    columnHelper.accessor("uploadDate", {
      header: () =>
        translate?.adjusterGlobalSearchTranslate?.documents?.header?.uploadDate,
      enableSorting: true,
    }),
    columnHelper.accessor("Action", {
      header: translate?.adjusterGlobalSearchTranslate?.documents?.header?.action,
      id: "Action",
      cell: ({ row }) => {
        return (
          <div className="d-flex justify-content-start">
            <GenericButton
              label={translate?.adjusterGlobalSearchTranslate?.documents?.viewBtn}
              theme="linkBtn"
              size="small"
              onClickHandler={() => {
                setPrevSelected(() => ({
                  ...row?.original,
                  name: row?.original?.fileName,
                }));
                handleModalMedia();
              }}
            />
            <GenericButton
              label={translate?.adjusterGlobalSearchTranslate?.documents?.downloadBtn}
              theme="linkBtn"
              size="small"
              onClickHandler={() => {
                if (row?.original?.url) {
                  downloadFileFromUrl(row?.original?.url);
                }
              }}
            />
          </div>
        );
      },
    }),
  ];

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setLocalData(
      remoteData.filter((data) => {
        if (!localSearch) return data;
        return (
          data?.fileName?.includes(localSearch) ||
          data?.claimNumber?.includes(localSearch) ||
          data?.uploadDate?.includes(localSearch)
        );
      })
    );
  }, [localSearch, remoteData]);

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

  return (
    <React.Fragment>
      <PreviewMedia
        isOpen={isOpenModalMedia}
        onClose={handleModalMedia}
        prevSelected={prevSelected}
        showDelete={false}
        headingName={prevSelected?.url?.split("/").pop() ?? ""}
      />
      <div className={styles.searchContainer}>
        <GenericComponentHeading
          title={parseTranslateString({
            parseString: translate?.adjusterGlobalSearchTranslate?.documents?.foundFor,
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
        />
      </div>
    </React.Fragment>
  );
};

export default DocumentsGlobalSearchTab;
