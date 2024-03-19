import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getVendorPayments,
  getVendorPaymentsRegVendors,
  getVendorPaymentsStatus,
} from "@/services/_adjuster_services/VendorInvoicePayments/VendorPaymentsService";

const initialState = {
  vendorPayments: [],
  vendorPaymentsfetching: true,
  vendorPaymentsStatus: [],
  vendorPaymentsStatusfetching: true,
  vendorPaymentsRegVendors: [],
  vendorPaymentsRegVendorsfetching: true,
};

export const fetchVendorPayments = createAsyncThunk(
  "vendorPayments/fetchData",
  async (payload: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorPayments(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorPaymentsStatus = createAsyncThunk(
  "vendorPaymentsStatus/fetchData",
  async (_: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorPaymentsStatus();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorPaymentsRegVendors = createAsyncThunk(
  "vendorPaymentsRegVendors/fetchData",
  async (payload: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorPaymentsRegVendors();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const VendorPaymentsSlice = createSlice({
  initialState,
  name: "vendorPaymentsSlice",
  reducers: {},
  extraReducers(builder) {
    // VendorPayments
    builder.addCase(fetchVendorPayments.pending, (state) => {
      state.vendorPaymentsfetching = true;
      state.vendorPayments = [];
    });
    builder.addCase(fetchVendorPayments.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorPaymentsfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorPayments = payload?.data;
      }
    });
    builder.addCase(fetchVendorPayments.rejected, (state) => {
      state.vendorPaymentsfetching = false;
      state.vendorPayments = initialState.vendorPayments;
    });
    // VendorPaymentsStatus
    builder.addCase(fetchVendorPaymentsStatus.pending, (state) => {
      state.vendorPaymentsStatusfetching = true;
      state.vendorPaymentsStatus = [];
    });
    builder.addCase(fetchVendorPaymentsStatus.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorPaymentsStatusfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorPaymentsStatus = payload?.data;
      }
    });
    builder.addCase(fetchVendorPaymentsStatus.rejected, (state) => {
      state.vendorPaymentsStatusfetching = false;
      state.vendorPaymentsStatus = initialState.vendorPaymentsStatus;
    });
    // VendorPaymentsRegVendors
    builder.addCase(fetchVendorPaymentsRegVendors.pending, (state) => {
      state.vendorPaymentsRegVendorsfetching = true;
      state.vendorPaymentsRegVendors = [];
    });
    builder.addCase(fetchVendorPaymentsRegVendors.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorPaymentsRegVendorsfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorPaymentsRegVendors = payload?.data;
      }
    });
    builder.addCase(fetchVendorPaymentsRegVendors.rejected, (state) => {
      state.vendorPaymentsRegVendorsfetching = false;
      state.vendorPaymentsRegVendors = initialState.vendorPaymentsRegVendors;
    });
  },
});
export default VendorPaymentsSlice;
