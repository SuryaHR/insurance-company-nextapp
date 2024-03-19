import { createSelector } from "@reduxjs/toolkit";
import selectAdjusterDashboardState from "./selectAdjusterDashboardState";

const selectImmidiateClaimData = createSelector(
  [selectAdjusterDashboardState],
  (adjusterDashboard) => adjusterDashboard?.immidiateClaim
);

export default selectImmidiateClaimData;
