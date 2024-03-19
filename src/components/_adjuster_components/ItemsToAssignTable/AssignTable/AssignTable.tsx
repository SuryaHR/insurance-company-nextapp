"use client";
import React, { useEffect, useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import AssignTableStyle from "./AssignTable.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import GenericButton from "@/components/common/GenericButton";
import {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setCategories,
  setSelectedItemsUUIDs,
  updateVendorAssignmentPayload,
} from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import { useDispatch } from "react-redux";
import { getUSDCurrency } from "@/utils/utitlity";

interface AssignTableProps {
  selectedItems: any[];
  selectedCategory: any;
  closeModal: () => void;
  handleRowSelect: (itemId: number) => void;
}

const AssignTable: React.FC<AssignTableProps & connectorType> = ({
  selectedItems,
  selectedCategory,
  setSelectedItems,
  closeModal,
}) => {
  type AssignItemsModalData = {
    id: any;
    description: string;
    category: { name: string };
    select: boolean;
    unitCost: string | any;
  };

  const [filterData, setFilterData] = useState<any>(selectedItems);
  const dispatch = useDispatch();

  useEffect(() => {
    const areAllChecked =
      selectedItems.length === 0 || selectedItems.every((item) => item.select === true);
    if (!areAllChecked) {
      const updatedSelectedItems = selectedItems.map((item) => ({
        ...item,
        select: true,
      }));
      setSelectedItems(updatedSelectedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHeaderCheckboxChange = () => {
    const areAllChecked = selectedItems.every((item) => item.select);

    const updatedSelectedItems = selectedItems.map((item) => ({
      ...item,
      select: !areAllChecked,
    }));

    setSelectedItems(updatedSelectedItems);
  };

  const handleRowSelect = (itemId: number) => {
    const updatedSelectedItems = selectedItems.map((item) =>
      item.id === itemId ? { ...item, select: !item.select } : item
    );
    const updatedSelectedUUIDs = updatedSelectedItems
      .filter((item) => item.select)
      .map((item) => item.uuid);
    setSelectedItems(updatedSelectedItems);
    dispatch(setSelectedItemsUUIDs(updatedSelectedUUIDs));
    dispatch(updateVendorAssignmentPayload({ claimedItems: updatedSelectedUUIDs }));
  };

  const handleSave = () => {
    const updatedSelectedItems = selectedItems.filter((item) => item.select);
    setSelectedItems(updatedSelectedItems);
    const updatedFilterData = filterData.filter((item: { select: any }) => item.select);
    setFilterData(updatedFilterData);
    closeModal();
  };

  useEffect(() => {
    if (selectedCategory?.label === "All") {
      setFilterData(selectedItems);
    } else {
      const categoryData = selectedItems.filter(
        (item: any) => item.category && item.category.name === selectedCategory?.label
      );
      setFilterData(categoryData);
    }
  }, [selectedCategory, selectedItems]);

  useEffect(() => {
    setFilterData(selectedItems);
  }, [selectedItems]);

  const columnHelper = createColumnHelper<AssignItemsModalData>();
  const checkboxAccessor = (data: AssignItemsModalData) => data.select;

  const columns = [
    columnHelper.accessor(checkboxAccessor, {
      header: () => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleHeaderCheckboxChange();
          }}
        >
          <input
            type="checkbox"
            className={AssignTableStyle.checkbox}
            checked={
              selectedItems.length > 0 && selectedItems.every((item) => item.select)
            }
            onChange={(e) => {
              e.stopPropagation();
              handleHeaderCheckboxChange();
            }}
          />
        </div>
      ),
      meta: {
        headerClass: AssignTableStyle.checkHeader,
      },
      id: "check",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div
          className="d-flex justify-content-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            className={AssignTableStyle.checkbox}
            checked={row.original.select}
            onChange={(e) => {
              e.stopPropagation();
              handleRowSelect(row.original.id);
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: () => "Item Description",
    }),
    columnHelper.accessor((data) => data.category?.name, {
      header: () => "Category",
      id: "category",
    }),
    columnHelper.accessor("unitCost", {
      header: () => "Total Cost",
      cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
      id: "unitCost",
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
        {filterData.length > 0 ? (
          <CustomReactTable table={table} filteredData={filterData} />
        ) : (
          <div className={AssignTableStyle.noItemsStyle}>No items available</div>
        )}
      </div>
      <div className={AssignTableStyle.buttonContainer}>
        <div className="mx-2">
          <GenericButton label={"Cancel"} size="medium" onClick={closeModal} />
        </div>
        <div className="mx-2">
          <GenericButton label={"Save"} size="medium" onClick={handleSave} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  addItemsTableData: state.addItemsTable.addItemsTableData,
  selectedItems: state.addItemsTable.selectedItems,
  selectedRows: state.addItemsTable.selectedRows,
  selectedCategory: state.addItemsTable.selectedCategory,
  selectedItemsUUIDs: state.addItemsTable.selectedItemsUUIDs,
});

const mapDispatchToProps = {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setCategories,
  setSelectedItemsUUIDs,
  updateVendorAssignmentPayload,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AssignTable);
