import selectLineItemDetailState from "./selectLineItemDetailState";
import { createSelector } from "@reduxjs/toolkit";

const selectClaimId = createSelector([selectLineItemDetailState], (state) => {
  console.log(">>>>>>>", state?.lineItem?.claimId);
  return state?.lineItem?.claimId;
});

export default selectClaimId;
