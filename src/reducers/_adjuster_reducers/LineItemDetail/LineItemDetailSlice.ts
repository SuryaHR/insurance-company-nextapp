import { WEB_SEARCH_ENGINES } from "@/constants/constants";
import { unknownObjectType } from "@/constants/customTypes";

import { createSlice } from "@reduxjs/toolkit";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import {
  fetchCondition,
  fetchLineItemCatergory,
  fetchLineItemDetail,
  fetchRetailersDetails,
  fetchRoom,
  fetchSubCategory,
  getPolicyHolderDetail,
  removeAttachment,
  saveComparable,
  searchComparable,
} from "./LineItemThunkService";
import { calculateRCV } from "@/components/_adjuster_components/AdjusterLineItemComponent/helper";
import { parseFloatWithFixedDecimal } from "@/utils/utitlity";

const initialState: unknownObjectType = {
  isLoading: true,
  isFetching: true,
  lineItem: null,
  comparableItems: null,
  replacementItem: null,
  subCategory: [],
  category: [],
  condition: [],
  room: [],
  retailer: [],
  paymentTypes: [],
  attachmentList: [],
  acceptedStandardCost: false,
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
  policyHolder: {},
};

const LineItemDetailSlice = createSlice({
  initialState,
  name: EnumStoreSlice.LINE_ITEM_DETAIL,
  reducers: {
    resetLineItemDetail() {
      return initialState;
    },
    updateLineItem(state, action) {
      const { payload } = action;
      state.lineItem = { ...state.lineItem, ...payload };
      if (
        payload["insuredPrice"] >= 0 ||
        payload["quantity"] >= 0 ||
        payload["ageYears"] >= 0 ||
        payload["ageMonths"] >= 0 ||
        payload["applyTax"] !== undefined ||
        payload["condition"] !== undefined
      ) {
        const newLineItem = calculateRCV(state.lineItem, state.replacementItem);
        state.lineItem = newLineItem;
        if (!isNaN(payload.insuredPrice) || !isNaN(payload.quantity)) {
          const totalStatedAmount = (
            (state.lineItem.insuredPrice ?? 0) * (state.lineItem.quantity ?? 0)
          ).toFixed(2);
          state.lineItem.totalStatedAmount = totalStatedAmount;
        }
        if (state.lineItem?.adjusterDescription) {
          state.lineItem.adjusterDescription = decodeURIComponent(
            state.lineItem.adjusterDescription
          );
        }
      }
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
      const newLineItem = calculateRCV(state.lineItem, state.replacementItem);
      state.lineItem = newLineItem;
    },
    updateOnSubCategoryChange(state, action) {
      const { payload } = action;
      const { subCategory = null, newLineItem = null } = payload;
      if (subCategory) {
        state.lineItem.subCategory = {
          ...state.lineItem.subCategory,
          ...subCategory,
        };
      } else state.lineItem.subCategory = null;
      // const newLineItem = calculateRCV(state.lineItem, state.replacementItem);
      state.lineItem = newLineItem;
    },
    updateReplacementItem(state, action) {
      const { payload } = action;
      if (state.replacementItem) {
        state.replacementItem = { ...state.replacementItem, ...payload };
      }
      // state.lineItem.rcv = parseFloatWithFixedDecimal(state.replacementItem.price);
      if (payload.unitPrice) {
        state.lineItem.replacedItemPrice = parseFloatWithFixedDecimal(payload.unitPrice);
      }
      if (payload.price) {
        state.lineItem.replacedItemPrice = parseFloatWithFixedDecimal(payload.unitPrice);
      }
      if (payload.quantity) {
        state.lineItem.replacementQty = payload.quantity;
      }
      if (payload.description) {
        state.lineItem.adjusterDescription = payload.description;
      }
      if (payload.buyURL) {
        state.lineItem.source = payload.buyURL;
      }
      const newLineItem = calculateRCV(state.lineItem, state.replacementItem);
      state.lineItem = newLineItem;
      if (state.lineItem?.adjusterDescription) {
        state.lineItem.adjusterDescription = decodeURIComponent(
          state.lineItem.adjusterDescription
        );
      }
    },
    removeComparableItem(state, action) {
      const { id } = action.payload;
      if (state.comparableItems) {
        state.comparableItems?.forEach((item: unknownObjectType) => {
          if (item.id === id) {
            item.isDelete = true;
          }
        });
      }
    },
    removeSearchItem(state, action) {
      const { index } = action.payload;
      state.webSearch?.searchList?.splice(index, 1);
    },
    updateLineItemStatus(state, action) {
      const { status } = action.payload;
      state.lineItem.previousStatus = state.lineItem.status;
      state.lineItem.status = status;
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
        if (
          !tempReplacement &&
          payload?.data?.isReplaced &&
          ["VALUED", "PARTIAL REPLACED", "PAID", "REPLACED", "SETTLED"].includes(
            payload.data?.status?.status
          )
        ) {
          state.acceptedStandardCost = true;
        } else {
          state.acceptedStandardCost = false;
        }
        state.comparableItems = tempComparable;
        state.replacementItem = tempReplacement;
        delete payload?.data?.comparableItems;
        const newLineItem = calculateRCV(
          payload?.data,
          tempReplacement,
          state.acceptedStandardCost
        );

        state.attachmentList = newLineItem?.attachments ?? [];
        delete newLineItem?.attachments;
        state.lineItem = newLineItem;
        state.lineItem.purchaseMethod = newLineItem?.purchaseMethod
          ? { value: newLineItem?.purchaseMethod, label: newLineItem?.purchaseMethod }
          : null;
        if (state.lineItem?.adjusterDescription) {
          state.lineItem.adjusterDescription = decodeURIComponent(
            state.lineItem.adjusterDescription
          );
        }
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
      state.webSearch.searchList = state.webSearch.searchList.concat(payload);
      state.webSearch.noFurtherData = true;
    });
    builder.addCase(searchComparable.rejected, (state, action) => {
      const { payload }: { payload: any } = action;
      if (payload && payload?.error?.code === 20) {
        state.webSearch.isSearching = true;
        return;
      }
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

    builder.addCase(removeAttachment.fulfilled, (state, action) => {
      const { id } = action.payload;
      state.attachmentList = state.attachmentList.filter(
        (attachment: any) => attachment.id !== id
      );
    });
    builder.addCase(saveComparable.fulfilled, (state, action) => {
      const payload = action.payload;
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
        if (
          !tempReplacement &&
          payload?.data?.claimItem?.isReplaced &&
          ["VALUED", "PARTIAL REPLACED", "PAID", "REPLACED", "SETTLED"].includes(
            payload.data?.claimItem?.status?.status
          )
        ) {
          state.acceptedStandardCost = true;
        } else {
          state.acceptedStandardCost = false;
        }
        // state.comparableItems = payload.data?.comparableItems?.filter();
        state.comparableItems = tempComparable;
        state.replacementItem = tempReplacement;
        delete payload?.data?.comparableItems;
        state.attachmentList = payload?.data?.claimItem?.attachments ?? [];
        delete payload?.data?.claimItem?.attachments;
        const newLineItem = calculateRCV(payload?.data?.claimItem, state.replacementItem);
        state.lineItem = newLineItem;
        state.lineItem.replacementQty = payload?.data?.claimItem?.replacementQty;
        state.lineItem.purchaseMethod = newLineItem?.purchaseMethod
          ? { value: newLineItem?.purchaseMethod, label: newLineItem?.purchaseMethod }
          : null;
        if (state.lineItem?.adjusterDescription) {
          state.lineItem.adjusterDescription = decodeURIComponent(
            state.lineItem.adjusterDescription
          );
        }
      }
    });
    builder.addCase(getPolicyHolderDetail.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        state.policyHolder = payload?.data;
      }
    });
    builder.addCase(getPolicyHolderDetail.rejected, (state) => {
      state.policyHolder = {};
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
  removeComparableItem,
  removeSearchItem,
  updateLineItemStatus,
} = LineItemDetailSlice.actions;
