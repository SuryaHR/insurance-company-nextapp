import { WEB_SEARCH_ENGINES } from "@/constants/constants";
import { unknownObjectType } from "@/constants/customTypes";

import { createSlice } from "@reduxjs/toolkit";
import EnumStoreSlice from "../EnumStoreSlice";
import {
  fetchCondition,
  fetchLineItemCatergory,
  fetchLineItemDetail,
  fetchRetailersDetails,
  fetchRoom,
  fetchSubCategory,
  searchComparable,
} from "./LineItemThunkService";

const initialState: unknownObjectType = {
  isLoading: true,
  isFetching: false,
  lineItem: null,
  comparableItems: null,
  replacementItem: null,
  subCategory: [],
  category: [],
  condition: [],
  room: [],
  retailer: [],
  paymentTypes: [],
  webSearch: {
    isSearching: false,
    insuredPrice: 0,
    priceFrom: 0,
    priceTo: 0,
    pageNo: 1,
    searchKey: "",
    searchList: [],
    noFurtherData: false,
    selectedEngine: WEB_SEARCH_ENGINES.filter((engine) => engine.default)[0],
  },
};

const LineItemDetailSlice = createSlice({
  initialState,
  name: EnumStoreSlice.LINE_ITEM_DETAIL,
  reducers: {
    resetLineItemDetail() {
      return initialState;
    },
    updateLineItem(state, action) {
      state.lineItem = { ...state.lineItem, ...action.payload };
    },
    updateWebsearch(state, action) {
      const payload = action.payload;
      // const {
      //   insuredPrice,
      //   searchKey,
      //   selectedEngine,
      //   priceFrom = 0,
      //   priceTo = 0,
      //   pageNo = 1,
      // } = payload;
      // if (selectedEngine) {
      //   state.webSearch.selectedEngine = selectedEngine;
      // }

      state.webSearch = {
        ...state.webSearch,
        ...payload,
      };
    },
    updateOnCategoryChange(state, action) {
      const { payload } = action;
      if (payload) {
        state.lineItem.category = {
          ...state.lineItem.category,
          id: payload.categoryId,
          name: payload.categoryName,
          description: payload.description,
        };
      } else {
        state.lineItem.category = null;
      }
      state.lineItem.subCategory = null;
      state.subCategory = [];
    },
    updateOnSubCategoryChange(state, action) {
      const { payload } = action;
      if (payload)
        state.lineItem.subCategory = {
          ...state.lineItem.subCategory,
          id: payload.id,
          name: payload.name,
        };
      else state.lineItem.subCategory = null;
    },
    updateReplacementItem(state, action) {
      const { payload } = action;
      state.replacementItem = { ...state.replacementItem, ...payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchLineItemDetail.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchLineItemDetail.fulfilled, (state, action) => {
      const { payload } = action;
      state.isFetching = false;
      state.isLoading = false;
      if (payload.status === 200) {
        let tempComparable = null;
        let tempReplacement = null;
        if (payload?.data?.comparableItems) {
          tempComparable = [];
          for (const item of payload.data.comparableItems) {
            if (item?.isReplacementItem) {
              tempReplacement = item;
            } else {
              tempComparable.push(item);
            }
          }
        }
        // state.comparableItems = payload.data?.comparableItems?.filter();
        state.comparableItems = tempComparable;
        state.replacementItem = tempReplacement;
        delete payload?.data?.comparableItems;
        state.lineItem = payload.data;
      }
    });
    builder.addCase(fetchLineItemDetail.rejected, (state) => {
      state.isFetching = false;
      state.isLoading = false;
      state.lineItem = initialState.lineItem;
    });
    builder.addCase(searchComparable.pending, (state) => {
      state.webSearch.isSearching = true;
      state.webSearch.noFurtherData = false;
    });
    builder.addCase(searchComparable.fulfilled, (state, action) => {
      state.webSearch.isSearching = false;
      const payload = action.payload;
      if (payload.status === 200) {
        state.webSearch.searchList = payload.data?.searchResults ?? [];
        if (!payload?.data) {
          state.webSearch.noFurtherData = true;
        }
      }
    });
    builder.addCase(searchComparable.rejected, (state) => {
      state.webSearch.isSearching = false;
    });
    builder.addCase(fetchSubCategory.pending, (state) => {
      state.subCategory = [];
    });
    builder.addCase(fetchSubCategory.fulfilled, (state, action) => {
      state.subCategory = action.payload;
    });
    builder.addCase(fetchSubCategory.rejected, (state) => {
      state.subCategory = [];
    });
    builder.addCase(fetchLineItemCatergory.pending, (state) => {
      state.category = [];
    });
    builder.addCase(fetchLineItemCatergory.fulfilled, (state, action) => {
      state.category = action.payload;
    });
    builder.addCase(fetchLineItemCatergory.rejected, (state) => {
      state.category = [];
    });
    builder.addCase(fetchCondition.pending, (state) => {
      state.condition = [];
    });
    builder.addCase(fetchCondition.fulfilled, (state, action) => {
      state.condition = action.payload;
    });
    builder.addCase(fetchCondition.rejected, (state) => {
      state.condition = [];
    });
    builder.addCase(fetchRoom.pending, (state) => {
      state.room = [];
    });
    builder.addCase(fetchRoom.fulfilled, (state, action) => {
      state.room = action.payload;
    });
    builder.addCase(fetchRoom.rejected, (state) => {
      state.room = [];
    });

    builder.addCase(fetchRetailersDetails.pending, (state) => {
      state.retailer = [];
      state.paymentTypes = [];
    });
    builder.addCase(fetchRetailersDetails.fulfilled, (state, action) => {
      const { paymentTypes = [], retailers = [] } = action.payload;
      state.retailer = retailers;
      state.paymentTypes = paymentTypes
        ? paymentTypes.map((_type: string) => ({ label: _type, value: _type }))
        : paymentTypes;
    });
    builder.addCase(fetchRetailersDetails.rejected, (state) => {
      state.retailer = [];
      state.paymentTypes = [];
    });
  },
});

export default LineItemDetailSlice;
export const {
  resetLineItemDetail,
  updateWebsearch,
  updateOnCategoryChange,
  updateLineItem,
  updateOnSubCategoryChange,
  updateReplacementItem,
} = LineItemDetailSlice.actions;
