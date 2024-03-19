import { createSelector } from "@reduxjs/toolkit";
import selectCommonDataState from "./selectCommonDataState";

const selectPolicyHolderTypeParticipant = createSelector(
  [selectCommonDataState],
  (commonData) => {
    const filteredPartcipant = commonData?.participants.find((participant: any) => {
      if (participant?.participantType?.id === 5) {
        return participant;
      }
    });
    return filteredPartcipant;
  }
);
export default selectPolicyHolderTypeParticipant;
