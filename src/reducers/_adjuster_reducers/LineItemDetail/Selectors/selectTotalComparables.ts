import selectLineItemDetailState from "./selectLineItemDetailState";
import { createSelector } from "@reduxjs/toolkit";

const selectTotalComparables = createSelector([selectLineItemDetailState], (state) => {
  let comparables: any[] = [];
  if (state.comparableItems && state.comparableItems.length) {
    comparables = [...comparables, ...state.comparableItems];
  }
  if (state.replacementItem) {
    comparables.push(state.replacementItem);
  }
  return comparables;
});

export default selectTotalComparables;
