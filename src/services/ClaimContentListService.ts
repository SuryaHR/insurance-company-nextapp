import { getApiEndPoint } from "./ApiEndPointConfig";
import store from "@/store/store";
import {
  deleteClaimContentListItem,
  updateClaimContentListData,
} from "@/reducers/ClaimData/ClaimContentSlice";

import HttpService from "@/HttpService";

export const claimContentList = async (
  payload: { claimId: string | any },
  isClient = false
) => {
  try {
    const url = getApiEndPoint("claimContentList");
    const http = new HttpService({ isClient });
    const res = await http.post(url, payload);
    return res;
  } catch (error) {
    console.warn("claimContentList__err", error);
    throw error;
  }
};

export const claimContentListV2 = async (payload: { claimId: string }) => {
  try {
    const url = getApiEndPoint("claimContentList");
    const http = new HttpService({ isClient: true });
    const res = await http.post(url, payload);
    return res;
  } catch (error) {
    console.error("claimContentListV2__err", error);
    throw error;
  }
};

export const deleteClaimItem = async (payload: any) => {
  const url = getApiEndPoint("deleteClaimContentListItem");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, payload);

  if (res.status === 200) {
    const message = res.message;
    store.dispatch(deleteClaimContentListItem({ itemId: payload.id }));
    return message;
  }
  return null;
};
export const fetchContentList = async (searchKeyword = "") => {
  const state = store.getState();
  const searchWord = searchKeyword ?? state.claimContentdata.searchKeyword;

  const claimContentListDataFull = state.claimContentdata.claimContentListDataFull;

  const claimContentList = await claimContentListDataFull.filter((obj) =>
    JSON.stringify(obj).toLowerCase().includes(searchWord.toLowerCase())
  );

  store.dispatch(updateClaimContentListData({ claimContentList }));

  return claimContentList;
};
