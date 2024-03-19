import selectLineItemDetailState from "./selectLineItemDetailState";
import { createSelector } from "@reduxjs/toolkit";

const selectItemCategory = createSelector([selectLineItemDetailState], (state) => {
  const categoryList = {
    category: state?.lineItem?.category,
    subCategory: state?.lineItem?.subCategory,
  };
  return categoryList;
});

export default selectItemCategory;
