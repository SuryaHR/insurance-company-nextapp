import { createSelector } from "@reduxjs/toolkit";
import selectClaimDetailState from "./selectClaimDetailState";

const selectPolicyNumber = createSelector(
  [selectClaimDetailState],
  (claimDetail) => claimDetail?.policyInfo?.policyNumber
);

export default selectPolicyNumber;
