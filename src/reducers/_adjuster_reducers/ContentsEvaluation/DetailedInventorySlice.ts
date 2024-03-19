import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCoverageSummary,
  getDetailedInventory,
  getPolicyHolderPaymentInfo,
  getPolicyholderPayouts,
  getPolicySummary,
  getSubCategories,
} from "@/services/_adjuster_services/ContentsEvaluationService";

const initialState = {
  detailedInventoryListDataFull: [],
  detailedInventoryListAPIData: [],
  detailedInventorySummaryData: [],
  detailedInventoryfetching: true,
  coverageSummaryListDataFull: [],
  claimCategoryDetails: [],
  coverageSummaryfetching: true,
  policyHolderListDataFull: {},
  policyHolderfetching: true,
  policyHolderTablefetching: true,
  policySummaryListDataFull: [],
  policyHolderPaymentInfoData: [],
  policyHolderPaymentInfofetching: true,
  searchKeyword: "",
  subCategoriesfetching: true,
  subCategoriesData: [],
};

export const fetchDetailedInventoryAction = createAsyncThunk(
  "detailedInventory/fetchData",
  async (
    param: {
      pageNo: number;
      recordPerPage: number;
      claimNum: string;
      sortBy: string;
      orderBy: string;
      q: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getDetailedInventory(param, true);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCoverageSummaryAction = createAsyncThunk(
  "coverageSummary/fetchData",
  async (payload: { claimNumber: string }, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getCoverageSummary(payload, true);

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPolicyHolderTableAction = createAsyncThunk(
  "policyholder/fetchData",
  async (payload: { claimNumber: string }, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getPolicyholderPayouts(payload, true);

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPolicySummaryTableAction = createAsyncThunk(
  "policysummary/fetchData",
  async (payload: { claimNumber: string }, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getPolicySummary(payload, true);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPolicyHolderPaymentInfo = createAsyncThunk(
  "Paymentinfo/fetchData",
  async (payload: { paymentInfoId: number }, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getPolicyHolderPaymentInfo(payload, true);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSubCategories = createAsyncThunk(
  "SubCatergories/fetchSubCatergories",
  async (_: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getSubCategories();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const DetailedInventorySlice = createSlice({
  initialState,
  name: "detailedInventorydata",
  reducers: {
    addDetailedInventorySearchKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;
      state.searchKeyword = searchKeyword;
    },
    updateDetailedInventoryListData(state, action) {
      const { payload } = action;
      const { detailedInventoryListData } = payload;
      state.detailedInventoryListDataFull = detailedInventoryListData;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchDetailedInventoryAction.pending, (state) => {
      state.detailedInventoryfetching = true;
      state.detailedInventoryListDataFull = [];
    });
    builder.addCase(fetchDetailedInventoryAction.fulfilled, (state, action) => {
      const payload = action.payload;
      state.detailedInventoryfetching = false;
      if (payload?.status === 200) {
        state.detailedInventorySummaryData = payload?.data?.inventorySummary;
        state.detailedInventoryListDataFull = payload?.data?.claimItemsDetails;
        state.detailedInventoryListAPIData = payload?.data?.claimItemsDetails;
      }
    });
    builder.addCase(fetchDetailedInventoryAction.rejected, (state) => {
      state.detailedInventoryfetching = false;
      state.detailedInventoryListDataFull = initialState.detailedInventoryListDataFull;
    });
    builder.addCase(fetchCoverageSummaryAction.pending, (state) => {
      state.coverageSummaryListDataFull = [];
      state.coverageSummaryfetching = true;
    });
    builder.addCase(fetchCoverageSummaryAction.fulfilled, (state, action) => {
      const payload = action.payload;
      state.coverageSummaryfetching = false;
      if (payload?.status === 200) {
        state.coverageSummaryListDataFull = payload?.data;
        state.claimCategoryDetails = payload?.data?.claimCategoryDetails;
      }
    });
    builder.addCase(fetchCoverageSummaryAction.rejected, (state) => {
      state.coverageSummaryfetching = false;
      state.coverageSummaryListDataFull = initialState.coverageSummaryListDataFull;
    });
    builder.addCase(fetchPolicyHolderTableAction.pending, (state) => {
      state.policyHolderfetching = true;
      state.policyHolderListDataFull = {};
    });
    builder.addCase(fetchPolicyHolderTableAction.fulfilled, (state, action) => {
      state.policyHolderfetching = false;
      const payload = action.payload;
      if (payload?.status === 200) {
        state.policyHolderListDataFull = payload?.data;
      }
    });
    builder.addCase(fetchPolicyHolderTableAction.rejected, (state) => {
      state.policyHolderfetching = false;
      state.policyHolderListDataFull = initialState.policyHolderListDataFull;
    });
    builder.addCase(fetchPolicySummaryTableAction.pending, (state) => {
      state.policyHolderTablefetching = true;
      state.policySummaryListDataFull = [];
    });
    builder.addCase(fetchPolicySummaryTableAction.fulfilled, (state, action) => {
      state.policyHolderTablefetching = false;
      const payload = action.payload;
      if (payload?.status === 200) {
        state.policySummaryListDataFull = payload?.data;
      }
    });
    builder.addCase(fetchPolicySummaryTableAction.rejected, (state) => {
      state.policyHolderTablefetching = false;
      state.policySummaryListDataFull = initialState.policySummaryListDataFull;
    });
    builder.addCase(fetchPolicyHolderPaymentInfo.pending, (state) => {
      state.policyHolderPaymentInfofetching = true;
      state.policyHolderPaymentInfoData = [];
    });
    builder.addCase(fetchPolicyHolderPaymentInfo.fulfilled, (state, action) => {
      state.policyHolderPaymentInfofetching = false;
      const payload = action.payload;
      if (payload?.status === 200) {
        state.policyHolderPaymentInfoData = payload?.data;
      }
    });
    builder.addCase(fetchPolicyHolderPaymentInfo.rejected, (state) => {
      state.policyHolderPaymentInfofetching = false;
      state.policyHolderPaymentInfoData = initialState.policyHolderPaymentInfoData;
    });

    builder.addCase(fetchSubCategories.pending, (state) => {
      state.subCategoriesfetching = true;
      state.subCategoriesData = [];
    });
    builder.addCase(fetchSubCategories.fulfilled, (state, action) => {
      state.subCategoriesfetching = false;
      const payload = action.payload;
      if (payload?.status === 200) {
        state.subCategoriesData = payload?.data;
      }
    });
    builder.addCase(fetchSubCategories.rejected, (state) => {
      state.subCategoriesfetching = false;
      state.subCategoriesData = initialState.subCategoriesData;
    });
  },
});
export default DetailedInventorySlice;

export const { addDetailedInventorySearchKeyWord, updateDetailedInventoryListData } =
  DetailedInventorySlice.actions;
