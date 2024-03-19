import { getApiEndPoint } from "./ApiEndPointConfig";
import HttpService from "@/HttpService";

export const getClaimScoreCard = async (param: any, isClient?: boolean) => {
  try {
    const http = new HttpService({ isClient });
    const url = getApiEndPoint("scoreCard") + param;
    const resp = await http.get(url);
    const { error } = resp;
    if (!error) {
      return resp;
    }
    return error;
  } catch (err) {
    return err;
  }
};
