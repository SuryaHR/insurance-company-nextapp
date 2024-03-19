const translate = {
  claims: {
    tabName: "Claims",
    foundFor: "{{COUNT}} Claim Found For {{TEXT}}",
    header: {
      types: "Types",
      claims: "Claims#",
      created_date: "Created Date",
      policy_number: "Policy#",
      policy_holder: "Policy Holder",
      adjuster: "Adjuster",
      status: "Status",
      last_note: "Last Note",
    },
  },
  people: {
    tabName: "People",
    foundFor: "{{COUNT}} People Found For {{TEXT}}",
    header: {
      name: "Name",
      role: "Role",
      company: "Company",
      status: "Status",
      login: "Last Login",
      active: "Active",
      inactive: "In-Active",
    },
    profileBtn: "View Profile",
  },
  documents: {
    tabName: "Documents",
    foundFor: "{{COUNT}} Documents Found For {{TEXT}}",
    header: {
      fileName: "Document Name",
      claimNumber: "Claim#",
      uploadDate: "Last Updated",
      action: "Action",
    },
    viewBtn: "View",
    downloadBtn: "Download",
  },
  invoice: {
    tabName: "Invoices",
    foundFor: "{{COUNT}} Invoices Found For {{TEXT}}",
    header: {
      invoiceNumber: "Invoice#",
      amount: "Amount",
      status: "Status",
      createDate: "Created Date",
      vendorName: "Vendor Name",
      claimNumber: "Claim #",
      adjuster: "Adjuster Name",
      holderName: "Policyholder Name",
    },
  },
  suppliers: {
    tabName: "Suppliers",
    foundFor: "{{COUNT}} Vendors Found For {{TEXT}}",
    header: {
      vendorNumber: "Supplier #",
      vendorName: "Vendor Name",
      billingAddress: "Address",
      contact: "Contact Preson",
      cellPhone: "Phone #",
      status: "Status",
    },
  },
  home: "Home",
  searchResults: "Search Results",
  search: "Search",
  noDataError: "No Record Found",
};

export { translate };

export type adjusterGlobalSearchTranslateType = typeof translate;
