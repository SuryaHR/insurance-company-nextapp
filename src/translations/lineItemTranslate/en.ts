const translate = {
  originalItem: {
    heading: "Original Item",
    formField: {
      itemDesc: {
        label: "Original Item Description",
        placeholder: "Description",
      },
      category: {
        label: "Category",
        tooltip: "Select Category",
      },
      subCategory: {
        label: "Sub-Category",
        tooltip: "Select SubCategory",
      },
      standardReplace: {
        label: "Standard Replacement",
      },
      costPerUnit: {
        label: "Cost Per Unit",
        placeholder: "Stated Value (per unit)",
      },
      qty: {
        label: "Qty Lost / Damaged",
        placeholder: "Quantity",
      },
      totalCost: {
        label: "Total Cost",
        placeholder: "Quantity",
      },
      itemAge: {
        label: "Age of Item",
        placeholder: "Quantity",
        yearLabel: "(Years)",
        monthLabel: "(Months)",
      },
      applyTax: {
        label: "Apply Taxes {{VALUE}}%",
        yesLabel: "Yes",
        noLabel: "No",
      },
      brand: {
        label: "Brand / Manufacturer",
        placeholder: "Brand",
      },
      model: {
        label: "Model",
        placeholder: "Model",
      },
      purchaseFrom: {
        label: "Purchased From",
        addRetail: "Not found? click to add new retailer",
        addRetailPlaceholder: "Add Retailer",
      },
      purchaseMethod: {
        label: "Purchased Method",
        giftFromPlaceholder: "Name and Address",
      },
      condition: {
        label: "Condition",
      },
      room: {
        label: "Room",
      },
      scheduleItem: {
        label: "Scheduled Item",
        yesLabel: "Yes",
        noLabel: "No",
      },
      scheduledAmount: {
        label: "Scheduled Amount",
        placeHolder: "scheduledAmount",
      },
    },
    attachment: {
      attachmentConfirmMsg: "Are you sure you want to delete this attachment?",
      confirmText: "Please Confirm!",
      label: "Pictures, Recipts etc.",
      btnText: "Click to add attachment(s)",
    },
  },
  searchItem: {
    heading: "Web Comparable(s)",
    noSearch: "No searched result",
    toText: "To",
    formField: {
      priceFrom: {
        placeholder: "Price From",
      },
      priceTo: {
        placeholder: "Price To",
      },
      goBtn: {
        text: "Go",
      },
      searchInput: {
        placeholder: "Search...",
      },
    },
  },
  replacementTexts: {
    heading: "Replacement Item",
    addComparable: "Build a custom comparable",
    findMsg: "Scroll down to find comparable",
    formField: {
      desc: {
        label: "Description",
        placeholder: "Description",
      },
      source: {
        label: "Source",
        placeholder: "Source",
      },
      unitCost: {
        label: "Unit Cost",
        placeholder: "Unit Cost",
      },
      replaceQty: { label: "Replacement Quantity", placeholder: "Replacement Quantity" },
      taxes: {
        label: "Taxes({{TAX}}%)",
      },
      totalCost: {
        label: "Total Replacement Cost",
      },
    },
  },
};

export { translate };

export type lineItemTranslateType = typeof translate;
