import { createSelector } from "@reduxjs/toolkit";
import selectGlobalSearchState from "./selectGlobalSearchState";

const selectIsGlobalSearchFetching = createSelector(
  [selectGlobalSearchState],
  (state) => state.isFetching
);

export default selectIsGlobalSearchFetching;
