import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectSubCategory = createSelector([selectLineItemDetailState], (state) => {
  return state?.subCategory;
});

export default selectSubCategory;
