import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  receiptMapperPdfList: [],
  selectedPdf: {},
  mappedlineitemsList: [],
  selectedMappedItem: {},
  isopenmapper: false,
  searchKeyword: "",
};

const ReceiptMapperSlice = createSlice({
  initialState,
  name: "receiptMapper",
  reducers: {
    receiptMapperDate(state, action) {
      const { payload } = action;
      const { receiptMapperPdf } = payload;

      state.receiptMapperPdfList = receiptMapperPdf;
    },
    addSelectedFile(state, action) {
      const { payload } = action;
      const { selectedPdf } = payload;

      state.selectedPdf = selectedPdf;
    },
    addMappedlineitems(state, action) {
      const { payload } = action;
      const { mappedlineitemsList } = payload;

      state.mappedlineitemsList = mappedlineitemsList.data?.items;
    },

    addSelectedMappPoint(state, action) {
      const { payload } = action;
      const { selectedMappedItem } = payload;

      state.selectedMappedItem = selectedMappedItem;
    },
    setmapperOpen(state, action) {
      const { payload } = action;
      const { isopenmapper } = payload;

      state.isopenmapper = isopenmapper;
    },
    addReciptPdfListKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;

      state.searchKeyword = searchKeyword;
    },
  },
});
export default ReceiptMapperSlice;

export const {
  receiptMapperDate,
  addSelectedFile,
  addMappedlineitems,
  addSelectedMappPoint,
  setmapperOpen,
  addReciptPdfListKeyWord,
} = ReceiptMapperSlice.actions;
