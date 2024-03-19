import { createSelector } from "@reduxjs/toolkit";
import selectCommonDataState from "./selectCommonDataState";

const selectParticipants = createSelector(
  [selectCommonDataState],
  (commonData) => commonData?.participants
);

export default selectParticipants;
