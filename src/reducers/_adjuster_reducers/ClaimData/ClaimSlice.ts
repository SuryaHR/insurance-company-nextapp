import {
  fetchClaimListClient,
  getStatusList,
} from "@/services/_adjuster_services/ClaimService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  claimListData: [],
  allclaimListDatafetching: false,
  currentPageNumber: 1,
  totalClaims: 0,
  searchKeyword: "",
  statusIds: null,
  claimErrorMsg: "",
  claimId: null,
  searchDocumentKeyword: "",
  statusListfetching: false,
  statusList: [],
  allclaimListData: [],
  allcurrentPageNumber: 1,
  alltotalClaims: 0,
};

export const fetchClaimListDataAction = createAsyncThunk(
  "claimListData/fetchData",
  async (params: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await fetchClaimListClient(params);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchStatusList = createAsyncThunk(
  "claimListData/statuslist",
  async (_: any, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getStatusList();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const ClaimSlice = createSlice({
  initialState,
  name: "claimdata",
  reducers: {
    addClaimListData(state, action) {
      const { payload } = action;
      const { claimData } = payload;

      let newArr = {};
      const claimRes: any = [];
      if (claimData?.data) {
        claimData.data.claims.map((item: any) => {
          newArr = {
            claimNumber: item.claimNumber,
            status: item.status.status,
            noOfItems: item.noOfItems,
            noOfItemsPriced: item.noOfItemsPriced,
            policyHoldersName:
              item.insuredDetails.lastName + ", " + item.insuredDetails.firstName,
            claimDate: item.createDate,
            lastActive: item.lastActivity,
            lastUpdated: item.lastUpdateDate,
            statusNumber: item.status.id,
            claimId: item.claimId,
            policyNumber: item.policyNumber,
          };
          claimRes.push(newArr);
        });
        state.claimListData = claimRes;
        state.currentPageNumber = claimData.data.currentPageNumber;
        state.totalClaims = claimData.data.totalClaims;
        state.claimErrorMsg = "";
      } else {
        state.claimErrorMsg = claimData.message;
      }
    },
    addSearchKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;

      state.searchKeyword = searchKeyword;
    },
    addFilterValues(state, action) {
      const { payload } = action;
      const { statusIds } = payload;

      state.statusIds = statusIds;
    },
    addSelectedClaimId(state, action) {
      const { payload } = action;
      const { claimId } = payload;

      state.claimId = claimId;
    },
    addDocSearchKeyWord(state, action) {
      const { payload } = action;
      const { searchDocumentKeyword } = payload;
      state.searchDocumentKeyword = searchDocumentKeyword;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchClaimListDataAction.pending, (state) => {
      state.allclaimListDatafetching = true;
      state.allclaimListData = [];
    });
    builder.addCase(fetchClaimListDataAction.fulfilled, (state, action) => {
      const payload = action.payload;
      state.allclaimListDatafetching = false;
      if (payload?.status === 200) {
        state.allclaimListData = payload?.data?.claims;
        state.allcurrentPageNumber = payload?.data?.currentPageNumber;
        state.alltotalClaims = payload?.data?.totalClaims;
      }
    });
    builder.addCase(fetchClaimListDataAction.rejected, (state) => {
      state.allclaimListDatafetching = false;
      state.allclaimListData = initialState.allclaimListData;
    });
    // fetchStatusList
    builder.addCase(fetchStatusList.pending, (state) => {
      state.statusListfetching = true;
      state.statusList = [];
    });
    builder.addCase(fetchStatusList.fulfilled, (state, action) => {
      const payload = action.payload;
      state.statusListfetching = false;
      if (payload?.status === 200) {
        state.statusList = payload?.data;
      }
    });
    builder.addCase(fetchStatusList.rejected, (state) => {
      state.statusListfetching = false;
      state.statusList = initialState.statusList;
    });
  },
});
export default ClaimSlice;

export const {
  addClaimListData,
  addSearchKeyWord,
  addFilterValues,
  addSelectedClaimId,
  addDocSearchKeyWord,
} = ClaimSlice.actions;
