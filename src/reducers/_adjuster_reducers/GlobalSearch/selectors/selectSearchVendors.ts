import { createSelector } from "@reduxjs/toolkit";
import selectGlobalSearchState from "./selectGlobalSearchState";

export default createSelector([selectGlobalSearchState], (state) => {
  return state.data.vendors ?? [];
});
