const translate = {
  topOptionButtons: {
    calculateSettlement: "Calculate Settlement",
    calculateDepreciation: "Re-Calculate Depreciation",
    reAssignClaim: "Re-Assign Claim",
    supervisorReview: "Supervisor Review",
    closeClaim: "Close Claim",
    deleteClaim: "Delete Claim",
  },
  claimSnapshot: {
    claimSnapshotHeading: "Claim snapshot",
    claim: "Claim #",
    status: "Status",
    createdDate: "Created Date",
    elapsedTime: "Elapsed Time",
    lossType: "Loss Type",
    claimDeductible: "Claim Deductible",
    tax: "Tax %",
    contentLimits: "Content Limits",
    minItemToPrice: "Min. $ Item to Price",
    items: "Items",
    claimed: "claimed",
    processed: "processed",
    exposure: "Exposure",
    repl: "Repl",
    cash: "Cash",
    paid: "Paid",
    paidCash: "cash",
    holdover: "holdover",
  },

  addMessageCard: {
    messages: "Messages",
    addNewMessage: "Add New Messages",
    noNewMessage: "No New Message",
    viewAllMessges: "viewAllMessges",

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
    formName: "Form Name",
    status: "Status",
    assignedDate: "Assigned Date",
    noTask: "No task available",
    viewAll: "View all",

    createTaskModal: {
      assignedTo: "Assigned To",
      formName: "Form Name",
      description: "Description",
      cancelBtn: "Cancel",
      addformBtn: "Add Form",
    },
  },
};

export { translate };

export type claimDetailsTranslateType = typeof translate;
