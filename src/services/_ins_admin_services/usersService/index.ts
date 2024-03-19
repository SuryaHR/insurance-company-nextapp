import HttpService from "@/HttpService";
import { unknownObjectType } from "@/constants/customTypes";
import { getApiEndPoint } from "@/services/_adjuster_services/ApiEndPointConfig";

export const getBranchOffice = async (id: number) => {
  const payload = {
    id,
  };
  const url = getApiEndPoint("officelist");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, payload);
  return res;
};

export const getDesignation = async () => {
  const url = getApiEndPoint("designation");
  const http = new HttpService({ isClient: true });
  const res = await http.get(url);
  return res;
};

export const getRole = async () => {
  const url = getApiEndPoint("roles");
  const http = new HttpService({ isClient: true });
  const res = await http.get(url);
  return res;
};

export const getReportingManagerRolemap = async (payload: { manegers: string[] }) => {
  const url = getApiEndPoint("reportingmanagers");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, payload);
  return res;
};

export const addUser = async (payload: unknownObjectType) => {
  const url = getApiEndPoint("addEmployee");
  const http = new HttpService({ isClient: true, isFormData: true });
  const res = await http.post(url, payload);
  return res;
};

export const updateUser = async (payload: unknownObjectType) => {
  const url = getApiEndPoint("updateEmployee");
  const http = new HttpService({ isClient: true, isFormData: true });
  const res = await http.post(url, payload);
  return res;
};

export const getCompanyEmployees = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("getCompanyEmployees");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const removeUser = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("removeUser");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getStates = async (payload: any) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("stateOption");
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return err;
  }
};
