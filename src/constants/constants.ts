export const PAGINATION_LIMIT_10 = 10;
export const PAGINATION_LIMIT_20 = 20;
export const SEARCH_COMPARABLE_DESC_LIMIT = 60;
export const NO_IMAGE = "/assets/global/img/no-image.png";
export const PDF_IMAGE = "/assets/global/img/pdf-icon.svg";
export const DOC_IMAGE = "/assets/global/img/docs-file.svg";
export const EXCEL_IMAGE = "/assets/global/img/excel-icon.svg";

export const XORIGINATOR = process.env.NEXT_PUBLIC_XORIGINATOR;
export const baseUrl = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const WEB_SEARCH_ENGINES = [
  { id: "10", name: "Google Shopping" },
  { id: "1", name: "Google", default: true },
  { id: "2", name: "Amazon" },
  { id: "3", name: "Ebay" },
];
export const TABLE_LIMIT_5 = 5;

export const ITEM_STATUS = {
  created: "CREATED",
  assigned: "ASSIGNED",
  underReview: "UNDER REVIEW",
  valued: "VALUED",
  approved: "APPROVED",
  settled: "SETTLED",
  replaced: "REPLACED",
  workInProgress: "WORK IN PROGRESS",
  paid: "PAID",
  partialReplaced: "PARTIAL REPLACED",
};

export const CLAIM_STATUS = [
  { id: 1, status: "Created" },
  { id: 2, status: "Work In Progress" },
  { id: 3, status: "3rd Party Vendor" },
  { id: 4, status: "Waiting on Information" },
  { id: 5, status: "Supervisor Approval" },
  { id: 6, status: "Approved" },
  { id: 7, status: "Returned" },
  { id: 8, status: "Closed" },
  { id: 9, status: "Rejected" },
  { id: 10, status: "Assigned" },
];
