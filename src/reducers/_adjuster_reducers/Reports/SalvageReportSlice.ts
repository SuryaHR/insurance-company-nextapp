import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getSalvageReportforReport,
  getSalvageStatusforReport,
} from "@/services/_adjuster_services/ReportServices/SlavageReportService";

const initialState = {
  salvageStatuslistfetching: true,
  salvageStatuslist: [],
  salvageReportforReportfetching: true,
  salvageReportforReport: [],
};

export const fetchSalvageStatusListForReport = createAsyncThunk(
  "salvageStatuslist/fetchData",
  async (_, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getSalvageStatusforReport();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSalvageReportforReport = createAsyncThunk(
  "salvageReportforReport/fetchData",
  async (
    payload: {
      reportStartDate: string;
      reportEndDate: string;
      orderBy: any;
      keyword: string;
      salvageStatus: any;
      ownerRetained: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getSalvageReportforReport(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const SalvageReportSlice = createSlice({
  initialState,
  name: "salvageReportSlice",
  reducers: {},
  extraReducers(builder) {
    // Status List
    builder.addCase(fetchSalvageStatusListForReport.pending, (state) => {
      state.salvageStatuslistfetching = true;
      state.salvageStatuslist = [];
    });
    builder.addCase(fetchSalvageStatusListForReport.fulfilled, (state, action) => {
      const payload = action.payload;
      state.salvageStatuslistfetching = false;
      if (payload && payload?.status === 200) {
        state.salvageStatuslist = payload?.data;
      }
    });
    builder.addCase(fetchSalvageStatusListForReport.rejected, (state) => {
      state.salvageStatuslistfetching = false;
      state.salvageStatuslist = initialState.salvageStatuslist;
    });
    builder.addCase(fetchSalvageReportforReport.pending, (state) => {
      state.salvageReportforReportfetching = true;
      state.salvageReportforReport = [];
    });
    builder.addCase(fetchSalvageReportforReport.fulfilled, (state, action) => {
      const payload = action.payload;
      state.salvageReportforReportfetching = false;
      if (payload && payload?.status === 200) {
        state.salvageReportforReport = payload?.data;
      }
    });
    builder.addCase(fetchSalvageReportforReport.rejected, (state) => {
      state.salvageReportforReportfetching = false;
      state.salvageReportforReport = initialState.salvageReportforReport;
    });
  },
});
export default SalvageReportSlice;
