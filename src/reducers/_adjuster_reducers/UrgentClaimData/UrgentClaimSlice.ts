import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { fetchUrgentClaimList } from "@/services/_adjuster_services/ClaimService";
import { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";

const initialState = {
  urgentClaimListData: [],
  currentPageNumber: 1,
  totalClaims: 0,
  searchKeyword: "",
  claimErrorMsg: "",
  isFetchingUrgentClaim: false,
  sortBy: "createDate",
  orderBy: "desc",
};

export const handleUrgentClaimPagination = createAsyncThunk(
  "urgentClaim/paginate",
  async ({ pageNumber }: { pageNumber: number }, api) => {
    const state = api.getState() as RootState;
    const rejectWithValue = api.rejectWithValue;
    try {
      const userId = state.session.userId;
      const sortBy = state.urgentclaimdata.sortBy;
      const orderBy = state.urgentclaimdata.orderBy;
      const searchKeyword = state.urgentclaimdata.searchKeyword;
      api.dispatch(updateUrgentClaim({ currentPageNumber: pageNumber }));
      const res = await fetchUrgentClaimList(
        {
          userId,
          pageNumber,
          sortBy,
          orderBy,
          searchKeyword,
          limit: PAGINATION_LIMIT_20,
        },
        true
      );
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const handleUrgentClaimSearch = createAsyncThunk(
  "urgentClaim/search",
  async ({ searchKeyword }: { searchKeyword: string }, api) => {
    const rejectWithValue = api.rejectWithValue;
    const state = api.getState() as RootState;
    try {
      const userId = state[EnumStoreSlice.SESSION].userId;
      const sortBy = initialState.sortBy;
      const orderBy = initialState.orderBy;
      const pageNumber = 1;
      api.dispatch(
        updateUrgentClaim({
          searchKeyword,
          sortBy,
          orderBy,
        })
      );
      const res = await fetchUrgentClaimList(
        {
          userId,
          pageNumber,
          sortBy,
          orderBy,
          searchKeyword,
          limit: PAGINATION_LIMIT_20,
        },
        true
      );
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const handleUrgentClaimSort = createAsyncThunk(
  "urgentClaim/sort",
  async ({ id = "createdDate", desc = true }: { id: string; desc: boolean }, api) => {
    const rejectWithValue = api.rejectWithValue;
    const state = api.getState() as RootState;
    try {
      const sortBy = id;
      const orderBy = desc ? "desc" : "asc";
      const userId = state.session.userId;
      const pageNumber = 1;
      const searchKeyword = state.urgentclaimdata.searchKeyword;
      const limit = PAGINATION_LIMIT_20;
      api.dispatch(
        updateUrgentClaim({
          searchKeyword,
          sortBy,
          orderBy,
          currentPageNumber: pageNumber,
        })
      );
      const res = await fetchUrgentClaimList(
        {
          userId,
          pageNumber,
          sortBy,
          orderBy,
          searchKeyword,
          limit,
        },
        true
      );
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const UrgentClaimSlice = createSlice({
  initialState,
  name: "urgentclaimdata",
  reducers: {
    addUrgentClaimListData(state, action) {
      const { payload } = action;
      const { data, message } = payload;
      if (!data) {
        state.urgentClaimListData = initialState.urgentClaimListData;
        state.claimErrorMsg = message;
        state.currentPageNumber = initialState.currentPageNumber;
        state.totalClaims = initialState.totalClaims;
      } else {
        state.urgentClaimListData = data.claims;
        state.currentPageNumber = data.currentPageNumber;
        state.totalClaims = data.totalClaims;
        state.claimErrorMsg = initialState.claimErrorMsg;
      }
      return state;
    },
    updateUrgentClaim(state, action) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(handleUrgentClaimPagination.pending, (state) => {
      state.isFetchingUrgentClaim = true;
    });
    builder.addCase(handleUrgentClaimPagination.fulfilled, (state, action) => {
      state.isFetchingUrgentClaim = false;
      UrgentClaimSlice.caseReducers.addUrgentClaimListData(state, action);
    });
    builder.addCase(handleUrgentClaimPagination.rejected, (state) => {
      state.isFetchingUrgentClaim = false;
    });
    builder.addCase(handleUrgentClaimSearch.pending, (state) => {
      state.isFetchingUrgentClaim = true;
    });
    builder.addCase(handleUrgentClaimSearch.fulfilled, (state, action) => {
      state.isFetchingUrgentClaim = false;
      UrgentClaimSlice.caseReducers.addUrgentClaimListData(state, action);
    });
    builder.addCase(handleUrgentClaimSearch.rejected, (state) => {
      state.isFetchingUrgentClaim = false;
    });
    builder.addCase(handleUrgentClaimSort.pending, (state) => {
      state.isFetchingUrgentClaim = true;
    });
    builder.addCase(handleUrgentClaimSort.fulfilled, (state, action) => {
      state.isFetchingUrgentClaim = false;
      UrgentClaimSlice.caseReducers.addUrgentClaimListData(state, action);
    });
    builder.addCase(handleUrgentClaimSort.rejected, (state) => {
      state.isFetchingUrgentClaim = false;
    });
  },
});
export default UrgentClaimSlice;

export const { addUrgentClaimListData, updateUrgentClaim } = UrgentClaimSlice.actions;

export const isFetchingUrgentClaimSelector = (state: RootState) =>
  state.urgentclaimdata.isFetchingUrgentClaim;
