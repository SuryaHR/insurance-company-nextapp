import { getApiEndPoint } from "../ApiEndPointConfig";
import HttpService from "@/HttpService";

export const getclaimContents = async (
  param: { claimId: string },
  isClient?: boolean
) => {
  const payload = { id: param?.claimId };
  try {
    const http = new HttpService({ isClient });
    const url = getApiEndPoint("claimContentsUrl");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};
export const getClaimPolicyInfo = async (
  param: { claimId: string },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });
    const url = getApiEndPoint("policyInfo");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};
export const getCompanyDetails = async (companyId: string) => {
  const payload = { id: companyId };
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("companyDetailsUrl");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getClaimRoomTypeData = async (isClient?: boolean) => {
  try {
    const http = new HttpService({ isClient: isClient ? true : false });
    const url = getApiEndPoint("roomTypeApi");
    const resp = await http.get(url);
    return resp?.data ?? [];
  } catch (err: any) {
    return [];
  }
};

export const getActivityLogData = async (param: { claimId: string }) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("activityLogHistoryApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const downloadActivityLogData = async (param: { claimId: string }) => {
  try {
    const http = new HttpService({ isClient: true, isArrayBuffer: true });
    const url = getApiEndPoint("downloadActivityLogApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const uploadActivityLogData = async (formData: any) => {
  try {
    const http = new HttpService({ isClient: true, isFormData: true });
    const url = getApiEndPoint("uploadActivityLogDataApi");
    const resp = await http.post(url, formData);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getClaimSettlement = async (claimId: string, isClient?: boolean) => {
  try {
    const http = new HttpService({ isClient });
    const url = getApiEndPoint("claimSettlementApiUrl") + claimId;
    const resp = await http.get(url);
    const { error } = resp;
    if (!error) {
      return resp;
    }
    return error;
  } catch (err: any) {
    return err;
  }
};

export const updateCliamCategoryFun = async (param: object) => {
  try {
    const url = getApiEndPoint("updateCliamCategory");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { error } = resp;
    if (!error) {
      return resp;
    } else {
      return error;
    }
  } catch (err) {
    return err;
  }
};

export const updateCliamStatus = async (param: object) => {
  try {
    const url = getApiEndPoint("updateCliamStatus");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { error } = resp;
    if (!error) {
      return resp;
    } else {
      return error;
    }
  } catch (err) {
    return err;
  }
};

export const getVendorAssignments = async (param: {
  claimId: string;
  claimNumber: string;
}) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("vendorAssignmentsApiUrl");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getVendorAssignmentsCont = async (param: {
  claimId: string;
  claimNumber: string;
}) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("claimContentsUrl");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const updatePaidStatus = async (param: object) => {
  try {
    const url = getApiEndPoint("updatePaidStatus");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { error } = resp;
    if (!error) {
      return resp;
    } else {
      return error;
    }
  } catch (err) {
    return err;
  }
};

export const updateUnderReview = async (param: object) => {
  try {
    const url = getApiEndPoint("updateUnderReview");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { error } = resp;
    if (!error) {
      return resp;
    } else {
      return error;
    }
  } catch (err) {
    return err;
  }
};

export const reviewItemSupervisor = async (param: object) => {
  try {
    const url = getApiEndPoint("reviewItemSupervisor");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { error } = resp;
    if (!error) {
      return resp;
    } else {
      return error;
    }
  } catch (err) {
    return err;
  }
};

export const getQuoteByAssData = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url =
      getApiEndPoint("getQuoteByAssApiUrl") +
      "?claimNumber=" +
      sessionStorage.getItem("claimNumber");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getInvoiceData = async ({ claimNumber, assignmentNumber }: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("getInvoiceAssApiUrl");
    const resp = await http.post(url, {
      claimNumber,
      assignmentNumber,
    });
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const quoteViewData = async (
  quoteNumber = sessionStorage.getItem("quoteNumber")
) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("quoteViewDataApi") + "?quoteNumber=" + quoteNumber;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const quoteInvoiceData = async (
  invoiceId = sessionStorage.getItem("invoiceNumber")
) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("invoiceViewDataApi");
    const resp = await http.post(url, {
      invoiceNumber: invoiceId,
    });
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const exportQuotePdf = async (param: { profile: string; vendorQuoteId: any }) => {
  try {
    const http = new HttpService({ isClient: true, isArrayBuffer: true });
    const url = getApiEndPoint("exportQuotePdfApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const exportInvoicePdf = async (param: {
  claimId: any;
  claimNumber: any;
  id: any;
  invoiceNumber: any;
}) => {
  try {
    const http = new HttpService({ isClient: true, isArrayBuffer: true });
    const url = getApiEndPoint("exportInvoicePdfApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const approveQuote = async (data: any) => {
  try {
    const http = new HttpService({ isClient: true, isFormData: false });
    const url = getApiEndPoint("approveQuoteApi");
    const resp = await http.post(url, data);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getCustomerState = async (isClient?: boolean) => {
  try {
    const http = new HttpService({ isClient: isClient ? true : false });
    const url = getApiEndPoint("getCustomerState");
    const resp = await http.get(url);
    const { error } = resp;
    if (!error) {
      return resp;
    }
    return error;
  } catch (err: any) {
    return err;
  }
};

export const invoicePayment = async (param: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("invoicePaymentApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const invoiceVoid = async (param: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("invoiceVoidApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const invoiceSupReview = async (param: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("invoiceSupReviewApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const paymentContactDetails = async (param: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("paymentContactDetailsApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getDocumentsDetails = async (param: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url =
      getApiEndPoint("documentsDetailsApi") +
      `?claimnumber=${param?.claimNumber}&type=${param?.type}&page=${param?.page}&limit=${param?.limit}&q=${param?.keyword}`;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const uploadDocuments = async (formData: any) => {
  try {
    const http = new HttpService({ isClient: true, isFormData: true });
    const url = getApiEndPoint("documentsUploadApi");
    const resp = await http.post(url, formData);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getAdjusterByCompanyIdServ = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("adjusterByCompanyId");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const updateReassignAdjusterServ = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("reassignAdjuster");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const deleteMediafiles = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("deleteMediafiles");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const updateClaimStatus = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("updateClaimStatus");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};
