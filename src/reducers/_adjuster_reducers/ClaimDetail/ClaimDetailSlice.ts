import { unknownObjectType } from "@/constants/customTypes";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { createSlice } from "@reduxjs/toolkit";

export const initialCalimDetailState: unknownObjectType = {
  contents: {},
  policyInfo: {},
  companyDetails: {},
  roomType: [],
  claimParticipantsData: [],
};

const ClaimDetailSlice = createSlice({
  initialState: initialCalimDetailState,
  name: EnumStoreSlice.CLAIM_DETAIL,
  reducers: {
    addContents(state, action) {
      const { payload } = action;
      state.contents = { ...payload };
      return state;
    },
    addPolicyInfo(state, action) {
      const { payload } = action;
      state.policyInfo = { ...state.policyInfo, ...payload };
      return state;
    },
    addCompanyDetails(state, action) {
      const { payload } = action;
      state.companyDetails = { ...state.companyDetails, ...payload };
      return state;
    },
    addRoomType(state, action) {
      const { payload } = action;
      state.roomType = [...payload];
      return state;
    },
    addClaimParticipants(state, action) {
      const { payload } = action;
      state.claimParticipantsData = [...payload];
      return state;
    },
  },
});
export default ClaimDetailSlice;

export const {
  addContents,
  addPolicyInfo,
  addCompanyDetails,
  addRoomType,
  addClaimParticipants,
} = ClaimDetailSlice.actions;
