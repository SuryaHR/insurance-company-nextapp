import HttpService from "@/HttpService";

import { getApiEndPoint } from "../ApiEndPointConfig";

export const getStatusListForReport = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("statusList");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getAllPolicyTypeForReports = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("getAllPolicyType");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getClaimsforReport = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("claimsforReport");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getExportClaimsforReport = async function (payload: any) {
  try {
    const http = new HttpService({ isClient: true });
    let url = getApiEndPoint("exportClaimsforReport");
    url = `${url}`;
    const resp = await http.getFileByPayload(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};
