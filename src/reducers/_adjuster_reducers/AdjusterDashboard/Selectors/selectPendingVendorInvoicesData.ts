import { createSelector } from "@reduxjs/toolkit";
import selectAdjusterDashboardState from "./selectAdjusterDashboardState";

const selectPendingVendorInvoicesData = createSelector(
  [selectAdjusterDashboardState],
  (adjusterDashboard) => adjusterDashboard?.pendingVendorInvoices
);

export default selectPendingVendorInvoicesData;
