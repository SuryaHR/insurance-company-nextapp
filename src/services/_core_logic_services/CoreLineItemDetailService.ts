import HttpService from "@/HttpService";
import { getApiEndPoint } from "../_adjuster_services/ApiEndPointConfig";
import { unknownObjectType } from "@/constants/customTypes";
import { parseTranslateString } from "@/utils/utitlity";

export const fetchClaimItemDetails = async (
  payload: { itemId: number },
  token: string
) => {
  try {
    const url = getApiEndPoint("itemsDetails");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const res = await http.post(url, payload, headers);
    return res;
  } catch (error) {
    console.warn("Error::", error);
    throw error;
  }
};

export type searchComparableReq = {
  item: string;
  id: string;
  numberOfCounts: number;
  priceFrom: number;
  pincode: number | null;
  pageNo: number;
  serfWowSearch: boolean;
  ids: [1];
  priceTo?: number;
};

export const fetchComparable = async (
  payload: searchComparableReq,
  token: string,
  abortControl?: AbortController
) => {
  try {
    const url = getApiEndPoint("replacementApi");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const res = await http.post(url, payload, headers, abortControl);
    return res;
  } catch (error) {
    console.warn("fetchComparable::", error);
    throw error;
  }
};

export const getLineItemSubCategory = async (
  param: { categoryId: number },
  token: string
) => {
  try {
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const url = getApiEndPoint("lineItemSubCategory");
    const resp = await http.post(url, param, headers);
    return resp?.data ?? null;
  } catch (err: any) {
    return null;
  }
};

export const getLineItemCondition = async (token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };

    const url = getApiEndPoint("lineItemCondition");
    const resp = await http.get(url, headers);
    return resp?.data ?? null;
  } catch (err: any) {
    return null;
  }
};

export const getLineItemCategory = async (token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const url = getApiEndPoint("lineItemCategory");
    const resp = await http.get(url, headers);

    return resp?.data ?? [];
  } catch (err: any) {
    return [];
  }
};

export const getLineItemRoom = async (claim: string, token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    let url = getApiEndPoint("lineItemRoom");
    url = url.replace("{{CLAIM}}", claim);
    const resp = await http.get(url, headers);

    return resp?.data ?? [];
  } catch (err: any) {
    return [];
  }
};

export const getLineItemRetailers = async (token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const url = getApiEndPoint("lineItemRetailer");
    const resp = await http.get(url, headers);

    return resp?.data ?? { paymentTypes: [], retailers: [] };
  } catch (err: any) {
    return { paymentTypes: [], retailers: [] };
  }
};

export const addCustomItem = async (param: unknownObjectType, token: string) => {
  const url = getApiEndPoint("newCustomComparable");
  const http = new HttpService({ isPublic: true, isFormData: true });
  const headers = { ["X-Auth-Token"]: token };
  const resp = await http.post(url, param, headers);
  return resp;
};

export const removeCustomComparable = async (id: number, token: string) => {
  const url = getApiEndPoint("deleteCustomItemApi").replace("{{COMPARABLE_ID}}", `${id}`);
  const http = new HttpService({ isPublic: true });
  const headers = { ["X-Auth-Token"]: token };
  const resp = await http.get(url, headers);
  return resp;
};

export const deleteAttachment = async ({
  id,
  purpose,
  token,
}: {
  id: number;
  purpose?: string;
  token: string;
}) => {
  const url = getApiEndPoint("deleteLineItemReceiptAttachment")
    .replace("{{IMAGE_ID}}", `${id}`)
    .replace("{{PURPOSE}}", `${purpose}`);
  const http = new HttpService({ isPublic: true });
  const headers = { ["X-Auth-Token"]: token };

  const resp = await http.delete(url, headers);
  return resp;
};

export const handleLineItemSave = async (payload: FormData, token: string) => {
  const url = getApiEndPoint("saveLineItem");
  const http = new HttpService({ isPublic: true, isFormData: true });
  const headers = { ["X-Auth-Token"]: token };

  const resp = await http.post(url, payload, headers);
  return resp;
};

export const getParticipantsList = async (id: number, token: string) => {
  const url = parseTranslateString({
    parseString: getApiEndPoint("participants"),
    replaceMapper: { ITEM_ID: id },
  });
  const http = new HttpService({ isPublic: true });
  const headers = { ["X-Auth-Token"]: token };
  const resp = await http.get(url, headers);
  return resp;
};
