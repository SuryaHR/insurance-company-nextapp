const translate = {
  modalHeading: "Add Item",

  inputFields: {
    ItemDescription: {
      label: "Item Description:",
      placeholder: "Description",
    },
    quantity: {
      label: "Quantity",
      placeholder: "Quantity",
    },
    price: {
      label: "Price",
      placeholder: "$0.00",
    },
    category: {
      label: "Category",
    },
    subCategory: {
      label: "Sub Category",
    },
    age: {
      label: "Age",
    },
    years: {
      label: "(Years)",
      placeholder: "Years",
    },
    months: {
      label: "(Months)",
      placeholder: "Months",
    },
    room: {
      label: "Room",
      newRoom: "Click to add new Room",
      roomNameLabel: "Room Name",
      cancelBtn: "Cancel",
      roomTypeLabel: "Room Type",
      createBtn: "Create",
    },
    applyTaxes: {
      label: "Apply Taxes(%)",
      yesBtn: "Yes",
      noBtn: "No",
    },
    condition: {
      label: "Condition",
      placeholder: "Average",
    },
    purchasedFrom: {
      label: "Originally Purchased From",
      newRetailerLink: "Not found? click to add retailer",
      addRetailerPlaceholder: "Add Retailer",
    },
    scheduledItem: {
      label: "Scheduled Item",
      yesBtn: "Yes",
      noBtn: "No",
      amount: "Scheduled Amount",
      amountPlaceholder: "Scheduled Amount",
    },
    addAttachmentBtn: "Add attachments",
    saveAndAddAnotherItemLink: "Save and Add Another Item",
    addItemBtn: "Add Item",
    resetBtn: "Reset",

    imagePreviewModal: "Image Preview Modal",
    closePreview: "Close Preview",
  },
  conversationModal: {
    conversation: "Conversations",
    conversationPlaceholder: "your messages here ...",
    attachments: "Attachments",
  },
  deleteItemModal: {
    deleteItemHeading: "Delete Lost/Damaged Item",
    dltMsg: "Are you sure you want to delete this item? ",
    confirmMsg: "Please Confirm!",
    yesBtn: "Yes",
    noBtn: "No",
  },

  inputErrors: {
    decriptionRequired: "Description must be a string.",
  },
};

export { translate };

export type addItemModalTranslateType = typeof translate;
