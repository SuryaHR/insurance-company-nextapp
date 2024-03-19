import { createSelector } from "@reduxjs/toolkit";
import selectLineItem from "./selectLineItem";

const selectSelectedSubCategory = createSelector([selectLineItem], (lineItem) => {
  const category = lineItem?.subCategory;
  return category;
});

export default selectSelectedSubCategory;
