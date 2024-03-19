import { createSelector } from "@reduxjs/toolkit";
import selectGlobalSearchState from "./selectGlobalSearchState";

const selectProfile = createSelector(
  [selectGlobalSearchState],
  (state) => state.selectedProfile
);

export default selectProfile;
