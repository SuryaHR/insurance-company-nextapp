import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectAccessToken = createSelector(
  [selectSessionState],
  (session) => session?.token
);

export default selectAccessToken;
