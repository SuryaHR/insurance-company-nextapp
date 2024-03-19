import { createSelector } from "@reduxjs/toolkit";
import selectCommonDataState from "./selectCommonDataState";

const selectCategories = createSelector(
  [selectCommonDataState],
  (commonData) => commonData?.category
);

export default selectCategories;
