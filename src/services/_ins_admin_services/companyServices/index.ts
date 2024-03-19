import HttpService from "@/HttpService";
import { getApiEndPoint } from "@/services/_adjuster_services/ApiEndPointConfig";

export const getAdminCompanyDetails = async (companyId: string) => {
  const payload = { id: companyId };
  const http = new HttpService({ isClient: true });
  const url = getApiEndPoint("companyDetailsUrl");
  const resp = await http.post(url, payload);
  return resp;
};

export const getAdminCompanyBackgroundImages = async () => {
  const http = new HttpService({ isClient: true });
  const url = getApiEndPoint("companyLogoBackgroundImage");
  const resp = await http.get(url);
  return resp;
};

export const fetchAdminState = async (param: {
  isTaxRate: boolean;
  isTimeZone: boolean;
}) => {
  const url = getApiEndPoint("stateOption");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, param);
  return res;
};

export const getAdminClaimProfile = async () => {
  const http = new HttpService({ isClient: true });
  const url = getApiEndPoint("companyProfileList");
  const resp = await http.get(url);
  return resp;
};
