import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectSessionClaimId = createSelector(
  [selectSessionState],
  (session) => session?.claimId
);

export default selectSessionClaimId;
