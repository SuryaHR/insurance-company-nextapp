import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getVendorInvoice,
  getVendorInvoiceAdjusters,
  getVendorInvoiceLineItem,
  getVendorInvoiceRegVendors,
  getVendorInvoiceStatus,
} from "@/services/_adjuster_services/VendorInvoicePayments/VendorInvoiceService";

const initialState = {
  vendorInvoice: [],
  vendorInvoicefetching: true,
  vendorInvoiceStatus: [],
  vendorInvoiceStatusfetching: true,
  vendorInvoiceRegVendors: [],
  vendorInvoiceRegVendorsfetching: true,
  vendorInvoiceAdjusters: [],
  vendorInvoiceAdjustersfetching: true,
  vendorInvoiceLineItem: [],
  vendorInvoiceLineItemfetching: true,
};

export const fetchVendorInvoice = createAsyncThunk(
  "vendorInvoice/fetchData",
  async (payload: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorInvoice(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorInvoiceStatus = createAsyncThunk(
  "vendorInvoiceStatus/fetchData",
  async (_: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorInvoiceStatus();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorInvoiceRegVendors = createAsyncThunk(
  "vendorInvoiceRegVendors/fetchData",
  async (_: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorInvoiceRegVendors();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorInvoiceAdjusters = createAsyncThunk(
  "vendorInvoiceAdjusters/fetchData",
  async (payload: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorInvoiceAdjusters(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorInvoiceLineItem = createAsyncThunk(
  "VendorInvoiceLineItem/fetchData",
  async (payload: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorInvoiceLineItem(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const VendorInvoiceSlice = createSlice({
  initialState,
  name: "vendorInvoiceSlice",
  reducers: {
    addSelectedVendorInvoiceId(state, action) {
      const { payload } = action;
      state = { ...state, ...payload };
      return state;
    },
  },
  extraReducers(builder) {
    // VendorInvoice
    builder.addCase(fetchVendorInvoice.pending, (state) => {
      state.vendorInvoicefetching = true;
      state.vendorInvoice = [];
    });
    builder.addCase(fetchVendorInvoice.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorInvoicefetching = false;
      if (payload && payload?.status === 200) {
        state.vendorInvoice = payload?.data;
      }
    });
    builder.addCase(fetchVendorInvoice.rejected, (state) => {
      state.vendorInvoicefetching = false;
      state.vendorInvoice = initialState.vendorInvoice;
    });
    // VendorInvoiceStatus
    builder.addCase(fetchVendorInvoiceStatus.pending, (state) => {
      state.vendorInvoiceStatusfetching = true;
      state.vendorInvoiceStatus = [];
    });
    builder.addCase(fetchVendorInvoiceStatus.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorInvoiceStatusfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorInvoiceStatus = payload?.data;
      }
    });
    builder.addCase(fetchVendorInvoiceStatus.rejected, (state) => {
      state.vendorInvoiceStatusfetching = false;
      state.vendorInvoiceStatus = initialState.vendorInvoiceStatus;
    });
    // VendorInvoiceRegVendors
    builder.addCase(fetchVendorInvoiceRegVendors.pending, (state) => {
      state.vendorInvoiceRegVendorsfetching = true;
      state.vendorInvoiceRegVendors = [];
    });
    builder.addCase(fetchVendorInvoiceRegVendors.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorInvoiceRegVendorsfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorInvoiceRegVendors = payload?.data;
      }
    });
    builder.addCase(fetchVendorInvoiceRegVendors.rejected, (state) => {
      state.vendorInvoiceRegVendorsfetching = false;
      state.vendorInvoiceRegVendors = initialState.vendorInvoiceRegVendors;
    });

    // VendorInvoiceAdjusters
    builder.addCase(fetchVendorInvoiceAdjusters.pending, (state) => {
      state.vendorInvoiceAdjustersfetching = true;
      state.vendorInvoiceAdjusters = [];
    });
    builder.addCase(fetchVendorInvoiceAdjusters.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorInvoiceAdjustersfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorInvoiceAdjusters = payload?.data;
      }
    });
    builder.addCase(fetchVendorInvoiceAdjusters.rejected, (state) => {
      state.vendorInvoiceAdjustersfetching = false;
      state.vendorInvoiceAdjusters = initialState.vendorInvoiceAdjusters;
    });

    // VendorInvoiceLineItem
    builder.addCase(fetchVendorInvoiceLineItem.pending, (state) => {
      state.vendorInvoiceLineItemfetching = true;
      state.vendorInvoiceLineItem = [];
    });
    builder.addCase(fetchVendorInvoiceLineItem.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorInvoiceLineItemfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorInvoiceLineItem = payload?.data;
      }
    });
    builder.addCase(fetchVendorInvoiceLineItem.rejected, (state) => {
      state.vendorInvoiceLineItemfetching = false;
      state.vendorInvoiceLineItem = initialState.vendorInvoiceLineItem;
    });
  },
});
export default VendorInvoiceSlice;

export const { addSelectedVendorInvoiceId } = VendorInvoiceSlice.actions;
