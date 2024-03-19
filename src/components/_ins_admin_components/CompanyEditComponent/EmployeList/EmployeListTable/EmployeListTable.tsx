"use client";
import React from "react";
import styles from "./EmployeListTable.module.scss";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";

const EmployeListTable = () => {
  type EmployeData = {
    id: string;
    firstName: any;
    lastName: string;
    email: string;
    phone: any;
    role: string;
    status: string;
    action: any;
  };
  const columnHelper = createColumnHelper<EmployeData>();
  const columns = [
    columnHelper.accessor("id", {
      header: () => "Id",
      enableSorting: true,
    }),
    columnHelper.accessor("firstName", {
      header: () => "First Name",
      enableSorting: true,
    }),
    columnHelper.accessor("lastName", {
      header: () => "Last Name",
      enableSorting: true,
    }),
    columnHelper.accessor("email", {
      header: () => "Email",
      enableSorting: true,
    }),
    columnHelper.accessor("phone", {
      header: () => "Phone",
      enableSorting: true,
    }),
    columnHelper.accessor("role", {
      header: () => "Role",
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: () => "Status",
      enableSorting: true,
    }),
    columnHelper.accessor("action", {
      header: () => "Action",
      enableSorting: true,
    }),
  ];

  const table = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    manualFiltering: false,
    enableColumnFilters: false,
  });

  return (
    <div className={styles.cont}>
      <CustomReactTable table={table} tableDataErrorMsg={"No Records"} />
    </div>
  );
};

export default EmployeListTable;
