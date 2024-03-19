"use client";
import React, { useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ConnectedProps, connect } from "react-redux";
import ExcelSheetTableStyle from "./ExcelSheetTable.module.scss";
import { RootState } from "@/store/store";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  setExcelCsvUploadData,
  removeRowById,
} from "@/reducers/_adjuster_reducers/UploadCSV/excelCsvUploadSlice";
import { getUSDCurrency } from "@/utils/utitlity";

import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { uploadItemFromCsvTranslatePropType } from "@/app/[lang]/(adjuster)/upload-items-from-csv/page";

interface ExcelSheetTableProps {
  postLossItemDetails: any[];
}

const ExcelSheetTable: React.FC<ExcelSheetTableProps & connectorType> = (props) => {
  const { translate } =
    useContext<TranslateContextData<uploadItemFromCsvTranslatePropType>>(
      TranslateContext
    );

  const { postLossItemDetails, setExcelCsvUploadData, removeRowById, rowsProcessed } =
    props;

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
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.serialNo,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor("brand", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.brand,
      meta: {
        editableField: true,
      },
    }),

    columnHelper.accessor("model", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.model,
      meta: {
        editableField: true,
      },
    }),

    columnHelper.accessor("description", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.description,
      meta: {
        editableField: true,
      },
    }),

    columnHelper.accessor("ageInYear", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.ageInYear,
      meta: {
        editableField: true,
      },
    }),

    columnHelper.accessor("ageInMonth", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.ageInMonth,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("condition", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.condition,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("purchasedFrom", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.purchasedFrom,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("purchasedMethod", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.purchasedMethod,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("quantity", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.quantity,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("replacementCost", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.statedValue,
      meta: {
        editableField: true,
      },
      cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
      id: "replacementCost",
    }),
    columnHelper.accessor("roomName", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.roomName,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("roomType", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.roomType,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("totalCost", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.totalCost,
      meta: {
        editableField: false,
      },
      cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
      id: "totalCost",
    }),
    columnHelper.accessor("category", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.category,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("subCategory", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.subCategory,
      meta: {
        editableField: true,
      },
    }),
    columnHelper.accessor("action", {
      header: translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.action,
      cell: (info) => {
        return editableRowId === info.row.original.id ? (
          <>
            <button
              className={ExcelSheetTableStyle.saveButton}
              onClick={() => handleSaveRow()}
            >
              {translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.save}
            </button>
            <button
              className={ExcelSheetTableStyle.cancelButton}
              onClick={() => handleCancelEdit()}
            >
              {translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.cancel}
            </button>
          </>
        ) : (
          <>
            <button
              className={ExcelSheetTableStyle.removeButton}
              onClick={() => handleRemoveRow(info.row.original.id)}
            >
              {translate?.uploadItemFromCsvTranslate?.uploadedFileSection?.remove}
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
