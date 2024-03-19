import HttpService from "@/HttpService";

import { getApiEndPoint } from "../ApiEndPointConfig";

export const getVendorPayments = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("vendorPayments");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorPaymentsStatus = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("vendorPaymentsStatus");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorPaymentsRegVendors = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("assignVendorGet");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};
