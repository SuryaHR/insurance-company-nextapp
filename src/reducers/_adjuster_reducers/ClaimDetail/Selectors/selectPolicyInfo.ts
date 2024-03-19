import { createSelector } from "@reduxjs/toolkit";
import selectClaimDetailState from "./selectClaimDetailState";

const selectPolicyInfo = createSelector(
  [selectClaimDetailState],
  (claimDetail) => claimDetail?.policyInfo
);

export default selectPolicyInfo;
