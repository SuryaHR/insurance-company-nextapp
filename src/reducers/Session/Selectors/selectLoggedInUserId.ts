import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectLoggedInUserId = createSelector(
  [selectSessionState],
  (session) => session?.userId
);

export default selectLoggedInUserId;
