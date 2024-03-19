const translate = {
  assignmentTabTitle: "Assignments",
  quoteByAssignmentTabTitle: "Quote By Assignments",
  invoicesTabTitle: "Invoices",

  assignmnets: {
    itemsWithVendors: "# Items with Vendors",
    itemsProcessed: "# Items Processed",
    assignmentId: "Assignment Id",
    vendorName: "Vendor Name",
    items: "#Items",
    servicerequested: "Service Requested",
    status: "Status",
    startDate: "Start Date",
    firstTouch: "First Touch",
    maxClaim: "Max. Claim Time Agreed",
    timeTaken: "Time Taken so far",
    noRecord: "No record Found",
  },

  quoteByAssignments: {
    quotesummaryHeading: "All Replacement Quotes Summary",
    assignment: "Assignment #",
    assignmentStartDate: "Assignment Start Date",
    vendorCompany: "Vendor Company",
    status: "Status",
    assignmentEndDate: "Assignment End Date",
    originalCost: "Original Cost",
    replacementCost: "Replacement Cost",
    quoteDate: "Quote Date",
    finalQuote: "Final Quote",
    noRecordFound: "No Record Found",
  },

  invoices: {
    replacementQuotesSummaryTitle: "All Replacement Quotes Summary",
    totalVendorInvoices: "Total # Vendor Invoices",
    invoicesPaid: "Invoices paid",
    totalInvoices: "Total $ of Invoices",
    totalPaid: "Total Paid",
    toBePaid: "to be paid",
    invoiceId: "Invoice Id",
    amount: "Amount",
    invoiceDate: "Invoice Date",
    dueDate: "Due Date",
    status: "Status",
    vendorNote: "Vendor Note",
    attachments: "Attachments",
    action: "Action",
    noDataFound: "No Data Found",
  },
};

export { translate };

export type vendorAssignmentTranslateType = typeof translate;
