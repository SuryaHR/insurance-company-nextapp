"use client";
import React, { Fragment } from "react";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import style from "./styleCloseClaim.module.scss";

function ItemsList(props: any) {
  type AssignItemsData = {
    itemNumber: string;
    description: string;
    status: any;
  };

  let table: any = {};
  const columnHelper = createColumnHelper<AssignItemsData>();
  const columns = [
    columnHelper.accessor("itemNumber", {
      header: () => "Item #",
    }),
    columnHelper.accessor("description", {
      header: () => "Description",
    }),
    columnHelper.accessor("status", {
      header: () => "Status",
      cell: (info) => info.getValue()?.status,
    }),
  ];

  table = useReactTable({
    data: props.pedningItemTableData,
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
          These line items need to be settled before closing the claim:
        </div>
        <CustomReactTable
          table={table}
          tableDataErrorMsg={!props.pedningItemTableData && "No Record Found"}
          loader={false}
        />
      </div>
    </Fragment>
  );
}

export default ItemsList;
