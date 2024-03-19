import { createSelector } from "@reduxjs/toolkit";
import selectSessionState from "@/reducers/Session/Selectors/selectSessionState";

const selectSessionTaxRate = createSelector(
  [selectSessionState],
  (session) => session?.taxRate
);

export default selectSessionTaxRate;
