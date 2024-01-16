import { getApiEndPoint } from "../ApiEndPointConfig";
import HttpService from "@/HttpService";

export const addMessage = async (payload: any) => {
  try {
    const url = getApiEndPoint("pushNoteApiUrl");
    const http = new HttpService({ isClient: true, isFormData: true });
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
