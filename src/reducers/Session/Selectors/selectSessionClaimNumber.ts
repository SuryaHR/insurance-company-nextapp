import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectSessionClaimNumber = createSelector(
  [selectSessionState],
  (session) => session?.claimNumber
);

export default selectSessionClaimNumber;
