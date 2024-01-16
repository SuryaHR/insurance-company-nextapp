"use client";
import React, { useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  // getSortedRowModel,
  // SortingState,
  useReactTable,
  // PaginationState,
} from "@tanstack/react-table";
// import { useDispatch } from "react-redux";
// import { TABLE_LIMIT_20 } from "@/constants/constants";
import { ConnectedProps, connect } from "react-redux";
// import { useSelector } from "react-redux";
import ExcelSheetTableStyle from "./ExcelSheetTable.module.scss";
import { RootState } from "@/store/store";
// import { setExcelCsvUploadData, removeRowById } from "@/";
// import { setExcelCsvUploadData, removeRowById } from "@/services/excelCsvUploadSlice";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  setExcelCsvUploadData,
  removeRowById,
} from "@/reducers/UploadCSV/excelCsvUploadSlice";

interface ExcelSheetTableProps {
  postLossItemDetails: any[];
  // removeRowById: (id: number) => void;
  // failedItems: any[];
  // failedItems: FailedItem[];
}

const ExcelSheetTable: React.FC<ExcelSheetTableProps & connectorType> = (props) => {
  // const dispatch = useDispatch();
  const { postLossItemDetails, setExcelCsvUploadData, removeRowById, rowsProcessed } =
    props;
  console.log("postLossItemDetails", postLossItemDetails);

  const data: ExcelTableData[] = React.useMemo(
    () => postLossItemDetails,
    [postLossItemDetails]
  );
  const [editableRowId, setEditableRowId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<ExcelTableData>({ ...data[0] });

  type ExcelTableData = {
    id: number;
    brand: string | null;
    model: string | null;
    description: string;
    ageInYear: number | null;
    ageInMonth: number;
    condition: string | null;
    purchasedFrom: string | null;
    purchasedMethod: string | null;
    quantity: number;
    replacementCost: number;
    roomType: string | null;
    roomName: string | null;
    totalCost: number;
    category: string;
    subCategory: string | null;
    action: () => void;
    isValidItem: any;
    isValidQuantity: any;
  };

  const handleSaveRow = async () => {
    await updateData(editedData);
    await setEditableRowId(null);
  };

  const handleEditRowClick = (rowData: any) => {
    if (editableRowId !== rowData.id) {
      setEditableRowId(rowData.id);
      setEditedData({ ...rowData });
    }
  };

  const handleCancelEdit = async () => {
    await setEditedData({ ...postLossItemDetails[0] });
    await setEditableRowId(null);
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    columnName: string
  ) => {
    const { value } = e.target;
    let updatedData: ExcelTableData = {
      ...editedData,
      [columnName]: value,
    } as ExcelTableData;
    const updateTotalCost = () => {
      const updatedQuantity =
        columnName === "quantity" ? parseFloat(value) : editedData?.quantity || 0;
      const updatedReplacementCost =
        columnName === "replacementCost"
          ? parseFloat(value)
          : editedData?.replacementCost || 0;

      const updatedTotalCost =
        isNaN(updatedQuantity) || isNaN(updatedReplacementCost)
          ? 0
          : updatedQuantity * updatedReplacementCost;

      const isValidItem =
        updatedData.ageInMonth !== null && updatedData.replacementCost !== null;
      const isValidQuantity = updatedData.quantity !== null && updatedData.quantity !== 0;

      updatedData = {
        ...updatedData,
        totalCost: updatedTotalCost,
        isValidItem,
        isValidQuantity,
      };
    };

    if (
      columnName === "quantity" ||
      columnName === "replacementCost" ||
      columnName === "ageInMonth"
    ) {
      updateTotalCost();
    }

    await setEditedData(updatedData);

    if (columnName === "quantity" || columnName === "replacementCost") {
      updateTotalCost();
      await updateData(updatedData);
    }
  };

  const updateData = async (updatedRow: any) => {
    const updatedPostLossItemDetails = postLossItemDetails.map((row: any) =>
      row.id === updatedRow.id ? updatedRow : row
    );

    await setExcelCsvUploadData({
      postLossItemDetails: updatedPostLossItemDetails,
      rowsProcessed: rowsProcessed,
      message: "",
      status: 0,
    });
  };

  const columnHelper = createColumnHelper<ExcelTableData>();

  const columns = [
    columnHelper.accessor("id", {
      header: "Sl No #",
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor("brand", {
      header: "Brand",
      meta: {
        editableField: true,
      },
    }),

    columnHelper.accessor("model", {
      header: "Model",
      meta: {
        editableField: true,
      },
    }),

    columnHelper.accessor("description", {
      header: "Description",
      meta: {
        editableField: true,
      },
    }),

    columnHelper.accessor("ageInYear", {
      header: "Age In Year",
      meta: {
        editableField: true,
      },
    }),

    columnHelper.accessor("ageInMonth", {
      header: "Age In Month",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("condition", {
      header: "Condition",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("purchasedFrom", {
      header: "Purchased From",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("purchasedMethod", {
      header: "Purchased Method",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("replacementCost", {
      header: "Stated Value",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("roomName", {
      header: "Room Name",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("roomType", {
      header: "Room Type",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("totalCost", {
      header: "Total Cost",
      meta: {
        editableField: false,
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("subCategory", {
      header: "Sub Category",
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: (info) => {
        // const isEditable = editableRowId === info.row.original.id;

        return editableRowId === info.row.original.id ? (
          <>
            <button
              className={ExcelSheetTableStyle.saveButton}
              onClick={() => handleSaveRow()}
            >
              Save
            </button>
            <button
              className={ExcelSheetTableStyle.cancelButton}
              onClick={() => handleCancelEdit()}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className={ExcelSheetTableStyle.removeButton}
              onClick={() => handleRemoveRow(info.row.original.id)}
            >
              Remove
            </button>
          </>
        );
      },
      enableSorting: false,
    }),
  ];

  const handleRemoveRow = (id: number) => {
    removeRowById(id);
  };

  const table = useReactTable({
    data: postLossItemDetails,
    columns,
    enableColumnFilters: false,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel<ExcelTableData>(),
  });

  return (
    <>
      <CustomReactTable
        table={table}
        handleRowClick={handleEditRowClick}
        editableRowId={editableRowId}
        editedData={editedData}
        handleEditChange={handleChange}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  postLossItemDetails: state.excelCsvUpload.postLossItemDetails,
  rowsProcessed: state.excelCsvUpload.rowsProcessed,
});

const mapDispatchToProps = {
  setExcelCsvUploadData,
  removeRowById,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ExcelSheetTable);
