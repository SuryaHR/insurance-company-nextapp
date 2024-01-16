import { createSelector } from "@reduxjs/toolkit";
import selectClaimDetailState from "./selectClaimDetailState";

const selectPolicyHolderTypeParticipant = createSelector(
  [selectClaimDetailState],
  (claimDetail) => {
    const filteredPartcipant = claimDetail?.participants.find((participant: any) => {
      if (participant?.participantType?.id === 5) {
        return participant;
      }
    });
    console.log("filteredPartcipants", filteredPartcipant);

    return filteredPartcipant;
  }
);

export default selectPolicyHolderTypeParticipant;
