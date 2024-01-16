import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type ExcelTableData = {
//   id: number;
//   brand: string | null;
//   model: string | null;
//   description: string;
//   ageInYear: number | null;
//   ageInMonth: number | null;
//   condition: string | null;
//   purchasedFrom: string | null;
//   purchasedMethod: string | null;
//   quantity: string | null;
//   statedValue: number;
//   roomType: string | null;
//   roomName: string | null;
//   totalCost: number;
//   category: string | null;
//   subCategory: string | null;
//   action: () => void;
// };

interface ExcelCsvUploadState {
  postLossItemDetails: any[];
  rowsProcessed: number;
  message: string;
  status: number;
}

const initialState: ExcelCsvUploadState = {
  postLossItemDetails: [],
  message: "",
  status: 0,
  rowsProcessed: 0,
};

// const ExcelCsvUploadSlice = createSlice({
//   name: "excelCsvUpload",
//   initialState,
//   reducers: {
//     setExcelCsvUploadData(state, action: PayloadAction<ExcelCsvUploadState>) {
//       state.postLossItemDetails = action.payload.postLossItemDetails;
//       state.message = action.payload.message;
//       state.status = action.payload.status;
//     },
//   },
// });

const ExcelCsvUploadSlice = createSlice({
  name: "excelCsvUpload",
  initialState,
  reducers: {
    setExcelCsvUploadData(state, action: PayloadAction<ExcelCsvUploadState>) {
      state.postLossItemDetails = action.payload.postLossItemDetails;
      state.message = action.payload.message;
      state.rowsProcessed = action.payload.rowsProcessed;
      state.status = action.payload.status;
    },
    removeRowById(state, action: PayloadAction<number>) {
      state.postLossItemDetails = state.postLossItemDetails.filter(
        (row) => row.id !== action.payload
      );
    },
  },
});

export const { setExcelCsvUploadData, removeRowById } = ExcelCsvUploadSlice.actions;
export default ExcelCsvUploadSlice;
