import { get } from "lodash";

export const arrangeData = (data: any) => {
  const mainToGenerate = {
    branch: "branch",
    claimNumber: "claimNumber",
    createDate: "createDate",
    status: "status.status",
    policyLimit: "policyLimit",
    policyType: "policyType.name",
    policyHolder: "insuredDetails.lastName",
    adjuster: "adjuster.lastName",
  };

  const subToGenerate = {
    assignmentNumber: "assignmentNumber",
    services: "contentService.service",
    item: "numberOfItems",
    quoteDate: "vendorQuotes[0].createDate",
    quoteValueForNonAssignmentItems: "vendorQuotes[0].total",
    itemReplaced: "itemReplaced",
    replacementCostOfItemsInAssignment: "replacementCostOfItemsInAssignment",
    totalOfVendorInvoicesAssignment: "totalOfVendorInvoicesAssignment",
    closeDate: "closeDate",
  };

  const NAToGenerate = {
    service: "service",
    item: "countOfItemsWithNoAssignments",
    quoteDate: "quoteDate",
    quoteValueForNonAssignmentItems: "quoteValueForNonAssignmentItems",
    itemReplaced: "itemReplaced",
    replacementCostOfItemsWithNoAssignment: "replacementCostOfItemsWithNoAssignment",
    totalOfVendorInvoicesAssignment: "totalOfVendorInvoicesAssignment",
    indemnityOpportunity: "indemnityOpportunity",
    indemnity: "indemnity",
    closeDate: "closeDate",
  };

  const newMainArr = [];

  for (let i = 0; i < data?.length; i++) {
    const newSubArr = [];
    const newMainObj: any = {};
    for (const [key, value] of Object.entries(mainToGenerate)) {
      if (key === "policyHolder") {
        const firstName = get(data[i], "insuredDetails.firstName");
        const lastName = get(data[i], "insuredDetails.lastName");
        newMainObj[key] = lastName + ", " + firstName;
      } else {
        newMainObj[key] = get(data[i], value);
      }
    }

    if (data[i]?.assignments) {
      for (let j = 0; j < data[i]?.assignments?.length; j++) {
        const newSubObj: any = {};
        for (const [key, value] of Object.entries(subToGenerate)) {
          newSubObj[key] = get(data[i]?.assignments[j], value);
        }
        newSubArr.push(newSubObj);
      }
    }

    const [firstObj, ...remaining] = newSubArr;
    let newCreObj = Object.assign({}, newMainObj, firstObj);
    newCreObj["assignments"] = remaining;
    const notAssigned: any = {};
    if (data[i].countOfItemsWithNoAssignments) {
      for (const [key, value] of Object.entries(NAToGenerate)) {
        if (key === "assignmentNumber") {
          notAssigned["assignmentNumber"] = "Not Assigned";
        } else {
          notAssigned[key] = get(data[i], value);
        }
      }
      if (data[i]?.assignments?.length > 0) {
        remaining.push(notAssigned);
      } else {
        newCreObj = Object.assign({}, newMainObj, notAssigned);
      }
    }

    newMainArr.push(newCreObj);
  }
  return newMainArr;
};
