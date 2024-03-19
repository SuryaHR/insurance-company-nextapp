"use client";
import React from "react";

import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import CustomReactTable from "@/components/common/CustomReactTable/index";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { getUSDCurrency } from "@/utils/utitlity";

type Props = {
  data: any;
};

interface LinesData {
  [key: string | number]: any;
}
const LinesTable = (props: Props) => {
  const { data } = props;

  const columnHelper = createColumnHelper<LinesData>();

  const columns = [
    columnHelper.accessor("lineItemServiceType.billingCode", {
      header: () => `Billing Code`,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("description", {
      header: () => "Description",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("units", {
      header: () => "Quantity",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("rate", {
      header: () => "Rate",
      cell: (info: any) => getUSDCurrency(info.getValue()),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("subTotal", {
      header: () => "Sub-Total",
      cell: (info: any) => getUSDCurrency(info.getValue()),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("salesTax", {
      header: () => "Tax Rate",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("amount", {
      header: () => "Total",
      cell: (info: any) => getUSDCurrency(info.getValue()),
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];
  const table = useReactTable({
    data: data,
    columns,
    pageCount: Math.ceil(data?.length / PAGINATION_LIMIT_20),
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
    <div>
      {data && (
        <CustomReactTable
          table={table}
          totalDataCount={data.length}
          tableDataErrorMsg={data?.length == 0 && "No Record Found"}
          showStatusColor={true}
          pageLimit={PAGINATION_LIMIT_20}
        />
      )}
    </div>
  );
};

export default LinesTable;
