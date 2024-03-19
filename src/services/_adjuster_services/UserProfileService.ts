import { getApiEndPoint } from "./ApiEndPointConfig";
import HttpService from "@/HttpService";

export const userProfileDetails = async (payload: any) => {
  try {
    const url = getApiEndPoint("userProfileDetail");
    const http = new HttpService({ isClient: true, isFormData: false });
    const res = await http.post(url, payload);
    const { error } = res;
    if (!error) {
      return res;
    } else {
      return error;
    }
  } catch (err) {
    return err;
  }
};

export const updateUserProfileData = async (param: object) => {
  try {
    const url = getApiEndPoint("updateUserProfile");
    const http = new HttpService({ isClient: true, isFormData: true });
    const resp = await http.post(url, param);
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
