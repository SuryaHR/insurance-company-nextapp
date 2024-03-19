import { createSelector } from "@reduxjs/toolkit";
import selectClaimDetailState from "./selectClaimDetailState";

const selectClaimStatus = createSelector(
  [selectClaimDetailState],
  (claimDetail) => claimDetail?.contents?.claimStatus
);

export default selectClaimStatus;
