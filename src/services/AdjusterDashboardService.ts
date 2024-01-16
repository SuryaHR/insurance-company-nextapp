import { getApiEndPoint } from "./ApiEndPointConfig";
import HttpService from "@/HttpService";

interface objectType {
  [key: string | number]: any;
}

export const getPendingVendorInvoices = async (payload: object) => {
  try {
    const http = new HttpService();
    const url = getApiEndPoint("invoicelist");
    const resp = await http.post(url, payload);
    const { error } = resp;
    if (!error) {
      return resp.data;
    }
    return error;
  } catch (err) {
    return err;
  }
};

export const getImmediateClaims = async (param: any): Promise<objectType> => {
  try {
    const http = new HttpService();
    const url = getApiEndPoint("immidiateAttentionClaims") + param;
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
