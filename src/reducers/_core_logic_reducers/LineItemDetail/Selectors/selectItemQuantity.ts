import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectItemQuantity = createSelector([selectLineItemDetailState], (state) => {
  const { ItemQuantity = 1 } = state.lineItem;
  return ItemQuantity;
});

export default selectItemQuantity;
