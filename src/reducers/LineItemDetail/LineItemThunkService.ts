import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getLineItemCategory,
  getLineItemCondition,
  getLineItemRetailers,
  getLineItemRoom,
  getLineItemSubCategory,
  removeCustomComparable,
} from "@/services/AdjusterMyClaimServices/LineItemDetailService";
import {
  fetchClaimItemDetails,
  fetchComparable,
  searchComparableReq,
} from "@/services/AdjusterMyClaimServices/LineItemDetailService";
import { RootState } from "@/store/store";
import EnumStoreSlice from "../EnumStoreSlice";
import { WEB_SEARCH_ENGINES } from "@/constants/constants";
import { updateWebsearch } from "./LineItemDetailSlice";
import { unknownObjectType } from "@/constants/customTypes";

export const fetchRetailersDetails = createAsyncThunk(
  "lineItem/retailer",
  async (_, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getLineItemRetailers();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchRoom = createAsyncThunk("lineItem/room", async (claim: string, api) => {
  const rejectWithValue = api.rejectWithValue;
  try {
    const res = await getLineItemRoom(claim);
    return res;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchCondition = createAsyncThunk("lineItem/condition", async (_, api) => {
  const rejectWithValue = api.rejectWithValue;
  try {
    const res = await getLineItemCondition();
    return res;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchLineItemCatergory = createAsyncThunk(
  "lineItem/category",
  async (_, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getLineItemCategory();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSubCategory = createAsyncThunk(
  "lineItem/subCategory",
  async (categoryId: number, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getLineItemSubCategory({ categoryId });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLineItemDetail = createAsyncThunk(
  "lineItem/fetchLineItem",
  async ({ itemId }: { itemId: number }, api) => {
    const rejectWithValue = api.rejectWithValue;
    const dispatch = api.dispatch;
    const state = api.getState() as RootState;
    try {
      const res = await fetchClaimItemDetails({ itemId }, true);
      if (res.status === 200) {
        const insuredPrice = res.data.insuredPrice;
        const searchKey = res.data.description;
        const pincode = res.data.policyHolderPinCode;
        if (!state[EnumStoreSlice.LINE_ITEM_DETAIL]?.webSearch?.isSearching)
          dispatch(searchComparable({ insuredPrice, searchKey, pincode, isInit: true }));
        if (res?.data?.category?.id) {
          dispatch(fetchSubCategory(res?.data?.category?.id));
        }
        if (res?.data?.claimNumber) {
          dispatch(fetchRoom(res?.data?.claimNumber));
        }
      }
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const getPriceRange = (insuredPrice: number) => {
  const range = +insuredPrice * 0.2;
  const priceFrom = +insuredPrice - range;
  const priceTo = +insuredPrice + range;
  return { priceFrom, priceTo };
};

export const searchComparable = createAsyncThunk(
  "comparable/search",
  async (
    payload: {
      insuredPrice?: number;
      searchKey?: string;
      pincode?: number;
      startPrice?: number;
      endPrice?: number;
      isInit?: boolean;
      selectedEngine?: typeof WEB_SEARCH_ENGINES;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    const state = api.getState() as RootState;
    const dispatch = api.dispatch;
    try {
      let { startPrice: priceFrom, endPrice: priceTo } = payload;
      const selectedEngine =
        payload.selectedEngine ??
        state[EnumStoreSlice.LINE_ITEM_DETAIL].webSearch?.selectedEngine;
      const { isInit = false } = payload;
      const pageNo = 1; // initially pageno is 1
      if (isInit) {
        if (!priceFrom && !priceTo) {
          const calculatedPrice = getPriceRange(payload.insuredPrice ?? 0);
          priceFrom = +calculatedPrice.priceFrom.toFixed(2);
          priceTo = +calculatedPrice.priceTo.toFixed(2);
        }
      }
      dispatch(
        updateWebsearch({
          ...payload,
          priceFrom,
          priceTo,
          pageNo,
          isSearching: true,
          searchList: [],
          selectedEngine,
        })
      );
      const api_payload: searchComparableReq = {
        item:
          payload.searchKey ??
          state[EnumStoreSlice.LINE_ITEM_DETAIL]?.webSearch?.searchKey,
        id: selectedEngine.id,
        numberOfCounts: 10,
        priceFrom: priceFrom ?? 0,
        pincode:
          payload.pincode ?? state[EnumStoreSlice.LINE_ITEM_DETAIL]?.webSearch?.pincode,
        pageNo: pageNo ?? state[EnumStoreSlice.LINE_ITEM_DETAIL]?.webSearch?.pageNo,
        serfWowSearch: true,
        ids: [1],
      };
      if (priceTo) {
        api_payload.priceTo = priceTo ?? 0;
      }
      const res = await fetchComparable(api_payload, true);
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteCustomItem = createAsyncThunk(
  "comparable/delete",
  async (comaprableItem: unknownObjectType, api) => {
    const rejectWithValue = api.rejectWithValue;
    const dispatch = api.dispatch;
    try {
      const res = await removeCustomComparable(comaprableItem.id);
      if (res.status === 200) {
        dispatch(fetchLineItemDetail({ itemId: comaprableItem?.originalItemId }));
        return;
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
