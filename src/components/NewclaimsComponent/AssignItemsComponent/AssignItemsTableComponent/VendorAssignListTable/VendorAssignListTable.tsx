"use client";
import React, { useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import VendorListStyle from "./vendorAssignListTable.module.scss";

const SelectVendorAssignListTable: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  type AddItemsData = {
    select: boolean;
    name: string;
    assignmentsInHand: number;
    itemsHand: number;
    specialities: string;
    city: string;
  };

  const columnHelper = createColumnHelper<AddItemsData>();

  const columns = [
    columnHelper.accessor("select", {
      id: "checkbox",
      header: () => null,
      cell: () => (
        <input
          type="radio"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          //   className={TableLisStyle.checkboxInput}
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: () => `Name`,
    }),

    columnHelper.accessor("assignmentsInHand", {
      header: () => `Assignments in Hand`,
    }),
    columnHelper.accessor("itemsHand", {
      header: () => `Items Hand`,
    }),

    columnHelper.accessor("specialities", {
      header: () => `Specialities`,
    }),
    columnHelper.accessor("city", {
      header: () => `City`,
    }),
  ];

  const data: AddItemsData[] = [
    {
      select: false,
      name: "John",
      assignmentsInHand: 3,
      itemsHand: 5,
      specialities: "Programming",
      city: "New York",
    },
  ];
  const table = useReactTable({
    columns,
    data,
    enableColumnFilters: false,
    getCoreRowModel: getCoreRowModel<AddItemsData>(),
  });

  return (
    <>
      <div className={VendorListStyle.addListTableContainer}>
        <CustomReactTable
          table={table}
          // totalClaims={props.totalClaims}
          // pageLimit={pageLimit}
          // showStatusColor={true}
          // loader={loader}
          // tableDataErrorMsg={props.claimErrorMsg}
        />
      </div>
    </>
  );
};

export default SelectVendorAssignListTable;
