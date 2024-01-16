"use client";
import React from "react";
import { useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import TableListStyle from "./itemsAssignListTable.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import clsx from "clsx";
import Modal from "@/components/common/ModalPopups";
import ItemsToAssignTable from "@/components/ItemsToAssignTable";

interface ItemsAssignListTableProps {
  selectedItems: any[];
  selectedRows: any[];
}
const ItemsAssignListTable: React.FC<ItemsAssignListTableProps & connectorType> = (
  selectedRows
) => {
  type AssignItemsData = {
    itemNumber: string;
    description: string;
    status: { status: string };
    qty: string;
    category: { category: string };
    ageMonths: number;
    select: boolean;
    quantity: string;
    totalStatedAmount: string;
    individualLimitAmount: string;
    scheduledItem: string;
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  console.log(selectedRows, "selectedItems inside assign list table");

  const columnHelper = createColumnHelper<AssignItemsData>();
  const checkboxAccessor = (data: AssignItemsData) => data.select;

  const columns = [
    columnHelper.accessor(checkboxAccessor, {
      header: () => (
        <div
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
    columnHelper.accessor("itemNumber", {
      header: () => `Item #`,
    }),
    columnHelper.accessor("description", {
      header: () => `Description`,
    }),
    columnHelper.accessor("quantity", {
      header: () => `Quantity`,
    }),
    columnHelper.accessor("totalStatedAmount", {
      header: () => `Stated Value`,
    }),
    columnHelper.accessor("ageMonths", {
      header: () => `Age`,
      cell: (info) => info.renderValue(),
      enableSorting: false,
    }),
    columnHelper.accessor((data) => data?.category?.category, {
      header: () => `Category`,
      id: "category",
    }),
    columnHelper.accessor("individualLimitAmount", {
      header: () => `Individual Limit`,
    }),
    columnHelper.accessor("scheduledItem", {
      header: () => `Scheduled Item`,
    }),
    columnHelper.accessor((data) => data.status.status, {
      header: () => `Status`,
      id: "status",
    }),
  ];

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const table = useReactTable({
    columns,
    data: selectedRows?.selectedRows,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    enableColumnFilters: false,
  });

  return (
    <>
      <div className={TableListStyle.addListTableContainer}>
        <div className="col-12">
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            childComp={<ItemsToAssignTable closeModal={closeModal} />}
            headingName="Items to Assign"
            overlayClassName={TableListStyle.modalContainer}
            modalWidthClassName={TableListStyle.modalWidth}
          ></Modal>
        </div>

        <CustomReactTable table={table} />
        {selectedRows?.selectedRows?.length > 10 && (
          <div className={clsx(TableListStyle.textAlignCenter, "row")}>
            <a onClick={handleClick}>view all items</a>
          </div>
        )}
      </div>

      <div className="row">
        <label className={TableListStyle.labelStyles}>Item(s) Summary</label>
      </div>
      <div className="row">
        <div className="col-md-4 col-sm-6 col-12">
          <label className={TableListStyle.labelStyles}>Total Item(s) Selected:</label>
        </div>
        <div className="col-md-4 col-sm-6 col-12">
          <label className={TableListStyle.labelStyles}>Selected Items Categories:</label>
        </div>
      </div>
      <div className="row">
        <label className={TableListStyle.labelStyles}>Total Stated Value:</label>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  addItemsTableData: state.addItemsTable.addItemsTableData,
  selectedItems: state.addItemsTable.selectedItems,
  selectedRows: state.addItemsTable.selectedRows,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ItemsAssignListTable);
