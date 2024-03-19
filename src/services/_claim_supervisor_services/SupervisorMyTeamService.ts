import { getApiEndPoint } from "../_adjuster_services/ApiEndPointConfig";
import HttpService from "@/HttpService";

export const getMyTeamData = async () => {
  try {
    const url = getApiEndPoint("supervisorMyTeam");
    const http = new HttpService({ isClient: true, isFormData: false });
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return err;
  }
};
