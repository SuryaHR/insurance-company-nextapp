import HttpService from "@/HttpService";

import { getApiEndPoint } from "../ApiEndPointConfig";

export const getVendorInvoice = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("vendorInvoice");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorInvoiceStatus = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("vendorInvoiceStatus");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorInvoiceRegVendors = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("assignVendorGet");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorInvoiceAdjusters = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("adjusterByCompanyId");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getVendorInvoiceLineItem = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("invoiceViewDataApi");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};
