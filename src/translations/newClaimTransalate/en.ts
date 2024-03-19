const translate = {
  newClaim: {
    home: "Home",
    newClaimWizard: "New Claim Wizard",
    cancel: "Cancel",
    deleteClaim: "Delete Claim",
    resetAll: "Reset All",
    saveNext: "Save & Next",
    policyholderInformation: "Policyholder Information",
    claimInformarion: "Claim Information",
    claimPOlicyHeading: " 1) Claim and Policy Information",

    // claim information
    claimText: {
      claim: "Claim#",
      claimDate: "Claim Date",
      InsuranceCompany: "Insurance Company",
      adjusterName: "Adjusters Name",
      lossDamageType: "Loss/Damage Type ",
      claimDescription: "Claim Description ",
      claimDeductable: "Claim Deductible  ",
      minItemProduct: "Min. $ Item to Price",
      minimumDollar: " The minimum dollar value of the item",
      needsPricedByCarrier: "needs to be priced by the carrier.Anything",
      LessThanAccepted: "less than this can be accepted at the",
      itemFaceValue: "items face value",
      taxRate: "Tax Rate %",
      applyTaxes: "Apply Taxes",
      contentLimits: "Contents Coverage Limits",
      homeOwnersPolicyType: "Home Owner's Policy Type",
      specialLimit: "Special Limit",
      categoryCoverage: " Category Coverages",
      category: "Category",
      aggregateCoverage: "Aggregate Coverage",
      individualItemLimit: "Individual Item Limit",
      addAnotherSpecialCategory: " Add another special category",
      attachements: "Attachments",
      clickAddAttachment: "Click to add attachments",
    },
    // polcy information
    policyText: {
      firstName: "First Name",
      lastName: "Last Name",
      mobileNumber: "Mobile Number",
      secondaryPhoneNumber: "Secondary Phone Number",
      address: "Address",
      state: "State",
      zipCode: "Zip Code",
    },
  },
};

export { translate };

export type newClaimTransalateType = typeof translate;
