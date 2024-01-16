"use client";
import React from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import TableLisStyle from "./listAddItems.module.scss";
import { ConnectedProps, connect } from "react-redux";
import {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setCategories,
  setSearchKeyword,
  deleteClaimContentListItem,
} from "@/reducers/UploadCSV/AddItemsTableCSVSlice";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { deleteClaimItem } from "@/services/ClaimContentListService";
import { addNotification } from "@/reducers/Notification/NotificationSlice";

interface ListAddItemsTableProps {
  addItemsTableData: any[];
  onCheckboxChange: (item: any) => void;
  selectedCategory: any;
  searchKeyword: string;
}

const ListAddItemsTable: React.FC<ListAddItemsTableProps & connectorType> = ({
  addItemsTableData,
  onCheckboxChange,
  selectedCategory,
  searchKeyword,
}) => {
  const dispatch = useDispatch();
  const [deletePayload, setDelete] = React.useState<React.SetStateAction<any>>(null);

  const deleteAction = (rowData: any) => {
    const payload = {
      id: rowData.id,
      itemUID: rowData.itemUID,
    };
    console.log("Delete Payload", payload);
    setDelete(payload);
  };

  const handleDeleteClose = () => {
    setDelete(null);
  };

  const handleDelete = async () => {
    const id = deletePayload?.id;
    console.log("Deleting Item with ID", id);
    const res = await deleteClaimItem(deletePayload);
    console.log("Delete Response", res);
    setDelete(null);

    if (res) {
      dispatch(
        addNotification({
          message: res ?? "Successfully deleted item.",
          id,
          status: "success",
        })
      );
      dispatch(deleteClaimContentListItem({ id }));
    } else {
      dispatch(
        addNotification({
          message: "Something went wrong.",
          id,
          status: "error",
        })
      );
    }
  };
  const handleCheckboxChange = (item: any) => {
    console.log("Selected Item", item);
    onCheckboxChange(item);
  };

  const pageLimit = 100;
  type AddItemsData = {
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
            onChange={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      ),
      meta: {
        headerClass: TableLisStyle.checkHeader,
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
            className={TableLisStyle.checkbox}
            onChange={() => {
              handleCheckboxChange(row.original);
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor("itemNumber", {
      header: () => "Item #",
      id: "itemNumber",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("description", {
      header: () => "Description",
      id: "description",
      enableColumnFilter: false,
    }),
    columnHelper.accessor((data) => data.status.status, {
      header: () => "Status",
      id: "status",
    }),

    columnHelper.accessor("totalStatedAmount", {
      header: () => "Total Value",
      id: "totalStatedAmount",
    }),
    columnHelper.accessor("quantity", {
      header: () => "Qty",
      id: "quantity",
      enableColumnFilter: false,
    }),
    columnHelper.accessor((data) => data.category?.name, {
      header: () => "Category",
      id: "category",
    }),
    columnHelper.accessor("ageMonths", {
      header: () => "Age",
      id: "ageMonths",
    }),
    columnHelper.accessor("action", {
      header: () => `Action`,
      cell: ({ row }) => (
        <div className={TableLisStyle.actionButtons}>
          <button className={TableLisStyle.editButton}>Edit</button>
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
        : addItemsTableData.filter((item) =>
            JSON.stringify(item).toLowerCase().includes(searchKeyword.toLowerCase())
          );

  console.log("Filtered Data", filteredData);

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
    pageCount: Math.ceil(addItemsTableData.length / pageLimit),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });
  console.log("Filtered Datassssssssssss", filteredData);

  return (
    <>
      {deletePayload && (
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
        {filteredData.length > 0 ? (
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
  deleteClaimContentListItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ListAddItemsTable);
