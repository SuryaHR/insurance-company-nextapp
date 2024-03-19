import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectAcceptedStandardCost = createSelector(
  [selectLineItemDetailState],
  (state) => {
    return state?.acceptedStandardCost;
  }
);

export default selectAcceptedStandardCost;
