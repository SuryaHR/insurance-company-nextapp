import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getAdjusterByCompanyIdServ,
  updateReassignAdjusterServ,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";

const initialState = {
  adjusterListByCompanyItemsfetching: true,
  adjusterListByCompanyItemsData: [],
  reassignAdjusterfetching: true,
  reassignAdjusterData: [],
  searchKeyword: "",
  searchAdjusterKeyword: "",
};

export const getAdjusterByCompanyIdRdcr = createAsyncThunk(
  "adjusterListByCompany/fetchData",
  async (
    payload: {
      companyId: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getAdjusterByCompanyIdServ(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateReassignAdjusterRdcr = createAsyncThunk(
  "reassignAdjuster/fetchData",
  async (
    payload: {
      assignedUserId: number;
      claimId: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await updateReassignAdjusterServ(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const ClaimDetailsBtnSlice = createSlice({
  initialState,
  name: "ClaimDetailsBtn",
  reducers: {
    addReassignSearchKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;
      state.searchKeyword = searchKeyword;
    },
    addAdjusterSearchKeyWord(state, action) {
      const { payload } = action;
      const { searchAdjusterKeyword } = payload;
      state.searchAdjusterKeyword = searchAdjusterKeyword;
    },
  },
  extraReducers(builder) {
    // Items
    builder.addCase(getAdjusterByCompanyIdRdcr.pending, (state) => {
      state.adjusterListByCompanyItemsfetching = true;
      state.adjusterListByCompanyItemsData = [];
    });
    builder.addCase(getAdjusterByCompanyIdRdcr.fulfilled, (state, action) => {
      const payload = action.payload;
      state.adjusterListByCompanyItemsfetching = false;
      if (payload && payload?.status === 200) {
        state.adjusterListByCompanyItemsData = payload?.data;
      }
    });
    builder.addCase(getAdjusterByCompanyIdRdcr.rejected, (state) => {
      state.adjusterListByCompanyItemsfetching = false;
      state.adjusterListByCompanyItemsData = initialState.adjusterListByCompanyItemsData;
    });

    // post reassign
    builder.addCase(updateReassignAdjusterRdcr.pending, (state) => {
      state.reassignAdjusterfetching = true;
      state.reassignAdjusterData = [];
    });
    builder.addCase(updateReassignAdjusterRdcr.fulfilled, (state, action) => {
      const payload = action.payload;
      state.reassignAdjusterfetching = false;
      if (payload && payload?.status === 200) {
        state.reassignAdjusterData = payload;
      } else {
        state.reassignAdjusterData = payload;
      }
    });
    builder.addCase(updateReassignAdjusterRdcr.rejected, (state) => {
      state.reassignAdjusterfetching = false;
      state.reassignAdjusterData = initialState.reassignAdjusterData;
    });
  },
});
export default ClaimDetailsBtnSlice;

export const { addReassignSearchKeyWord, addAdjusterSearchKeyWord } =
  ClaimDetailsBtnSlice.actions;
