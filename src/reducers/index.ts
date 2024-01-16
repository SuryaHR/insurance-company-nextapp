import { combineReducers } from "@reduxjs/toolkit";
import ClaimSlice from "./ClaimData/ClaimSlice";
import UrgentClaimSlice from "./UrgentClaimData/UrgentClaimSlice";
import SessionSlice from "./Session/SessionSlice";
import NotificationSlice from "./Notification/NotificationSlice";
import DashboardAlertSlice from "./DashboardAlert/DashboardAlertSlice";
import PendingInvoiceSlice from "./PendingInvoice/PendingInvoiceSlice";
import ClaimContentSlice from "./ClaimData/ClaimContentSlice";
import ClaimServiceRequestSlice from "./ClaimData/ClaimServiceRequestSlice";
import ExcelCsvUploadSlice from "./UploadCSV/excelCsvUploadSlice";
import LineItemDetailSlice from "./LineItemDetail/LineItemDetailSlice";
import ClaimDetailSlice from "./ClaimDetail/ClaimDetailSlice";
import NavigationSlice from "./UploadCSV/navigationSlice";
import AddItemsTableCSVSlice from "./UploadCSV/AddItemsTableCSVSlice";
import DetailedInventorySlice from "./ContentsEvaluation/DetailedInventorySlice";

const rootReducer = combineReducers({
  [SessionSlice.name]: SessionSlice.reducer,
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
});

export default rootReducer;
