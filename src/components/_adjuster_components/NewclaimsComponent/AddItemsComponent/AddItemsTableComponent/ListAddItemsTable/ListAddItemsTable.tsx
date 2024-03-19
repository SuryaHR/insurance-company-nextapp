"use client";
import React, { useEffect, useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import TableLisStyle from "./listAddItems.module.scss";
import { fetchClaimContentItemDetails } from "@/services/_adjuster_services/AddItemContentService";
import { ConnectedProps, connect } from "react-redux";
import {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setCategories,
  setSearchKeyword,
  deleteCategoryListItem,
  setSelectedRows,
  setSelectedItemsUUIDs,
} from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { deleteCategoryItem } from "@/services/_adjuster_services/ClaimService";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { getUSDCurrency } from "@/utils/utitlity";

interface ListAddItemsTableProps {
  addItemsTableData: any[];
  onCheckboxChange: (item: any) => void;
  selectedCategory: any;
  searchKeyword: string;
  setEditItem: (rowData: any) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setTableLoader: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: any[];
}

const ListAddItemsTable: React.FC<ListAddItemsTableProps & connectorType> = ({
  addItemsTableData,
  selectedCategory,
  searchKeyword,
  setEditItem,
  setIsModalOpen,
  setTableLoader,
  selectedItems,
}) => {
  const dispatch = useDispatch();
  const [deletePayload, setDelete] = useState<React.SetStateAction<any>>(null);
  const [checkedItems, setCheckedItems] = useState<any[]>(selectedItems);
  const [showConfirmationModal, setShowConfirmationModal] = useState(true);

  const editAction = async (rowData: any) => {
    const payload = {
      forEdit: true,
      itemId: rowData.id,
    };
    await fetchClaimContentItemDetails(payload, addItemsTableData);
    setEditItem(rowData);
    setIsModalOpen(true);
  };

  const deleteAction = (rowData: any) => {
    const payload = {
      id: rowData.id,
      itemUID: rowData.itemUID,
    };
    setDelete(payload);
  };

  const handleDeleteClose = () => {
    setDelete(null);
  };

  const handleDelete = async () => {
    setShowConfirmationModal(false);
    const id = deletePayload?.id;

    try {
      setTableLoader(true);

      const res = await deleteCategoryItem(deletePayload);

      if (res) {
        dispatch(
          addNotification({
            message: res ?? "Successfully deleted item.",
            id,
            status: "success",
          })
        );
        dispatch(deleteCategoryListItem({ id }));
        setTimeout(() => {
          setTableLoader(false);
        }, 300);
      } else {
        dispatch(
          addNotification({
            message: "Something went wrong.",
            id,
            status: "error",
          })
        );
      }
    } catch (error) {
      console.error("Error while deleting item", error);
      dispatch(
        addNotification({
          message: "An error occurred while deleting the item.",
          id,
          status: "error",
        })
      );
    } finally {
      setDelete(null);
      setShowConfirmationModal(true);
      setTableLoader(false);
    }
  };

  const handleCheckboxChange = (item: any) => {
    let updatedCheckedItems = [...checkedItems];
    const isChecked = checkedItems.some((checkedItem) => checkedItem.id === item.id);

    if (isChecked) {
      updatedCheckedItems = updatedCheckedItems.filter(
        (checkedItem) => checkedItem.id !== item.id
      );
    } else {
      updatedCheckedItems.push(item);
    }

    setCheckedItems(updatedCheckedItems);
    dispatch(setSelectedItems(updatedCheckedItems));
    dispatch(setSelectedRows(updatedCheckedItems));
    const updatedSelectedUUIDs = checkedItems.map((checkedItem) => checkedItem.uuid);
    dispatch(setSelectedItemsUUIDs(updatedSelectedUUIDs));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCheckedItems = event.target.checked ? addItemsTableData : [];
    setCheckedItems(updatedCheckedItems);
    dispatch(setSelectedItems(updatedCheckedItems));
    dispatch(setSelectedRows(updatedCheckedItems));
  };

  useEffect(() => {
    setCheckedItems(selectedItems);
  }, [selectedItems]);

  const pageLimit = 100;
  type AddItemsData = {
    id: any;
    itemNumber: number;
    description: string;
    status: { status: string };
    totalStatedAmount: number;
    quantity: string;
    category: { name: string };
    ageMonths: number;
    action: { edit: boolean; delete: boolean };
    select: boolean;
  };

  const columnHelper = createColumnHelper<AddItemsData>();
  const checkboxAccessor = (data: AddItemsData) => data.select;

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
            className={TableLisStyle.checkbox}
            checked={checkedItems.length === addItemsTableData.length}
            onChange={(e) => {
              e.stopPropagation();
              handleSelectAll(e);
            }}
          />
        </div>
      ),
      meta: {
        headerClass: TableLisStyle.checkHeader,
      },
      id: "check",
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <div
          className="d-flex justify-content-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            className={TableLisStyle.checkbox}
            checked={checkedItems.some(
              (checkedItem) => checkedItem.id === row.original.id
            )}
            onChange={() => handleCheckboxChange(row.original)}
          />
        </div>
      ),
    }),
    columnHelper.accessor("itemNumber", {
      header: () => "Item #",
      id: "itemNumber",
      enableColumnFilter: false,
      cell: (info: any) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("description", {
      header: () => "Description",
      id: "description",
      enableColumnFilter: false,
      cell: (info: any) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor((data) => data.status.status, {
      header: () => "Status",
      id: "status",
      cell: (info: any) => info.getValue(),
      enableSorting: false,
    }),

    columnHelper.accessor("totalStatedAmount", {
      header: () => "Total Value",
      id: "totalStatedAmount",
      cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor("quantity", {
      header: () => "Qty",
      id: "quantity",
      enableColumnFilter: false,
      cell: (info: any) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor((data) => data.category?.name, {
      header: () => "Category",
      id: "category",
      cell: (info: any) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("ageMonths", {
      header: () => "Age",
      id: "ageMonths",
      cell: (info: any) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("action", {
      header: () => `Action`,
      cell: ({ row }) => (
        <div className={TableLisStyle.actionButtons}>
          <button
            className={TableLisStyle.editButton}
            onClick={(e) => {
              e.stopPropagation();
              editAction(row.original);
            }}
          >
            Edit
          </button>
          <button
            className={TableLisStyle.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              deleteAction(row.original);
            }}
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const filteredData =
    selectedCategory?.label === "All"
      ? addItemsTableData.filter((item) =>
          JSON.stringify(item).toLowerCase().includes(searchKeyword.toLowerCase())
        )
      : selectedCategory?.label
        ? addItemsTableData
            .filter((item) => item.category?.name === selectedCategory?.label)
            .filter((item) =>
              JSON.stringify(item).toLowerCase().includes(searchKeyword.toLowerCase())
            )
        : addItemsTableData?.filter((item) =>
            JSON.stringify(item).toLowerCase().includes(searchKeyword.toLowerCase())
          );

  const ModalMsg = () => {
    return (
      <div>
        Are you sure you want to delete this item?<b> Please Confirm!</b>
      </div>
    );
  };

  const table = useReactTable({
    columns,
    data: filteredData,
    enableColumnFilters: false,
    pageCount: Math.ceil(addItemsTableData?.length / pageLimit),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <>
      {deletePayload && showConfirmationModal && (
        <div>
          <ConfirmModal
            showConfirmation={true}
            closeHandler={handleDeleteClose}
            submitBtnText="Yes"
            closeBtnText="No"
            childComp={<ModalMsg />}
            modalHeading="Delete Item"
            submitHandler={handleDelete}
          />
        </div>
      )}
      <div className={TableLisStyle.addListTableContainer}>
        {filteredData?.length > 0 ? (
          <CustomReactTable table={table} filteredData={filteredData} />
        ) : (
          <div className={TableLisStyle.noItemsStyle}>No items available</div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  addItemsTableData: state.addItemsTable.addItemsTableData,
  selectedItems: state.addItemsTable.selectedItems,
  isAnyItemSelected: state.addItemsTable.isAnyItemSelected,
  selectedCategory: state.addItemsTable.selectedCategory,
  categories: state.addItemsTable.categories,
  searchKeyword: state.addItemsTable.searchKeyword,
});

const mapDispatchToProps = {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setCategories,
  setSearchKeyword,
  deleteCategoryListItem,
  setSelectedRows,
  setSelectedItemsUUIDs,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ListAddItemsTable);
