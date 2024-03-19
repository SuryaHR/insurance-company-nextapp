import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectItemTaxDetail = createSelector([selectLineItemDetailState], (state) => {
  const { taxRate = 0, applyTax = false } = state.lineItem;
  return { taxRate, applyTax };
});

export default selectItemTaxDetail;
