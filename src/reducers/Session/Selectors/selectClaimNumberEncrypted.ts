import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectClaimNumberEncrypted = createSelector(
  [selectSessionState],
  (session) => session?.claimNumberEncrypted
);

export default selectClaimNumberEncrypted;
