import { createSelector } from "@reduxjs/toolkit";
import selectCommonDataState from "./selectCommonDataState";

const selectSubCategories = createSelector(
  [selectCommonDataState],
  (commonData) => commonData?.subCategory
);

export default selectSubCategories;
