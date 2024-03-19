import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectReplacementItem = createSelector(
  [selectLineItemDetailState],
  (lineItemDetail) => lineItemDetail?.replacementItem
);

export default selectReplacementItem;
