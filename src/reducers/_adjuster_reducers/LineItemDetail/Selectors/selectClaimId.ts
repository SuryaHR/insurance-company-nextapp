import selectLineItemDetailState from "./selectLineItemDetailState";
import { createSelector } from "@reduxjs/toolkit";

const selectClaimId = createSelector([selectLineItemDetailState], (state) => {
  return state?.lineItem?.claimId;
});

export default selectClaimId;
