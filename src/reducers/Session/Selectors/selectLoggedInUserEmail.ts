import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectLoggedInUserEmail = createSelector(
  [selectSessionState],
  (session) => session?.userName
);

export default selectLoggedInUserEmail;
