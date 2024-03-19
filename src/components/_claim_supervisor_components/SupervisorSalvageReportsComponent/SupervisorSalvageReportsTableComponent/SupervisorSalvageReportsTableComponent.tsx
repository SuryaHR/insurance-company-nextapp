"use client";
import React from "react";
import { useRouter } from "next/navigation";

import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./SupervisorSalvageReportsTableComponent.module.scss";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { convertToCurrentTimezone } from "@/utils/helper";

interface typeProps {
  [key: string | number]: any;
}
const SupervisorSalvageReportsTableComponent: React.FC<typeProps> = (props) => {
  const { addSelectedClaimId, tableLoader } = props;
  const router = useRouter();

  interface ClaimData {
    [key: string | number]: any;
  }
  const columnHelper = createColumnHelper<ClaimData>();

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
    columnHelper.accessor("ItemType", {
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
    columnHelper.accessor("grossSaleAmount", {
      id: "Gross_Sale_Amount",
      header: () => <span>{`Gross Sale Amount`}</span>,
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("commission", {
      id: "Commission",
      header: () => `Commission`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("expenses", {
      id: "Expenses",
      header: () => `Expenses`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("netPaid", {
      id: "Net_Paid",
      header: () => `Net Paid`,
      cell: (info) => info.getValue(),
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

  const handleRowClick = async (rowData: any) => {
    sessionStorage.setItem("claimNumber", rowData?.claimNumber);
    sessionStorage.setItem("claimId", rowData?.claimId);
    sessionStorage.setItem("PolicyNumber", rowData?.policyNumber);
    await addSelectedClaimId({
      claimId: rowData?.claimId,
    });
    router.push(`/adjuster-property-claim-details/${rowData?.claimId}`);
  };

  const table = useReactTable({
    data: [] ?? [],
    columns,
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
    <div className={styles.claimTableContainer}>
      <CustomReactTable
        table={table}
        // totalDataCount={salvageReportforReportData?.totalClaims}
        tableDataErrorMsg={"No Data found"}
        showStatusColor={true}
        loader={tableLoader}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};

export default SupervisorSalvageReportsTableComponent;
