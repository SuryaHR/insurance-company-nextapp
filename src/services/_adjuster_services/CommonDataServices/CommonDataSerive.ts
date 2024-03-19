import { getApiEndPoint } from "../ApiEndPointConfig";
import HttpService from "@/HttpService";

export const getCategories = async (isClient?: boolean) => {
  try {
    const http = new HttpService({ isClient: isClient ? true : false });
    const url = getApiEndPoint("categoriesRequest");
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

export const getSubCategories = async (
  param?: { categoryId: number | null },
  isClient?: boolean
) => {
  let payload = null;
  if (!param) {
    payload = { categoryId: null };
  } else {
    payload = param;
  }
  try {
    const http = new HttpService({ isClient: isClient ? true : false });
    const url = getApiEndPoint("lineItemSubCategory");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};
export const getPendingTaskList = async (
  param: { claimId: string },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });
    const url = getApiEndPoint("pendingTaskList");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getClaimParticipantsList = async (
  param: { claimId: string },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });
    const url = getApiEndPoint("claimParticipantsUrl");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getClaimDetailMessageList = async (
  param: {
    pageNo: number;
    recordPerPage: number;
    claimId: string | null;
  },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });
    let url = getApiEndPoint("claimDetailMessageList");
    url = `${url}?page=${param?.pageNo}&limit=${param?.recordPerPage}&claim_id=${param?.claimId}`;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getClaimItemCondition = async (isClient?: boolean) => {
  try {
    const http = new HttpService({ isClient: isClient ? true : false });
    const url = getApiEndPoint("lineItemCondition");
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

export const getClaimItemRoom = async (claim: string, isClient = false) => {
  try {
    const http = new HttpService({ isClient });
    let url = getApiEndPoint("lineItemRoom");
    url = url.replace("{{CLAIM}}", claim);
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

export const getClaimItemRetailers = async (isClient?: boolean) => {
  try {
    const http = new HttpService({ isClient: isClient ? true : false });
    const url = getApiEndPoint("lineItemRetailer");
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

export const canclePolicyholderTask = async (payload: any) => {
  try {
    const url = getApiEndPoint("canclePolicyholderTask");
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

export const deletePolicyholderTask = async (id: any) => {
  try {
    const url = getApiEndPoint("deletePolicyholderTask").replace("{{id}}", `${id}`);
    const http = new HttpService({ isClient: true });
    const res = await http.delete(url);
    const { error } = res;
    if (!error) return res;
    throw error;
  } catch (err) {
    return err;
  }
};
