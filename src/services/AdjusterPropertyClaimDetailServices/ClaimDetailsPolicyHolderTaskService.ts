import { getApiEndPoint } from "../ApiEndPointConfig";
import HttpService from "@/HttpService";

export const getTaskList = async () => {
  try {
    const url = getApiEndPoint("taskListApiUrl");
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

export const createTask = async (payload: any) => {
  try {
    const url = getApiEndPoint("createTaskApiUrl");
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
