import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "./selectSessionState";

const selectReferer = createSelector([selectSessionState], (state) => {
  return state.referer;
});
export default selectReferer;
