import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectCompanyId = createSelector(
  [selectSessionState],
  (session) => session?.companyId
);

export default selectCompanyId;
