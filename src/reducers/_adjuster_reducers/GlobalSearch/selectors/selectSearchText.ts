import { createSelector } from "@reduxjs/toolkit";
import selectGlobalSearchState from "./selectGlobalSearchState";

const selectSearchText = createSelector(
  [selectGlobalSearchState],
  (state) => state.searchString ?? ""
);

export default selectSearchText;
