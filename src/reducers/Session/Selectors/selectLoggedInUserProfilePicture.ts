import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectLoggedInUserProfilePicture = createSelector(
  [selectSessionState],
  (session) => session?.profilePicture
);

export default selectLoggedInUserProfilePicture;
