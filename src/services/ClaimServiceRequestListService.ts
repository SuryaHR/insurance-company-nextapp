import { getApiEndPoint } from "./ApiEndPointConfig";
import store from "@/store/store";
import {
  updateServiceRequestVisibleData,
  deleteServiceRequestClaimItem,
} from "@/reducers/ClaimData/ClaimServiceRequestSlice";
import { sortBy } from "lodash";
import { TABLE_LIMIT_5 } from "@/constants/constants";
import HttpService from "@/HttpService";

export const serviceRequestList = async (payload: { claimId: string }) => {
  try {
    const url = getApiEndPoint("serviceRequest");
    const http = new HttpService();
    const res = await http.post(url, payload);
    return res;
  } catch (error) {
    console.warn("serviceRequest__err", error);
    throw error;
  }
};

export const fetchServiceRequestList = async (
  pageNumber = 0,
  pageLimit = TABLE_LIMIT_5,
  sortByvalue = "",
  orderBy = "asc",
  searchKeyword = ""
) => {
  const state = store.getState();
  const claimServiceRequestListTotalData =
    state.claimServiceRequestdata.claimServiceRequestListTotalData;

  const searchWord = searchKeyword ?? state.claimServiceRequestdata.searchKeyword;

  const newclaimResult = await claimServiceRequestListTotalData.filter((obj) =>
    JSON.stringify(obj).toLowerCase().includes(searchWord.toLowerCase())
  );

  let sortedData;
  if (orderBy === "asc") {
    sortedData = sortBy(newclaimResult, sortByvalue);
  } else {
    sortedData = sortBy(newclaimResult, sortByvalue).reverse();
  }
  const start = pageNumber * pageLimit;
  const end = start + pageLimit;

  const claimServiceRequestList = sortedData.slice(start, end);

  store.dispatch(updateServiceRequestVisibleData({ claimServiceRequestList }));

  return claimServiceRequestList;
};

export const deleteServiceRequestItem = async (payload: any) => {
  const url = getApiEndPoint("deleteServiceRequestItem");
  const http = new HttpService({ isClient: true });
  const res = await http.delete(url, payload);
  const state = store.getState();

  if (res.status === 200) {
    const message = res.message;

    const claimServiceRequestListTotalData =
      state.claimServiceRequestdata.claimServiceRequestListTotalData;
    const claimServiceRequestList = state.claimServiceRequestdata.claimServiceRequestList;

    const newClaimServiceRequestListFull = await claimServiceRequestListTotalData.filter(
      (item: any) => {
        return item.serviceRequestId !== payload.serviceId;
      }
    );
    const newClaimServiceRequestList = await claimServiceRequestList.filter(
      (item: any) => {
        return item.serviceRequestId !== payload.serviceId;
      }
    );

    store.dispatch(
      deleteServiceRequestClaimItem({
        newClaimServiceRequestListFull,
        newClaimServiceRequestList,
      })
    );
    return message;
  }
  return null;
};
