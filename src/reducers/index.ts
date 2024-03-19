import { combineReducers } from "@reduxjs/toolkit";
import SessionSlice from "./Session/SessionSlice";
import AdjusterDashboardSlice from "./_adjuster_reducers/AdjusterDashboard/AdjusterDashboardSlice";
import ClaimSlice from "./_adjuster_reducers/ClaimData/ClaimSlice";
import UrgentClaimSlice from "./_adjuster_reducers/UrgentClaimData/UrgentClaimSlice";
import NotificationSlice from "./_adjuster_reducers/Notification/NotificationSlice";
import DashboardAlertSlice from "./_adjuster_reducers/DashboardAlert/DashboardAlertSlice";
import PendingInvoiceSlice from "./_adjuster_reducers/PendingInvoice/PendingInvoiceSlice";
import AllNotesSlice from "./_adjuster_reducers/AllNotes/AllNotesSlice";
import ClaimContentSlice from "./_adjuster_reducers/ClaimData/ClaimContentSlice";
import ClaimDetailsBtnSlice from "./_adjuster_reducers/ClaimData/ClaimDetailsBtnSlice";
import ClaimServiceRequestSlice from "./_adjuster_reducers/ClaimData/ClaimServiceRequestSlice";
import ClaimDetailSlice from "./_adjuster_reducers/ClaimDetail/ClaimDetailSlice";
import CommonDataSlice from "./_adjuster_reducers/CommonData/CommonDataSlice";
import DetailedInventorySlice from "./_adjuster_reducers/ContentsEvaluation/DetailedInventorySlice";
import GlobalSearchSlice from "./_adjuster_reducers/GlobalSearch/GlobalSearchSlice";
import LineItemDetailSlice from "./_adjuster_reducers/LineItemDetail/LineItemDetailSlice";
import ClaimedItemsSlice from "./_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import ReceiptMapperSlice from "./_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import ClaimsReportSlice from "./_adjuster_reducers/Reports/ClaimsReportSlice";
import SalvageReportSlice from "./_adjuster_reducers/Reports/SalvageReportSlice";
import AddItemsTableCSVSlice from "./_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import ExcelCsvUploadSlice from "./_adjuster_reducers/UploadCSV/excelCsvUploadSlice";
import NavigationSlice from "./_adjuster_reducers/UploadCSV/navigationSlice";
import AssignmentDetailsSlice from "./_adjuster_reducers/VendorAssignment/AssignmentDetailsSlice";
import VendorInvoiceSlice from "./_adjuster_reducers/VendorInvoicePayments/VendorInvoiceSlice";
import VendorPaymentsSlice from "./_adjuster_reducers/VendorInvoicePayments/VendorPaymentsSlice";
import UsersSlice from "./_ins_admin_reducers/UsersSlice";
// import AdjusterDashboardSlice from "./AdjusterDashboard/AdjusterDashboardSlice";
import InvoicesVendorSlice from "./_claim_supervisor_reducers/VendorInvoices/InvoicesVendorSlice";
import MyTeamSlice from "./_claim_supervisor_reducers/MyTeam/MyTeamSlice";
import BranchSlice from "./_ins_admin_reducers/BranchSlice";
import companySlice from "./_ins_admin_reducers/companySlice";

const adminReducers = {
  [companySlice.name]: companySlice.reducer,
};

const rootReducer = combineReducers({
  [SessionSlice.name]: SessionSlice.reducer,
  [AdjusterDashboardSlice.name]: AdjusterDashboardSlice.reducer,
  [ClaimSlice.name]: ClaimSlice.reducer,
  [UrgentClaimSlice.name]: UrgentClaimSlice.reducer,
  [NotificationSlice.name]: NotificationSlice.reducer,
  [DashboardAlertSlice.name]: DashboardAlertSlice.reducer,
  [PendingInvoiceSlice.name]: PendingInvoiceSlice.reducer,
  [ClaimContentSlice.name]: ClaimContentSlice.reducer,
  [ClaimServiceRequestSlice.name]: ClaimServiceRequestSlice.reducer,
  [ExcelCsvUploadSlice.name]: ExcelCsvUploadSlice.reducer,
  [LineItemDetailSlice.name]: LineItemDetailSlice.reducer,
  [ClaimDetailSlice.name]: ClaimDetailSlice.reducer,
  [NavigationSlice.name]: NavigationSlice.reducer,
  [AddItemsTableCSVSlice.name]: AddItemsTableCSVSlice.reducer,
  [DetailedInventorySlice.name]: DetailedInventorySlice.reducer,
  [ClaimedItemsSlice.name]: ClaimedItemsSlice.reducer,
  [AssignmentDetailsSlice.name]: AssignmentDetailsSlice.reducer,
  [ReceiptMapperSlice.name]: ReceiptMapperSlice.reducer,
  [ClaimDetailsBtnSlice.name]: ClaimDetailsBtnSlice.reducer,
  [CommonDataSlice.name]: CommonDataSlice.reducer,
  [AllNotesSlice.name]: AllNotesSlice.reducer,
  [ClaimsReportSlice.name]: ClaimsReportSlice.reducer,
  [SalvageReportSlice.name]: SalvageReportSlice.reducer,
  [GlobalSearchSlice.name]: GlobalSearchSlice.reducer,
  [VendorInvoiceSlice.name]: VendorInvoiceSlice.reducer,
  [VendorPaymentsSlice.name]: VendorPaymentsSlice.reducer,
  [InvoicesVendorSlice.name]: InvoicesVendorSlice.reducer,
  [UsersSlice.name]: UsersSlice.reducer,
  [MyTeamSlice.name]: MyTeamSlice.reducer,
  [BranchSlice.name]: BranchSlice.reducer,
  ...adminReducers,
});
export default rootReducer;
