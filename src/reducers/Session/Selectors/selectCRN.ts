import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectCRN = createSelector([selectSessionState], (session) => session?.CRN);

export default selectCRN;
