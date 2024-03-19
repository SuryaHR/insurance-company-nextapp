import { createSelector } from "@reduxjs/toolkit";
import selectAdjusterDashboardState from "./selectAdjusterDashboardState";

const selectScoreCardData = createSelector(
  [selectAdjusterDashboardState],
  (adjusterDashboard) => adjusterDashboard?.scoreCard
);

export default selectScoreCardData;
