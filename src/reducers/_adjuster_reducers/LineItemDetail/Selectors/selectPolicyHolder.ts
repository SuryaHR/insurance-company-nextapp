import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

export const selectPolicyHolder = createSelector([selectLineItemDetailState], (state) => {
  return state.policyHolder?.policyHolder;
});
