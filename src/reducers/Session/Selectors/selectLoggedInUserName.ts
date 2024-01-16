import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectLoggedInUserName = createSelector(
  [selectSessionState],
  (session) => session?.name
);

export default selectLoggedInUserName;
