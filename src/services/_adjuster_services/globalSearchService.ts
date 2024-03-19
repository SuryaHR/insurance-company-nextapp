import HttpService from "@/HttpService";
import { getApiEndPoint } from "./ApiEndPointConfig";

interface searchPayload {
  searchString: string;
  companyId: string;
}
export const getGlobalSearchResult = async (
  payload: searchPayload,
  abortControl?: AbortController
) => {
  const url = getApiEndPoint("globalSearch");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, payload, {}, abortControl);
  return res;
};

export const getVendorDetail = async ({ id }: { id: number }) => {
  const payload = { vendorId: id };
  const url = getApiEndPoint("vendorDetail");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, payload);
  return res;
};
