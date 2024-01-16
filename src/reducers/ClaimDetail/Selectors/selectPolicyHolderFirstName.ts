import { createSelector } from "@reduxjs/toolkit";
import selectClaimDetailState from "./selectClaimDetailState";

const selectPolicyHolderFirstName = createSelector(
  [selectClaimDetailState],
  (claimDetail) => claimDetail?.contents?.policyholder?.firstName
);

export default selectPolicyHolderFirstName;
