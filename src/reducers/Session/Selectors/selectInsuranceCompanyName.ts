import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectInsuranceCompanyName = createSelector(
  [selectSessionState],
  (session) => session?.insuranceCompanyName
);
export default selectInsuranceCompanyName;
