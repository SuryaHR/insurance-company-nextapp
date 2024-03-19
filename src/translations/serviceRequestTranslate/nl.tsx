const translate = {
  serviceRequestHeading: "Service Requests",
  newServiceRequest: "New Service Request",
  search: "Search...",

  serviceRequestTableColoumns: {
    serviceNumber: "Service Number",
    requestDescription: "Request Description",
    vendor: "Vendor",
    assignDate: "Assign Date",
    targetCompletionDate: "Target Completion Date",
    status: "Status",
    action: "Action",
    assign: "Assign",
    delete: "Delete",
    deleteMessage: "Are you sure you want to delete the service request",
    confirm: "Please Confirm!",
  },
};

export { translate };

export type serviceRequestComponentType = typeof translate;
