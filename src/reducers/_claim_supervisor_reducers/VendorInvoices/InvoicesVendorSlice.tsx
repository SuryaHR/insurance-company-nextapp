import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { vendorInvoicesTableData } from "@/services/_claim_supervisor_services/InvoiceVendorService";

const initialState = {
  vendorInvoicesDataFull: [],
  vendorInvoicesListAPIData: [],
  searchKeyword: "",
  totalCount: 0,
};

export const fetchVendorTableAction = createAsyncThunk(
  "vendorInvoices/fetchData",
  async (
    payload: {
      userId: any;
      page: any;
      sortBy: any;
      orderBy: any;
      searchString: any;
      limit: any;
    },
    api
  ) => {
    console.log("kashhjsddddd");
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await vendorInvoicesTableData(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const InvoicesVendorSlice = createSlice({
  initialState,
  name: "vendorInvoices",
  reducers: {
    setVendorInvoicesDataFull(state, action) {
      state.vendorInvoicesDataFull = action.payload;
    },
    addVendorInvoicesSearchKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;
      state.searchKeyword = searchKeyword;
    },
    updateVendorInvoicesData(state, action) {
      const { payload } = action;
      const { vendorInvoicesListData } = payload;
      state.vendorInvoicesDataFull = vendorInvoicesListData;
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchVendorTableAction.pending, (state) => {
      state.vendorInvoicesDataFull = [];
    });
    builder.addCase(fetchVendorTableAction.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.status === 200) {
        console.log("jhagjsddassss", payload.data?.invoices);
        state.vendorInvoicesDataFull = payload?.data?.invoices ?? [];
        state.totalCount = payload?.data?.totalCount;
        state.vendorInvoicesListAPIData = payload?.data?.invoices ?? [];
      }
    });
    builder.addCase(fetchVendorTableAction.rejected, (state) => {
      state.vendorInvoicesDataFull = initialState.vendorInvoicesDataFull;
    });
  },
});

export default InvoicesVendorSlice;

export const {
  addVendorInvoicesSearchKeyWord,
  setVendorInvoicesDataFull,
  updateVendorInvoicesData,
} = InvoicesVendorSlice.actions;
