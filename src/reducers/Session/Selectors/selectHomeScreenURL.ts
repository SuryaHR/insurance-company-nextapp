import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectRootStateURL = createSelector(
  [selectSessionState],
  (session) => session?.homeScreen
);

export default selectRootStateURL;
