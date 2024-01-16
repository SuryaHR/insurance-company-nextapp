"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import AssignTableStyle from "./AssignTable.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setCategories,
} from "@/reducers/UploadCSV/AddItemsTableCSVSlice";

interface AssignTableProps {
  selectedRows: any[];
  selectedCategory: any;
}

const AssignTable: React.FC<AssignTableProps & connectorType> = ({
  selectedRows,
  selectedCategory,
}) => {
  type AssignItemsModalData = {
    description: string;
    category: { category: string };
    select: boolean;
    unitCost: string;
  };

  const [filterData, setFilterData] = useState<any>([]);
  useEffect(() => {
    const categoryData =
      selectedCategory?.label === "All"
        ? selectedRows
        : selectedRows.filter(
            (item: any) => item.category?.name === selectedCategory?.label
          );
    setFilterData(categoryData);
  }, [selectedCategory]);

  const columnHelper = createColumnHelper<AssignItemsModalData>();
  const checkboxAccessor = (data: AssignItemsModalData) => data.select;

  const columns = [
    columnHelper.accessor(checkboxAccessor, {
      header: () => (
        <div
          className="d-flex justify-content-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            onChange={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      ),
      meta: {},
      id: "check",
      enableColumnFilter: false,
      cell: () => (
        <div
          className="d-flex justify-content-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            onChange={() => {
              // handleCheckboxChange(row.original);
            }}
          />
        </div>
      ),
    }),

    columnHelper.accessor("description", {
      header: () => `Item Description`,
    }),
    columnHelper.accessor((data) => data?.category?.category, {
      header: () => `Category`,
      id: "category",
    }),
    columnHelper.accessor("unitCost", {
      header: () => `Total Cost`,
    }),
  ];

  const table = useReactTable({
    columns,
    data: filterData,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    enableColumnFilters: false,
  });

  return (
    <>
      <div className={AssignTableStyle.addListTableContainer}>
        <CustomReactTable table={table} filterData={filterData} />
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  addItemsTableData: state.addItemsTable.addItemsTableData,
  selectedItems: state.addItemsTable.selectedItems,
  selectedRows: state.addItemsTable.selectedRows,
  selectedCategory: state.addItemsTable.selectedCategory,
});

const mapDispatchToProps = {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setCategories,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AssignTable);
