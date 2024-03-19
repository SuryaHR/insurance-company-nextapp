import CustomLoader from "@/components/common/CustomLoader";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./claimList.module.scss";
import {
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import CustomReactTable from "@/components/common/CustomReactTable";
import { FaBus, FaHome } from "react-icons/fa";
import { getClaimsforReport } from "@/services/_adjuster_services/ReportServices/ClaimReportService";
interface tableDataType {
  [key: string | number]: any;
}

function ClaimList() {
  const searchParam = useSearchParams();
  const userId = searchParam.get("userId");
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState([]);
  const pageLimit = PAGINATION_LIMIT_20;
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
    if (userId)
      getClaimsforReport({ userId })
        .then((res) => {
          setData(res?.data?.claims ?? []);
        })
        .catch((error) => console.log("claim_error", error))
        .finally(() => {
          setFetching(false);
        });
  }, [userId]);

  const columnHelper = createColumnHelper<tableDataType>();
  const columns = [
    columnHelper.accessor("claimType", {
      header: "Type",
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
      header: "Claim#",
      enableSorting: true,
    }),
    columnHelper.accessor("createDate", {
      header: "Created Date",
      enableSorting: true,
    }),
    columnHelper.accessor("policyNumber", {
      header: "Policy#",
      enableSorting: true,
    }),
    columnHelper.accessor("insuredDetails", {
      header: "Policy Holder",
      enableSorting: true,
      cell: (info) => `${info.getValue()?.lastName} ${info.getValue()?.firstName}`,
    }),
    columnHelper.accessor("adjuster", {
      header: "Adjuster",
      enableSorting: true,
      cell: (info) => `${info.getValue()?.lastName} ${info.getValue()?.firstName}`,
    }),
    columnHelper.accessor("status.status", {
      header: "Status",
      enableSorting: true,
    }),
    columnHelper.accessor("lastActivity", {
      header: "Last Note",
      enableSorting: true,
    }),
  ];

  const tableData = useMemo(() => {
    return data.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );
  }, [pagination, data]);

  const handlePagination = (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
  };

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    pageCount: Math.ceil(data.length / pageLimit),
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

  if (fetching) {
    return (
      <div className={styles.root}>
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <CustomReactTable
        table={table}
        data={tableData}
        pageLimit={pageLimit}
        totalDataCount={data.length}
        tableDataErrorMsg={data.length == 0 && "No Data Found"}
      />
    </div>
  );
}

export default ClaimList;
