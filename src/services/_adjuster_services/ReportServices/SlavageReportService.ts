import HttpService from "@/HttpService";

import { getApiEndPoint } from "../ApiEndPointConfig";

export const getSalvageStatusforReport = async () => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("salvageStatusforReport");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getSalvageReportforReport = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("salvageReportforReport");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};
