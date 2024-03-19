import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  claimServiceRequestList: [],
  claimServiceRequestListTotalData: [],
  claimErrorMsg: "",
  totalClaims: 0,
  searchKeyword: null,
};

const ClaimServiceRequestSlice = createSlice({
  initialState,
  name: "claimServiceRequestdata",
  reducers: {
    addserviceRequestData(state, action) {
      const { payload } = action;
      const { claimServiceRequestList } = payload;

      let newArr = {};
      const claimRes: any = [];
      if (claimServiceRequestList?.data) {
        claimServiceRequestList.data.map((item: any) => {
          if (!item.isDelete) {
            newArr = {
              description: item.description,
              serviceNumber: item.serviceNumber,
              vendorDetails: item.vendorDetails,
              assignedDate: item.assignedDate,
              targetDate: item.targetDate,
              status: item.status,
              serviceRequestId: item.serviceRequestId,
              claimNumber: item.claimNumber,
            };
            claimRes.push(newArr);
          }
        });
        state.claimServiceRequestList = claimRes.slice(0, 5);
        state.claimServiceRequestListTotalData = claimRes;

        state.claimErrorMsg = "";
        state.totalClaims = claimRes.length;
      } else {
        state.claimErrorMsg = claimServiceRequestList.message;
      }
    },
    updateServiceRequestVisibleData(state, action) {
      const { payload } = action;
      const { claimServiceRequestList } = payload;

      state.claimServiceRequestList = claimServiceRequestList;
    },
    addServiceSearchKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;

      state.searchKeyword = searchKeyword;
    },
    deleteServiceRequestClaimItem(state, action) {
      const { payload } = action;
      const { newClaimServiceRequestListFull, newClaimServiceRequestList } = payload;

      state.claimServiceRequestListTotalData = newClaimServiceRequestListFull;
      state.claimServiceRequestList = newClaimServiceRequestList;
    },
  },
});
export default ClaimServiceRequestSlice;

export const {
  addserviceRequestData,
  updateServiceRequestVisibleData,
  addServiceSearchKeyWord,
  deleteServiceRequestClaimItem,
} = ClaimServiceRequestSlice.actions;
