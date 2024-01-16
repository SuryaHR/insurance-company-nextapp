import { createSelector } from "@reduxjs/toolkit";
import selectClaimDetailState from "./selectClaimDetailState";

const selectParticipants = createSelector(
  [selectClaimDetailState],
  (claimDetail) => claimDetail?.participants
);

export default selectParticipants;
