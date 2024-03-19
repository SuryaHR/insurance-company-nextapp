import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectLineItem = createSelector([selectLineItemDetailState], (state) => {
  return state.lineItem;
});

export default selectLineItem;
