import { createSelector } from "@reduxjs/toolkit";
import selectCommonDataState from "./selectCommonDataState";
import selectLoggedInUserEmail from "@/reducers/Session/Selectors/selectLoggedInUserEmail";

const selectNonLoggedInParticipants = createSelector(
  [selectCommonDataState, selectLoggedInUserEmail],
  (commonData, loggedInUserEmailId) => {
    const filteredPArtcipants = commonData?.participants.filter((participant: any) => {
      if (participant.emailId !== loggedInUserEmailId) {
        return participant;
      }
    });
    return filteredPArtcipants;
  }
);

export default selectNonLoggedInParticipants;
