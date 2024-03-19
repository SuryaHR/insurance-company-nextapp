"use client";
import React, { Fragment } from "react";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import style from "./styleCloseClaim.module.scss";

function InvoiceList(props: any) {
  type AssignItemsData = {
    invoiceNumber: string;
    vendorName: string;
    status: string;
  };

  let table: any = {};
  const columnHelper = createColumnHelper<AssignItemsData>();
  const columns = [
    columnHelper.accessor("invoiceNumber", {
      header: () => "Invoice #",
    }),
    columnHelper.accessor("vendorName", {
      header: () => "Vendor",
    }),
    columnHelper.accessor("status", {
      header: () => "Status",
      cell: (status: any) => status?.status,
    }),
  ];

  table = useReactTable({
    data: props.pedningInvoiceTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    manualFiltering: false,
    enableColumnFilters: false,
  });

  return (
    <Fragment>
      <div className={`${style.tblContan} mx-1`}>
        <div className={`${style.tblHeader} mt-1`}>
          These invoices need to be paid before closing the claim:
        </div>
        <CustomReactTable
          table={table}
          tableDataErrorMsg={!props.pedningInvoiceTableData && "No Record Found"}
          loader={false}
        />
      </div>
    </Fragment>
  );
}

export default InvoiceList;
