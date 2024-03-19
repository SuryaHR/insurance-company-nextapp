import store from "@/store/store";
import { getApiEndPoint } from "./ApiEndPointConfig";
import HttpService from "@/HttpService";
import { addEditItemDetail } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";

interface objectType {
  [key: string | number]: any;
}

export const fetchClaimContentItemDetails = async (
  payload: {
    forEdit: boolean;
    itemId: number;
  },
  contentData: any
) => {
  try {
    const url = getApiEndPoint("itemsDetails");
    const http = new HttpService({ isClient: true });

    const res = await http.post(url, payload);

    if (res.status === 200) {
      const claimContentListData = contentData;

      const itemIndex = claimContentListData.findIndex((item: objectType) => {
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
      store.dispatch(
        addEditItemDetail({ itemDetailData: res.data, previousItem, nextItem })
      );
    }

    return res;
  } catch (error) {
    console.warn("Error::", error);
    throw error;
  }
};

export const getPreviousItem = async (itemId: number, contentData: any) => {
  const claimContentListData = contentData;

  const itemIndex = claimContentListData.findIndex((item: objectType) => {
    if (item.id === itemId) {
      return true;
    }
  });
  const currentItemId: {
    id: number;
  } = claimContentListData[itemIndex - 1];

  const payload = {
    forEdit: true,
    itemId: currentItemId.id,
  };

  await fetchClaimContentItemDetails(payload, contentData);
};
export const getNextItem = async (itemId: number, contentData: any) => {
  const claimContentListData = contentData;

  const itemIndex = await claimContentListData.findIndex((item: objectType) => {
    if (item.id === itemId) {
      return true;
    }
  });
  const currentItemId: {
    id: number;
  } = claimContentListData[itemIndex + 1];

  const payload = {
    forEdit: true,
    itemId: currentItemId.id,
  };

  await fetchClaimContentItemDetails(payload, contentData);
};

export const addContentItem = async (param: object) => {
  try {
    const url = getApiEndPoint("addContentItemApi");
    const http = new HttpService({ isClient: true, isFormData: true });
    const resp = await http.post(url, param);
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
export const addNewRoom = async (param: object) => {
  try {
    const url = getApiEndPoint("addNewRoomApi");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
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

export const updateContentItem = async (param: object) => {
  try {
    const url = getApiEndPoint("updateContentItemApi");
    const http = new HttpService({ isClient: true, isFormData: true });
    const resp = await http.post(url, param);
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
