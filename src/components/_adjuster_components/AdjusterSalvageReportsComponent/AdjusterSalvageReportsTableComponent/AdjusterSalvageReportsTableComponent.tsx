"use client";
import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import AdjusterSalvageTableComponentStyle from "./AdjusterSalvageReportsTableComponent.module.scss";

import { useAppSelector } from "@/hooks/reduxCustomHook";

import CustomReactTable from "@/components/common/CustomReactTable/index";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { convertToCurrentTimezone } from "@/utils/helper";
import { getUSDCurrency } from "@/utils/utitlity";

interface typeProps {
  [key: string | number]: any;
}
const AdjusterSalvageReportsTableComponent: React.FC<typeProps> = (props) => {
  const { addSelectedClaimId, tableLoader, resetPagination, setResetPagination } = props;
  const router = useRouter();

  interface ClaimData {
    [key: string | number]: any;
  }
  const columnHelper = createColumnHelper<ClaimData>();

  const salvageReportforReportData = useAppSelector(
    (state: any) => state?.salvageReportSlice?.salvageReportforReport
  );

  const columns = [
    columnHelper.accessor("claimNumber", {
      id: "Claim_Number",
      header: () => `Claim #`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("createdDate", {
      id: "Created_Date",
      header: () => `Created Date`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("salvageId", {
      id: "Salvage_Id",
      header: () => `Salvage ID`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("salvageProfile", {
      id: "Item_Type",
      header: () => `Item Type`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("itemDescription", {
      id: "Item_Description",
      header: () => `Item Description`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.status, {
      id: "Status",
      cell: (status) => {
        return (
          <div style={{ width: "80px" }}>
            <span>{status.getValue() as React.ReactNode}</span>
          </div>
        );
      },
      header: () => <span>Status</span>,
      enableColumnFilter: false,
      size: 200,
    }),
    columnHelper.accessor("closeDate", {
      id: "Close_Date",
      header: "Close Date",
      cell: (info) => {
        if (info.renderValue()) {
          const dateVal = info.renderValue().replace("T", " ");
          const unixDate = Date.parse(dateVal);
          const formatedDate = convertToCurrentTimezone(unixDate, "MM/DD/YYYY h:mm A");
          return formatedDate;
        }
        return null;
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("grossSaleAmnt", {
      id: "Gross_Sale_Amount",
      header: () => <span>{`Gross Sale Amount`}</span>,
      cell: (info) => getUSDCurrency(+info.getValue() ?? 0),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("commission", {
      id: "Commission",
      header: () => `Commission`,
      cell: (info) => getUSDCurrency(+info.getValue() ?? 0),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("expenses", {
      id: "Expenses",
      header: () => `Expenses`,
      cell: (info) => getUSDCurrency(+info.getValue() ?? 0),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("netPaid", {
      id: "Net_Paid",
      header: () => `Net Paid`,
      cell: (info) => getUSDCurrency(+info.getValue() ?? 0),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("ownerRetained", {
      id: "Owner_Retained",
      header: () => `Owner Retained`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: salvageReportforReportData?.currentPageNumber - 1,
    pageSize: PAGINATION_LIMIT_20,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const handlePagination = async (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
  };
  const handleRowClick = async (rowData: any) => {
    sessionStorage.setItem("claimNumber", rowData?.claimNumber);
    sessionStorage.setItem("claimId", rowData?.claimId);
    sessionStorage.setItem("PolicyNumber", rowData?.policyNumber);
    await addSelectedClaimId({
      claimId: rowData?.claimId,
    });
    router.push(`/adjuster-property-claim-details/${rowData?.claimId}`);
  };

  useEffect(() => {
    if (resetPagination) {
      setPagination({ pageIndex: 0, pageSize: PAGINATION_LIMIT_20 });
      setResetPagination(false);
    }
  }, [resetPagination, setResetPagination]);

  const table = useReactTable({
    data: salvageReportforReportData ?? [],
    columns,
    pageCount: Math.ceil(salvageReportforReportData?.totalClaims / PAGINATION_LIMIT_20),
    state: {
      pagination,
    },
    onPaginationChange: handlePagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
  });

  return (
    <div className={AdjusterSalvageTableComponentStyle.claimTableContainer}>
      <CustomReactTable
        table={table}
        totalDataCount={salvageReportforReportData?.totalClaims}
        tableDataErrorMsg={!salvageReportforReportData && "No Data found"}
        showStatusColor={true}
        loader={tableLoader}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};

export default AdjusterSalvageReportsTableComponent;
