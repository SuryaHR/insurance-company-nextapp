import { getApiEndPoint } from "../ApiEndPointConfig";
import HttpService from "@/HttpService";

export const getLossTypes = async () => {
  try {
    const url = getApiEndPoint("lossTypeOption");
    const http = new HttpService({ isClient: true });
    const resp = await http.get(url);
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
export const updateClaimDetail = async (payload: any) => {
  try {
    const url = getApiEndPoint("updateClaimDetailApiUrl");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, payload);
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
