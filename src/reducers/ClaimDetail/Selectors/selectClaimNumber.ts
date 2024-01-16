import { createSelector } from "@reduxjs/toolkit";
import selectClaimDetailState from "./selectClaimDetailState";

const selectClaimNumber = createSelector(
  [selectClaimDetailState],
  (claimDetail) => claimDetail?.contents?.claimNumber
);

export default selectClaimNumber;
