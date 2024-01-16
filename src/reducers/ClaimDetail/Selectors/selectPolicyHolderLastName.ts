import { createSelector } from "@reduxjs/toolkit";
import selectClaimDetailState from "./selectClaimDetailState";

const selectPolicyHolderLastName = createSelector(
  [selectClaimDetailState],
  (claimDetail) => claimDetail?.contents?.policyholder?.lastName
);

export default selectPolicyHolderLastName;
