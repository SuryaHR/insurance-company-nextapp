import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getAllPolicyTypeForReports,
  getClaimsforReport,
  getStatusListForReport,
} from "@/services/_adjuster_services/ReportServices/ClaimReportService";

const initialState = {
  statusListForReportfetching: true,
  statusListForReport: [],
  policyListForReportfetching: true,
  policyListForReport: [],
  claimsforReportfetching: true,
  claimsforReport: [],
};

export const fetchStatusListForReport = createAsyncThunk(
  "statuslist/fetchData",
  async (_: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getStatusListForReport();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllPolicyTypeForReport = createAsyncThunk(
  "policyList/fetchData",
  async (_: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getAllPolicyTypeForReports();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchClaimsforReport = createAsyncThunk(
  "claimsforReportList/fetchData",
  async (payload: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getClaimsforReport(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const ClaimsReportSlice = createSlice({
  initialState,
  name: "claimsReportSlice",
  reducers: {},
  extraReducers(builder) {
    // Status List
    builder.addCase(fetchStatusListForReport.pending, (state) => {
      state.statusListForReportfetching = true;
      state.statusListForReport = [];
    });
    builder.addCase(fetchStatusListForReport.fulfilled, (state, action) => {
      const payload = action.payload;
      state.statusListForReportfetching = false;
      if (payload && payload?.status === 200) {
        state.statusListForReport = payload?.data;
      }
    });
    builder.addCase(fetchStatusListForReport.rejected, (state) => {
      state.statusListForReportfetching = false;
      state.statusListForReport = initialState.statusListForReport;
    });
    // Policy List
    builder.addCase(fetchAllPolicyTypeForReport.pending, (state) => {
      state.policyListForReportfetching = true;
      state.policyListForReport = [];
    });
    builder.addCase(fetchAllPolicyTypeForReport.fulfilled, (state, action) => {
      const payload = action.payload;
      state.policyListForReportfetching = false;
      if (payload && payload?.status === 200) {
        state.policyListForReport = payload?.data;
      }
    });
    builder.addCase(fetchAllPolicyTypeForReport.rejected, (state) => {
      state.policyListForReportfetching = false;
      state.policyListForReport = initialState.policyListForReport;
    });
    // claimsforReport
    builder.addCase(fetchClaimsforReport.pending, (state) => {
      state.claimsforReportfetching = true;
      state.claimsforReport = [];
    });
    builder.addCase(fetchClaimsforReport.fulfilled, (state, action) => {
      const payload = action.payload;
      state.claimsforReportfetching = false;
      if (payload && payload?.status === 200) {
        state.claimsforReport = payload?.data;
      }
    });
    builder.addCase(fetchClaimsforReport.rejected, (state) => {
      state.claimsforReportfetching = false;
      state.claimsforReport = initialState.claimsforReport;
    });
  },
});
export default ClaimsReportSlice;
