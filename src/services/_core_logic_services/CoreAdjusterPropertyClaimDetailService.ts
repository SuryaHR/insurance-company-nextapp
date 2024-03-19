import HttpService from "@/HttpService";
import { getHeaderWithoutToken } from "@/utils/HeaderService";
import { getApiEndPoint } from "../_adjuster_services/ApiEndPointConfig";
import { deleteClaimContentListItem } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import store from "@/store/store";

export const authenticate = async (payload: object | undefined) => {
  const headersData: any = getHeaderWithoutToken();

  return new Promise((resolve, rejects) => {
    fetch(getApiEndPoint("authenticate"), {
      method: "POST",
      cache: "no-cache",
      headers: headersData,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        return resolve({ result });
      })
      .catch((error) => {
        console.log("error::", error);
        rejects({ error });
      });
  });
};

export const getClaimSettlement = async (claimId: string, token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const url = getApiEndPoint("claimSettlementApiUrl") + claimId;
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.get(url, headers);
    const { error } = resp;
    if (!error) {
      return resp;
    }
    return error;
  } catch (err: any) {
    return err;
  }
};

export const getCategories = async (token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const url = getApiEndPoint("categoriesRequest");
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.get(url, headers);
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
  token?: string
) => {
  let payload = null;
  if (!param) {
    payload = { categoryId: null };
  } else {
    payload = param;
  }
  try {
    const http = new HttpService({ isPublic: true });
    const url = getApiEndPoint("lineItemSubCategory");
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, payload, headers);
    return resp;
  } catch (err: any) {
    return err;
  }
};

export const claimContentList = async (
  payload: { claimId: string | any },
  token: string
) => {
  try {
    const url = getApiEndPoint("claimContentList");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const res = await http.post(url, payload, headers);
    return res;
  } catch (error) {
    console.warn("claimContentList__err", error);
    throw error;
  }
};

export const getClaimItemCondition = async (token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const url = getApiEndPoint("lineItemCondition");
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.get(url, headers);
    const { error } = resp;
    if (!error) {
      return resp;
    }
    return error;
  } catch (err: any) {
    return err;
  }
};

export const getClaimItemRetailers = async (token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const url = getApiEndPoint("lineItemRetailer");
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.get(url, headers);
    const { error } = resp;
    if (!error) {
      return resp;
    }
    return error;
  } catch (err: any) {
    return err;
  }
};

export const getClaimItemRoom = async (claim: string, token: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    let url = getApiEndPoint("lineItemRoom");
    url = url.replace("{{CLAIM}}", claim);
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.get(url, headers);
    const { error } = resp;
    if (!error) {
      return resp;
    }
    return error;
  } catch (err: any) {
    return err;
  }
};

export const getClaimRoomTypeData = async (token?: string) => {
  try {
    const http = new HttpService({ isPublic: true });
    const url = getApiEndPoint("roomTypeApi");
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.get(url, headers);
    return resp?.data ?? [];
  } catch (err: any) {
    return [];
  }
};

export const updateCliamStatus = async (param: object, token?: string) => {
  try {
    const url = getApiEndPoint("updateCliamStatus");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const deleteClaimItem = async (payload: any, token: string) => {
  const url = getApiEndPoint("deleteClaimContentListItem");
  const http = new HttpService({ isPublic: true });
  const headers = { ["X-Auth-Token"]: token };
  const res = await http.post(url, payload, headers);
  if (res.status === 200) {
    const message = res.message;
    store.dispatch(deleteClaimContentListItem({ itemId: payload.id }));
    return message;
  }
  return null;
};

export const reviewItemSupervisor = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("reviewItemSupervisor");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const addMessage = async (payload: any, token: string) => {
  try {
    const url = getApiEndPoint("pushNoteApiUrl");
    const http = new HttpService({ isPublic: true, isFormData: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, payload, headers);
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

export const claimContentListV2 = async (payload: { claimId: string }, token: string) => {
  try {
    const url = getApiEndPoint("claimContentList");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const res = await http.post(url, payload, headers);
    return res;
  } catch (error) {
    console.error("claimContentListV2__err", error);
    throw error;
  }
};
export const addContentItem = async (param: object, token?: string) => {
  try {
    const url = getApiEndPoint("addContentItemApi");
    const http = new HttpService({ isPublic: true, isFormData: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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
export const addNewRoom = async (param: object, token?: string) => {
  try {
    const url = getApiEndPoint("addNewRoomApi");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const updateContentItem = async (param: object, token?: string) => {
  try {
    const url = getApiEndPoint("updateContentItemApi");
    const http = new HttpService({ isPublic: true, isFormData: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const fetchClaimContentItemDetails = async (
  payload: {
    forEdit: boolean;
    itemId: number;
  },
  contentData: any,
  token: string
) => {
  try {
    const url = getApiEndPoint("itemsDetails");
    const http = new HttpService({ isPublic: true });

    const headers = { ["X-Auth-Token"]: token };
    const res = await http.post(url, payload, headers);
    if (res.status === 200) {
      const claimContentListData = contentData;

      const itemIndex = claimContentListData.findIndex((item: any) => {
        if (item.id === payload.itemId) {
          return true;
        }
      });
      let previousItem = false;
      let nextItem = false;

      if (itemIndex === 0) {
        previousItem = false;
        nextItem = true;
      } else if (itemIndex === claimContentListData.length - 1) {
        nextItem === false;
        previousItem = true;
      } else {
        previousItem = true;
        nextItem = true;
      }
      return { itemDetailData: res.data, previousItem, nextItem };
    }

    return null;
  } catch (error) {
    console.warn("Error::", error);
    throw error;
  }
};

export const updateCliamCategoryFun = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("updateCliamCategory");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const updatePaidStatus = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("updatePaidStatus");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const fetchExcelCsvTableData = async (payload: any, token: string) => {
  const url = getApiEndPoint("excelcsvuploaddata");
  const http = new HttpService({ isPublic: true, isFormData: true });
  const headers = { ["X-Auth-Token"]: token };
  const res = await http.post(url, payload, headers);
  return res;
};

export const fetchImportCsvData = async (payload: any, token: string) => {
  const url = getApiEndPoint("importCsvTable");
  const http = new HttpService({ isPublic: true, isFormData: false });
  const headers = { ["X-Auth-Token"]: token };
  const res = await http.post(url, payload, headers);
  return res;
};

export const fetchAddItemsTableCSVData = async (payload: any, token: string) => {
  const url = getApiEndPoint("addItemsListTable");
  const http = new HttpService({ isPublic: true, isFormData: false });
  const headers = { ["X-Auth-Token"]: token };
  const res = await http.post(url, payload, headers);
  return res;
};
