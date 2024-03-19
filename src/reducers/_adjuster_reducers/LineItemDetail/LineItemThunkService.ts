import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteAttachment,
  getLineItemCategory,
  getLineItemCondition,
  getLineItemRetailers,
  getLineItemRoom,
  getLineItemSubCategory,
  handleLineItemSave,
  removeCustomComparable,
} from "@/services/_adjuster_services/AdjusterMyClaimServices/LineItemDetailService";
import {
  fetchClaimItemDetails,
  fetchComparable,
  searchComparableReq,
} from "@/services/_adjuster_services/AdjusterMyClaimServices/LineItemDetailService";
import { RootState } from "@/store/store";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { WEB_SEARCH_ENGINES } from "@/constants/constants";
import {
  removeSearchItem,
  resetLineItemDetail,
  updateOnSubCategoryChange,
  updateWebsearch,
} from "./LineItemDetailSlice";
import { unknownObjectType } from "@/constants/customTypes";
import { addNotification } from "../Notification/NotificationSlice";
import selectTotalComparables from "./Selectors/selectTotalComparables";
import { getFileExtension, parseFloatWithFixedDecimal } from "@/utils/utitlity";
import { calculateRCV } from "@/components/_adjuster_components/AdjusterLineItemComponent/helper";
import { getPolicyInfo } from "@/services/_adjuster_services/ClaimService";
import selectCRN from "@/reducers/Session/Selectors/selectCRN";

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
  async (
    {
      itemId,
      refresh = false,
      clbk,
    }: { itemId: number; refresh?: boolean; clbk?: (args: unknownObjectType) => void },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    const dispatch = api.dispatch;
    if (refresh) {
      dispatch(resetLineItemDetail());
    }
    try {
      const res = await fetchClaimItemDetails({ itemId }, true);
      if (res.status === 200) {
        const insuredPrice = res.data.insuredPrice;
        const searchKey = res.data.description;
        const pincode = res.data.policyHolderPinCode;
        dispatch(searchComparable({ insuredPrice, searchKey, pincode, isInit: true }));
        if (res?.data?.category?.id) {
          dispatch(fetchSubCategory(res?.data?.category?.id));
        }
        if (res?.data?.claimNumber) {
          dispatch(fetchRoom(res?.data?.claimNumber));
          dispatch(
            getPolicyHolderDetail({
              policyNumber: null,
              claimNumber: res?.data?.claimNumber,
            })
          );
        }
        clbk && clbk(res?.data);
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

export let searchComparableAbortController: AbortController;
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
      if (searchComparableAbortController) {
        const reason = new DOMException("Duplicate Request", "AbortError");
        searchComparableAbortController?.abort(reason);
      }
      searchComparableAbortController = new AbortController();
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
      const res = await fetchComparable(
        api_payload,
        true,
        searchComparableAbortController
      );
      if (res.data.searchResults != null && res.data.searchResults.length != 0) {
        const listgooleComparable = [];
        for (const item of res.data.searchResults) {
          let price: string = "0.0";
          if (item.itemPrice) {
            if (item.itemPrice.toString().indexOf("$") > -1) {
              price = item.itemPrice.split("$")[1];
              price = price?.replace(",", "");
            } else if (item.itemPrice.toString().indexOf("₹") > -1) {
              price = item.itemPrice.split("₹")[1];
              price = price?.includes(" ") ? price?.split(" ")[0] : price;
              price = price?.replace(",", "");
            } else price = item.itemPrice;
          } else price = item.price;

          listgooleComparable.push({
            id: null,
            isvendorItem: false,
            rating: item.rating,
            description: item.description,
            brand: null,
            model: null,
            price: parseFloat(price),
            buyURL: item.itemURL,
            merchant: item.merchant,
            isDataImage: true,
            supplier: null,
            imageURL: item.itemImage ? item.itemImage : item.base64ImageUrl,
          });
        }
        return listgooleComparable;
      }
      return [];
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

export const removeAttachment = createAsyncThunk(
  "attachment/remove",
  async (payload: { id: number; callback: () => void }, api) => {
    const { id, callback } = payload;
    const dispatch = api.dispatch;
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await deleteAttachment({ id });
      callback();
      if (res?.status === 200) {
        dispatch(
          addNotification({
            message: res?.message,
            id: `success_${id}`,
            status: "success",
          })
        );
        return { id };
      }
      dispatch(
        addNotification({
          message: res?.message,
          id: `error_${id}`,
          status: "error",
        })
      );
      return rejectWithValue({ id });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveComparable = createAsyncThunk(
  "comparable/save",
  async (
    payload: {
      comparableArr?: unknownObjectType[];
      tempLineItem?: unknownObjectType;
      isReplacement?: boolean;
      attachmentList?: File[];
      customRetailer?: { name: string } | null;
      callback?: (data?: unknownObjectType) => void;
    },
    api
  ) => {
    const { comparableArr, tempLineItem, callback, attachmentList, customRetailer } =
      payload;
    const rejectWithValue = api.rejectWithValue;
    const dispatch = api.dispatch;
    try {
      const state = api.getState() as RootState;
      const CRN = selectCRN(state);
      let comparables = selectTotalComparables(state);
      if (comparableArr) {
        comparables = comparableArr;
      }
      let lineItem = { ...state.lineItemDetail.lineItem };
      if (tempLineItem) {
        lineItem = { ...tempLineItem };
      }
      const ComparableList: any[] = [];
      if (comparables) {
        comparables.forEach((item: unknownObjectType) => {
          const desc = item.isReplacementItem
            ? lineItem.adjusterDescription
            : item.description;

          if (item?.isReplacementItem) {
            lineItem["replacementQty"] = item?.quantity
              ? item?.quantity
              : lineItem.quantity;
          }

          const tempComparable = {
            id: item.id,
            originalItemId: lineItem.id,
            isvendorItem: item.isvendorItem,
            description: desc && desc != "" ? encodeURIComponent(desc) : "",
            itemName: lineItem.itemName,
            quantity: item.isReplacementItem ? lineItem.replacementQty : item.quantity,
            unitPrice: item.isReplacementItem
              ? lineItem.replacedItemPrice
              : item.unitPrice,
            price: item.isReplacementItem ? lineItem.replacedItemPrice : item.price,
            taxRate: item.taxRate,
            brand: item.brand,
            model: item.model,
            supplier: item.supplier,
            supplierWebsite: item.isReplacementItem ? lineItem.source : item.buyURL,
            itemType: lineItem.itemType,
            isReplacementItem: item.isReplacementItem,
            buyURL: item.isReplacementItem ? lineItem.source : item.buyURL,
            isDataImage: item.isDataImage,
            imageData: item.imageData ? item.imageData : item.imageURL,
            imageURL: item.imageData ? item.imageData : item.imageURL,
            isDelete: item.isDelete ? true : false,
            replacementItemUID: item.replacementItemUID,
            rating: item.rating,
            customItem: item.customItem,
            isCustomItem: item.isCustomItem,
          };
          ComparableList.push(tempComparable);
        });
      }
      let scheduleAmount = lineItem.scheduleAmount;
      if (lineItem.isScheduledItem == false) {
        scheduleAmount = 0;
      }
      let appraisalValue = lineItem.appraisalValue;
      if (
        lineItem.category &&
        lineItem.subCategory &&
        lineItem.category.name != "jewelry"
      ) {
        appraisalValue = 0;
      }
      const param = new FormData();
      // get the attachments
      if (attachmentList?.length) {
        const filesDetails: unknownObjectType[] = [];
        attachmentList?.forEach((itemFile) => {
          const itemFileDetail = {
            fileName: itemFile.name,
            fileType: itemFile.type,
            extension: getFileExtension(itemFile),
            filePurpose: "ITEM",
            latitude: null,
            longitude: null,
            footNote: null,
          };
          filesDetails.push(itemFileDetail);
          param.append("file", itemFile);
        });
        param.append("filesDetails", JSON.stringify(filesDetails));
      }
      const payload = {
        registrationNumber: CRN,
        comparableItems: ComparableList,
        claimItem: {
          acv: lineItem.acv,
          acvTax: lineItem.acvTax,
          acvTotal: lineItem.acvTotal,
          adjusterDescription:
            lineItem.adjusterDescription && lineItem.adjusterDescription != ""
              ? encodeURIComponent(lineItem.adjusterDescription)
              : "",
          source: lineItem.source,
          ageMonths: lineItem.ageMonths,
          ageYears: lineItem.ageYears,
          appraisalDate: null,
          appraisalValue: appraisalValue,
          approvedItemValue: lineItem.approvedItemValue,
          assignedTo: lineItem.assignedTo,
          brand: lineItem.brand,
          category: lineItem.category
            ? {
                annualDepreciation: lineItem.category.annualDepreciation
                  ? lineItem.category.annualDepreciation
                  : null,
                id: lineItem.category.id ? lineItem.category.id : null,
                name: lineItem.category.name ? lineItem.category.name : null,
                usefulYears: lineItem.category.usefulYears
                  ? lineItem.category.usefulYears
                  : null,
                aggregateLimit: null,
                description: null,
              }
            : null,
          categoryLimit: lineItem.categoryLimit,
          claimId: lineItem.claimId,
          claimNumber: lineItem.claimNumber,
          dateOfPurchase: lineItem.dateOfPurchase,
          depriciationRate: lineItem.depriciationRate,
          description:
            lineItem.description && lineItem.description != ""
              ? encodeURIComponent(lineItem.description)
              : "",
          applyTax: lineItem.applyTax,
          holdOverPaymentDate: lineItem.holdOverPaymentDate,
          holdOverPaymentMode: lineItem.holdOverPaymentMode,
          holdOverPaymentPaidAmount: lineItem.holdOverPaymentPaidAmount,
          itemOverage: lineItem.itemOverage,
          scheduleAmount: scheduleAmount,
          deductibleAmount: lineItem.deductibleAmount,
          individualLimitAmount: lineItem.individualLimitAmount,
          totalStatedAmount: lineItem.totalStatedAmount,
          id: lineItem.id,
          itemUID: lineItem.itemUID,
          insuredPrice: lineItem.insuredPrice > 0 ? lineItem.insuredPrice : 0,
          isReplaced: lineItem.isReplaced,
          replacementQty: lineItem?.replacementQty,
          replacedItemPrice: lineItem.replacedItemPrice,
          isScheduledItem: lineItem.isScheduledItem,
          itemName: lineItem.itemName,
          itemType: lineItem.itemType,
          itemUsefulYears: lineItem.itemUsefulYears,
          model: lineItem.model,
          paymentDetails: lineItem.paymentDetails,
          quantity: lineItem.quantity > 0 ? lineItem.quantity : 0,
          quotedPrice: lineItem.quotedPrice,
          rcv: lineItem.rcv,
          rcvTax: lineItem.rcvTax,
          rcvTotal: lineItem.rcvTotal,
          receiptValue: lineItem.receiptValue > 0 ? lineItem.receiptValue : 0,
          depreciationAmount:
            lineItem.depreciationAmount > 0 ? lineItem.depreciationAmount : 0,
          status: {
            id: lineItem.status ? lineItem.status.id : null,
            status: lineItem.status ? lineItem.status.status : null,
          },
          subCategory: lineItem.subCategory
            ? {
                annualDepreciation: lineItem.subCategory.annualDepreciation
                  ? lineItem.subCategory.annualDepreciation
                  : null,
                id: lineItem.subCategory.id ? lineItem.subCategory.id : null,
                name: lineItem.subCategory.name ? lineItem.subCategory.name : null,
                usefulYears: lineItem.subCategory.usefulYears
                  ? lineItem.subCategory.usefulYears
                  : null,
                description: null,
                aggregateLimit: null,
              }
            : null,
          condition: {
            conditionId: lineItem?.condition?.conditionId ?? null,
            conditionName: lineItem?.condition?.conditionName ?? null,
          },
          taxRate: lineItem.taxRate,
          totalTax: lineItem.totalTax,
          valueOfItem: lineItem.valueOfItem,
          vendorDetails: lineItem.vendorDetails,
          yearOfManufecturing: lineItem.yearOfManufecturing,
          shippingDate: null,
          shippingMethod: {
            id: lineItem.shippingMethod ? lineItem.shippingMethod.id : null,
          },
          originallyPurchasedFrom:
            lineItem.originallyPurchasedFrom ?? customRetailer ?? null,
          room: lineItem.room,
          giftedFrom: lineItem.giftedFrom ? lineItem.giftedFrom : null,
          purchaseMethod: lineItem.purchaseMethod ? lineItem.purchaseMethod?.value : null,
          videoLink: lineItem.videoLink ? lineItem.videoLink : null,
          cashPayoutExposure: lineItem.cashPayoutExposure,
          replacementExposure: lineItem.replacementExposure,
          maxHoldover: lineItem.maxHoldover,
          itemNumber: lineItem?.itemNumber,
        },
      };
      param.append("itemDetails", JSON.stringify(payload));
      const res = await handleLineItemSave(param);
      callback && callback(res);
      if (res.status === 200) {
        dispatch(
          addNotification({
            message: "Item # " + lineItem?.itemNumber + " details successfully updated",
            id: new Date().valueOf(),
            status: "success",
          })
        );
      }
      return res;
    } catch (error) {
      callback && callback();
      console.log("Save_err", error);
      return rejectWithValue(error);
    }
  }
);

export const addtoComparableList = createAsyncThunk(
  "comparable/add",
  async (
    {
      item,
      index,
      isReplacement = false,
      acceptStandardCost = false,
      attachmentList = [],
      clbk,
    }: {
      item: unknownObjectType | null;
      attachmentList?: File[];
      index?: number;
      isReplacement?: boolean;
      acceptStandardCost?: boolean;
      clbk?: () => void;
    },
    api
  ) => {
    const rejectWithValue = api.rejectWithValue;
    const dispatch = api.dispatch;
    const state = api.getState() as RootState;
    item = Object.assign({}, item);
    item.isReplacementItem = false;
    item.isDelete = false;
    try {
      let comparableItems = selectTotalComparables(state);
      if (!comparableItems) {
        comparableItems = [];
      }
      if (item) {
        item["supplier"] = item.merchant;
      }
      if (!isReplacement) {
        comparableItems.push(item);
        dispatch(
          saveComparable({
            comparableArr: comparableItems,
            attachmentList,
            callback: () => {
              if (index === 0 || index) {
                dispatch(removeSearchItem({ index }));
              }
              clbk && clbk();
            },
          })
        );
      } else if (acceptStandardCost) {
        const ItemDetails = Object.assign({}, state.lineItemDetail.lineItem);
        ItemDetails.replacedItemPrice = ItemDetails.standardCost;
        ItemDetails.replacementQty = ItemDetails.quantity;
        ItemDetails.rcv = ItemDetails.standardCost;
        ItemDetails.adjusterDescription = ItemDetails.standardDescription;
        ItemDetails.source = ItemDetails.standardItemSource;
        ItemDetails.isReplacementItem = true;
        ItemDetails.isReplaced = true;
        const newLineItem = calculateRCV(ItemDetails, null, true);
        comparableItems = comparableItems.map((oldItem: unknownObjectType) => ({
          ...oldItem,
          isReplacementItem: false,
        }));
        dispatch(
          saveComparable({
            comparableArr: comparableItems,
            tempLineItem: newLineItem,
            isReplacement: true,
            attachmentList,
            callback: () => {
              clbk && clbk();
            },
          })
        );
      } else {
        const ItemDetails = Object.assign({}, state.lineItemDetail.lineItem);
        if (ItemDetails) {
          const subcategory = ItemDetails.subCategory;
          if (subcategory.associateSubCat && subcategory.associateSubCat != "") {
            if (
              item.price < subcategory.minPricePoint ||
              item.price > subcategory.maxPricePoint
            ) {
              const subcat = state.lineItemDetail.subCategory.find(
                (x: unknownObjectType) =>
                  x.associateSubCat == subcategory.associateSubCat &&
                  x.id != subcategory.id
              );
              if (subcat) {
                ItemDetails.subCategory = subcat;
              }
            }
          }
          ItemDetails.replacedItemPrice = parseFloatWithFixedDecimal(item.price);
          comparableItems = comparableItems
            .filter((comp) => comp.id != item?.id)
            .map((oldItem: unknownObjectType) => ({
              ...oldItem,
              isReplacementItem: false,
            }));
          item.isReplacementItem = true;
          comparableItems.push(item);
          ItemDetails.isReplaced = true;
          ItemDetails.adjusterDescription = item.description;
          ItemDetails.source = item.buyURL;
          const newLineItem = calculateRCV(ItemDetails, item);
          dispatch(
            saveComparable({
              comparableArr: comparableItems,
              tempLineItem: newLineItem,
              isReplacement: true,
              attachmentList,
              callback: () => {
                if (index === 0 || index) {
                  dispatch(removeSearchItem({ index }));
                }
                clbk && clbk();
              },
            })
          );
        }
      }
    } catch (error) {
      console.log("addtoComparableList_error", error);
      clbk && clbk();
      return rejectWithValue(error);
    }
  }
);

export const removeReplacement = createAsyncThunk(
  "comparable/removeReplacement",
  async (
    payload: { item: unknownObjectType; attachmentList?: File[]; clbk?: () => void },
    api
  ) => {
    const { attachmentList = [], clbk = () => {} } = payload;
    const rejectWithValue = api.rejectWithValue;
    const dispatch = api.dispatch;
    const state = api.getState() as RootState;
    try {
      const ItemDetails = { ...state.lineItemDetail.lineItem };
      const item = { ...payload.item };
      const comparableItem: any[] = Object.assign([], selectTotalComparables(state));
      if (item) {
        const index = comparableItem.findIndex(
          (comp: unknownObjectType) => comp.id === item.id
        );

        item.isReplacementItem = false;
        item.isDelete = false;
        // comparableItem.push(item);
        ItemDetails.adjusterDescription = "";
        ItemDetails.source = "";
        ItemDetails.replacedItemPrice = "";
        ItemDetails.replacementQty = "";
        ItemDetails.totalTax = "";
        ItemDetails.rcv = 0;
        ItemDetails.rcvTotal = 0;
        ItemDetails.status = ItemDetails.previousStatus;
        comparableItem[index] = item;
      } else {
        ItemDetails.adjusterDescription = "";
        ItemDetails.source = "";
        ItemDetails.replacedItemPrice = 0;
        ItemDetails.replacementQty = "";
        ItemDetails.totalTax = "";
        ItemDetails.rcvTotal = 0;
        ItemDetails.rcv = 0;
        ItemDetails.acv = "";
        ItemDetails.status = ItemDetails.previousStatus;
      }
      ItemDetails.acv = 0;
      ItemDetails.isReplaced = false;
      const newItemDetails = calculateRCV(ItemDetails);
      newItemDetails.cashPayoutExposure = 0.0;
      newItemDetails.replacementExposure = 0.0;
      dispatch(
        saveComparable({
          comparableArr: comparableItem,
          tempLineItem: ItemDetails,
          isReplacement: false,
          attachmentList,
          callback: clbk,
        })
      );
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveSubCategoryChange = createAsyncThunk(
  "subCategory/save",
  async (payload: { subCategory: unknownObjectType | null; clbk: () => void }, api) => {
    const { subCategory = null, clbk } = payload;
    const state = api.getState() as RootState;
    const dispatch = api.dispatch;
    const rejectWithValue = api.rejectWithValue;
    try {
      let ItemDetails = Object.assign({}, state.lineItemDetail.lineItem);
      ItemDetails.subCategory = subCategory;
      if (subCategory) {
        ItemDetails.depriciationRate = subCategory.annualDepreciation;
        ItemDetails.itemUsefulYears = subCategory.usefulYears;
        ItemDetails = calculateRCV(ItemDetails, state.lineItemDetail.replacementItem);
      }
      dispatch(
        updateOnSubCategoryChange({
          subCategory: subCategory,
          newLineItem: ItemDetails,
        })
      );
      dispatch(
        saveComparable({
          tempLineItem: ItemDetails,
          callback: () => {
            clbk && clbk();
          },
        })
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getPolicyHolderDetail = createAsyncThunk(
  "policyHolder/data",
  async (payload: { policyNumber: string | null; claimNumber: string }, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await getPolicyInfo(payload);
      return res;
    } catch (err) {
      rejectWithValue(err);
    }
  }
);
