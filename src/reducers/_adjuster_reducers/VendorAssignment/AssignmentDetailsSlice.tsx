import {
  getContentServices,
  getVendorAssignmentDetails,
  getVendorAssignmentGraphItems,
  getVendorAssignmentItems,
  getVendorAssignmentRating,
  getVendorAssignmentStatusItems,
} from "@/services/_adjuster_services/VendorAssignmentDetailsService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendorAssignmentItemsfetching: true,
  vendorAssignmentItemsData: [],
  searchVendorAssignmentItemsData: [],
  vendorAssignmentDetailsfetching: true,
  vendorAssignmentDetailsData: [],
  vendorAssignmentStatusfetching: true,
  vendorAssignmentStatusData: [],
  vendorAssignmentGraphfetching: true,
  vendorAssignmentGraphData: [],
  searchKeyword: "",
  contentServicesfetching: true,
  contentServicesData: [],
  vendorAssignmentRateFetching: false,
  vendorAssignmentRating: null,
};

export const fetchVendorAssignmentItems = createAsyncThunk(
  "vendorAssignmentItems/fetchData",
  async (
    payload: {
      assignmentNumber: string;
      vrn: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorAssignmentItems(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorAssignmentDetails = createAsyncThunk(
  "vendorAssignmentDetails/fetchData",
  async (
    payload: {
      assignmentNumber: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorAssignmentDetails(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorAssignmentStatusItems = createAsyncThunk(
  "vendorAssignmentStatusItems/fetchData",
  async (
    param: {
      assignmentNumber: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorAssignmentStatusItems(param);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorAssignmentRating = createAsyncThunk(
  "vendorAssignmentRating/fetchData",
  async (
    param: {
      assignmentNumber: string;
      assignmentRating: number;
      assignmentRatingComment: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorAssignmentRating(param);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorAssignmentGraphItems = createAsyncThunk(
  "vendorAssignmentGraphItems/fetchData",
  async (
    param: {
      assignmentNumber: string;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getVendorAssignmentGraphItems(param);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchContentServices = createAsyncThunk(
  "contentServices/fetchData",
  async (_: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getContentServices();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const AssignmentDetailsSlice = createSlice({
  initialState,
  name: "assignmentDetailsData",
  reducers: {
    addAssignmentDetailsSearchKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;

      state.searchKeyword = searchKeyword;
    },
    updateVendorAssignmentListData(state, action) {
      const { payload } = action;
      const { vendorAssignmentItemsData } = payload;
      state.searchVendorAssignmentItemsData = vendorAssignmentItemsData;
    },
  },
  extraReducers(builder) {
    // Items
    builder.addCase(fetchVendorAssignmentItems.pending, (state) => {
      state.vendorAssignmentItemsfetching = true;
      state.vendorAssignmentItemsData = [];
    });
    builder.addCase(fetchVendorAssignmentItems.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorAssignmentItemsfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorAssignmentItemsData = payload?.data;
      }
    });
    builder.addCase(fetchVendorAssignmentItems.rejected, (state) => {
      state.vendorAssignmentItemsfetching = false;
      state.vendorAssignmentItemsData = initialState.vendorAssignmentItemsData;
    });

    // Details
    builder.addCase(fetchVendorAssignmentDetails.pending, (state) => {
      state.vendorAssignmentDetailsfetching = true;
      state.vendorAssignmentDetailsData = [];
    });
    builder.addCase(fetchVendorAssignmentDetails.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorAssignmentDetailsfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorAssignmentDetailsData = payload?.data;
      }
    });
    builder.addCase(fetchVendorAssignmentDetails.rejected, (state) => {
      state.vendorAssignmentDetailsfetching = false;
      state.vendorAssignmentDetailsData = initialState.vendorAssignmentDetailsData;
    });

    // Status
    builder.addCase(fetchVendorAssignmentStatusItems.pending, (state) => {
      state.vendorAssignmentStatusfetching = true;
      state.vendorAssignmentStatusData = [];
    });
    builder.addCase(fetchVendorAssignmentStatusItems.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorAssignmentStatusfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorAssignmentStatusData = payload?.data;
      }
    });
    builder.addCase(fetchVendorAssignmentStatusItems.rejected, (state) => {
      state.vendorAssignmentStatusfetching = false;
      state.vendorAssignmentStatusData = initialState.vendorAssignmentStatusData;
    });

    // Graph
    builder.addCase(fetchVendorAssignmentGraphItems.pending, (state) => {
      state.vendorAssignmentGraphfetching = true;
      state.vendorAssignmentGraphData = [];
    });
    builder.addCase(fetchVendorAssignmentGraphItems.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorAssignmentGraphfetching = false;
      if (payload && payload?.status === 200) {
        state.vendorAssignmentGraphData = payload?.data;
      }
    });
    builder.addCase(fetchVendorAssignmentGraphItems.rejected, (state) => {
      state.contentServicesfetching = false;
      state.contentServicesData = initialState.contentServicesData;
    });
    // ContentServices
    builder.addCase(fetchContentServices.pending, (state) => {
      state.contentServicesfetching = true;
      state.contentServicesData = [];
    });
    builder.addCase(fetchContentServices.fulfilled, (state, action) => {
      const payload = action.payload;
      state.contentServicesfetching = false;
      if (payload && payload?.status === 200) {
        state.contentServicesData = payload?.data;
      }
    });
    builder.addCase(fetchContentServices.rejected, (state) => {
      state.contentServicesfetching = false;
      state.contentServicesData = initialState.contentServicesData;
    });
    // Rating
    builder.addCase(fetchVendorAssignmentRating.pending, (state) => {
      state.vendorAssignmentRateFetching = true;
      state.vendorAssignmentRating = null;
    });
    builder.addCase(fetchVendorAssignmentRating.fulfilled, (state, action) => {
      const payload = action.payload;
      state.vendorAssignmentRateFetching = false;
      if (payload && payload?.status === 200) {
        state.vendorAssignmentRating = payload?.data;
      }
    });
    builder.addCase(fetchVendorAssignmentRating.rejected, (state) => {
      state.vendorAssignmentRateFetching = false;
      state.vendorAssignmentRating = initialState.vendorAssignmentRating;
    });
  },
});
export default AssignmentDetailsSlice;

export const { addAssignmentDetailsSearchKeyWord, updateVendorAssignmentListData } =
  AssignmentDetailsSlice.actions;
