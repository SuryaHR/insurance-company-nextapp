import { createSelector } from "@reduxjs/toolkit";
import selectCommonDataState from "./selectCommonDataState";

const selectClaimSupervisorParticipants = createSelector(
  [selectCommonDataState],
  (commonData) => {
    const filteredPArtcipants = commonData?.participants.filter((participant: any) => {
      if (participant?.role == "CLAIM SUPERVISOR") {
        return participant;
      }
    });
    return filteredPArtcipants;
  }
);
export default selectClaimSupervisorParticipants;
