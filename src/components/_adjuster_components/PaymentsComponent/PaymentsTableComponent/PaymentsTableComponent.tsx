"use client";
import React from "react";
import PaymentsTableComponentStyle from "./PaymentsTableComponent.module.scss";
import { convertToCurrentTimezone } from "@/utils/helper";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { useRouter } from "next/navigation";

interface typeProps {
  [key: string | number]: any;
}
const PaymentsTableComponent: React.FC<typeProps> = (props) => {
  const {
    currentPageNumber,
    setTableLoader,
    addSelectedClaimId,
    totalClaims,
    tableLoader,
    claimErrorMsg,
  } = props;
  const router = useRouter();

  const pageLimit = 20;

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
    columnHelper.accessor("total", {
      id: "Total",
      header: () => `Total`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("payment", {
      id: "Payment",
      header: () => <span>{`Payment #`}</span>,
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("vendorNote", {
      id: "Vendor_Note",
      header: () => `Vendor Note`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("invoiceAmount", {
      id: "Invoice_Amount",
      header: () => `Invoice Amount`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("ProcessedDate", {
      id: "Processed_Date",
      header: "Processed Date",
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
    columnHelper.accessor("ExpectedDate", {
      id: "Expected_Date",
      header: "Expected Date",
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

    columnHelper.accessor("attachment", {
      id: "Attachment",
      header: () => `Attachments`,
      cell: (info) => info.renderValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: currentPageNumber - 1,
    pageSize: pageLimit,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const handlePagination = async (updaterFunction: any) => {
    setTableLoader(true);

    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    // const pageNumber = newPaginationValue.pageIndex + 1;
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

  const table = useReactTable({
    data: [],
    columns,
    pageCount: Math.ceil(totalClaims / pageLimit),
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
    <div className={PaymentsTableComponentStyle.claimTableContainer}>
      <CustomReactTable
        table={table}
        totalDataCount={totalClaims}
        showStatusColor={true}
        loader={tableLoader}
        tableDataErrorMsg={claimErrorMsg}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};
export default PaymentsTableComponent;
