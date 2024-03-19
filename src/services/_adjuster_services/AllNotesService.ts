import { getApiEndPoint } from "./ApiEndPointConfig";
import HttpService from "@/HttpService";

export const getNoteDetails = async (param: { claimId: string }) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("claimNotesDetailsApi");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const getNotesParticipants = async (param: { claimNumber: string }) => {
  try {
    const http = new HttpService({ isClient: true });
    const url = getApiEndPoint("claimParticipantsUrl");
    const resp = await http.post(url, param);
    return resp;
  } catch (err: any) {
    return err;
  }
};
