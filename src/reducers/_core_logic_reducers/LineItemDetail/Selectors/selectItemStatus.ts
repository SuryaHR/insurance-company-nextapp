import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectItemStatus = createSelector([selectLineItemDetailState], (state) => {
  const { status } = state.lineItem;
  return status;
});

export default selectItemStatus;
