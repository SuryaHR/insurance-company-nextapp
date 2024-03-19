const translate = {
  tabsComponent: {
    claimDetail: "Claim Detail",
    contentsEvaluation: "Contents Evaluation",
    vendorAssignments: "Vendor Assignments",
    documents: "Documents",
    claimParticipants: "Claim Participants",
    activityLog: "Activity Log",
    policyCoverageDetails: "Policy and Coverage Details",
  },
  topOptionButtons: {
    calculateSettlement: "Calculate Settlement",
    reAssignClaim: "Re-Assign Claim",
    supervisorReview: "Supervisor Review",
    closeClaim: "Close Claim",
    deleteClaim: "Delete Claim",
  },
  claimSnapshot: {
    claimSnapshotHeading: "Claim Snapshot",
    claim: "Claim #",
    status: "Status",
    createdDate: "Created Date",
    elapsedTime: "Elapsed Time",
    lossType: "Loss Type",
    deductible: "Deductible",
    tax: "Tax %",
    coverageLimits: "Coverage Limits",
    minItemToPrice: "Min. $ Item to Price",
    items: "Items",
    claimed: "Claimed",
    processed: "Processed",
    exposure: "Exposure",
    repl: "Repl",
    cash: "Cash",
    paid: "Paid",
    paidCash: "Cash",
    holdover: "Holdover",
    edit: "Edit",
    update: "Update",
    cancel: "Cancel",
  },

  addMessageCard: {
    messages: "Messages",
    addNewMessage: "Add New Message",
    noNewMessage: "No New Message",
    viewAllMessges: "View All Messages",
    newMessageBtn: "New Message",

    addNewMessageModal: {
      to: {
        label: "To",
        placeholder: "Select Participants",
      },
      message: {
        label: "Message",
        placeholder: "Message",
      },
      attachment: {
        label: "Attachment",
        linkName: "Click to add attachment",
      },
      errorMessages: {
        receipentErr: "Please select recipient",
        messageFieldsErr: "Message field is required.",
      },

      cancelBtn: "Cancel",
      addMsgBtn: "Add Message",
    },
  },

  policyHolderTaskCard: {
    modalHeading: "Create Task",
    policyHolderTask: "Policyholder's Task",
    createNewTask: "Create New Task",
    errorMessage:
      "* Policyholder email id is not present. Please update the policyholder email id to create the Task.",
    formName: "Form Name",
    status: "Status",
    assignedDate: "Assigned Date",
    noTask: "No Task Available",
    viewAll: "View All",

    createTaskModal: {
      assignedTo: "Assigned To",
      formName: "Form Name",
      description: "Description",
      cancelBtn: "Cancel",
      addformBtn: "Add Form",
    },
    allClaimTasks: {
      formID: "Form ID",
      formName: "Form Name",
      description: "Description",
      status: "Status",
      createdBy: "Created By",
      assignedTo: "Assigned To",
      assignedDate: "Assigned Date",
      action: "Action",
      dlt: "Delete",
      cnl: "Cancel",
      noTask: "No Tasks Available",
    },
  },
};
export { translate };
export type claimDetailsTabTranslateType = typeof translate;
