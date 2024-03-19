import { unknownObjectType } from "@/constants/customTypes";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { createSlice } from "@reduxjs/toolkit";

export const initialAdjusterDashboardState: unknownObjectType = {
  scoreCard: {},
  immidiateClaim: {},
  pendingVendorInvoices: {},
};

const AdjusterDashboardSlice = createSlice({
  initialState: initialAdjusterDashboardState,
  name: EnumStoreSlice.ADJUSTER_DASHBOARD,
  reducers: {
    addScoreCardData(state, action) {
      const { payload } = action;
      state.scoreCard = { ...payload };
      return state;
    },
    addImmidiateClaimData(state, action) {
      const { payload } = action;
      state.immidiateClaim = { ...payload };
      return state;
    },
    addPendingVendorInvoiceData(state, action) {
      const { payload } = action;

      state.pendingVendorInvoices = { ...payload };
      return state;
    },
  },
});
export default AdjusterDashboardSlice;

export const {
  addScoreCardData,
  addImmidiateClaimData,
  addPendingVendorInvoiceData,
  // addPolicyInfo,
  // addCompanyDetails,
  // addRoomType,
  // addClaimParticipants,
} = AdjusterDashboardSlice.actions;
