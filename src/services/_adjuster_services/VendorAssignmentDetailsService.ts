import { updateVendorAssignmentListData } from "@/reducers/_adjuster_reducers/VendorAssignment/AssignmentDetailsSlice";
import store from "@/store/store";

import HttpService from "@/HttpService";

import { getApiEndPoint } from "./ApiEndPointConfig";

type payloadAsgnNum = {
  assignmentNumber: string;
};

type payloadvrn = {
  vrn: string;
};

type payload = payloadvrn & payloadAsgnNum;

type payloadAsgnRating = payloadAsgnNum & {
  assignmentRating: number;
  assignmentRatingComment: string;
};

export const getVendorAssignmentItems = async (payload: payload) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("vendorAssignmentItems");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorAssignmentDetails = async (payload: payloadAsgnNum) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("vendorAssignmentDetails");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorAssignmentStatusItems = async (param: payloadAsgnNum) => {
  try {
    const http = new HttpService({ isClient: true });
    const url =
      getApiEndPoint("vendorAssignmentStatus") +
      "?assignmentNumber=" +
      param.assignmentNumber;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorAssignmentRating = async (param: payloadAsgnRating) => {
  try {
    const http = new HttpService({ isClient: true });
    const url =
      getApiEndPoint("vendorAssignmentRating") +
      "?assignmentNumber=" +
      param.assignmentNumber +
      "&assignmentRating=" +
      param.assignmentRating +
      "&comment=" +
      param.assignmentRatingComment;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorAssignmentGraphItems = async (param: payloadAsgnNum) => {
  try {
    const http = new HttpService({ isClient: true });
    const url =
      getApiEndPoint("vendorAssignmentGraph") +
      "?assignmentNumber=" +
      param.assignmentNumber;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const searchVendorAssignmentList = async (searchKeyword = "") => {
  const state = store.getState();
  const searchWord = searchKeyword ?? state.assignmentDetailsData?.searchKeyword;
  if (searchWord !== "") {
    const vendorAssignmentItemsData: any =
      state.assignmentDetailsData?.vendorAssignmentItemsData;

    const searchVendorAssignmentItemsData: any = await vendorAssignmentItemsData.filter(
      (obj: any) => JSON.stringify(obj).toLowerCase().includes(searchWord.toLowerCase())
    );
    store.dispatch(updateVendorAssignmentListData({ searchVendorAssignmentItemsData }));
    return searchVendorAssignmentItemsData;
  } else {
    const searchVendorAssignmentItemsData =
      state.assignmentDetailsData?.vendorAssignmentItemsData;
    store.dispatch(updateVendorAssignmentListData({ searchVendorAssignmentItemsData }));
    return searchVendorAssignmentItemsData;
  }
};

export const getContentServices = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("contentServices");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};
