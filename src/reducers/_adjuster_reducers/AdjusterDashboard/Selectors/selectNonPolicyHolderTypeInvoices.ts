import { createSelector } from "@reduxjs/toolkit";
import selectAdjusterDashboardState from "./selectAdjusterDashboardState";

const selectNonPolicyHolderTypeInvoices = createSelector(
  [selectAdjusterDashboardState],
  (adjusterDashboard) => {
    const filteredInvoices =
      adjusterDashboard?.pendingVendorInvoices?.invoiceBaseDTOS?.filter(
        (invoiceObj: any) => {
          if (invoiceObj.invoiceType !== "PolicyHolder") {
            return invoiceObj;
          }
        }
      );
    return filteredInvoices;
  }
);

export default selectNonPolicyHolderTypeInvoices;
