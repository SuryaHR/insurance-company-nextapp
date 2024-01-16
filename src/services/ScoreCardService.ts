import { getApiEndPoint } from "./ApiEndPointConfig";
import HttpService from "@/HttpService";

export const getClaimScoreCard = async (param: any, isClient: boolean = false) => {
  try {
    const http = new HttpService({ isClient });
    const url = getApiEndPoint("scoreCard") + param;
    const resp = await http.get(url);
    const { data, error } = resp;
    if (data) {
      return data;
    }
    return error;
  } catch (err) {
    return err;
  }
};
