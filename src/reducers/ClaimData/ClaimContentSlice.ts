import { claimContentListV2 } from "@/services/ClaimContentListService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  claimContentListDataFull: [],
  claimContentListData: [],
  claimErrorMsg: "",
  searchKeyword: "",
  editItemDetail: {},
  previousItem: false,
  nextItem: false,
};
export const fetchClaimContentAction = createAsyncThunk(
  "claimContent/fetchData",
  async (payload: { claimId: string }, api) => {
    const rejectWithValue = api.rejectWithValue;
    try {
      const res = await claimContentListV2(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const ClaimContentSlice = createSlice({
  initialState,
  name: "claimContentdata",
  reducers: {
    addClaimContentListData(state, action) {
      const { payload } = action;
      const { claimContentData } = payload;

      let newArr = {};
      const claimRes: any = [];
      if (claimContentData.data) {
        console.log("claimContentData", claimContentData);
        claimContentData.data.map((item: any) => {
          newArr = {
            ...item,
            statusName: item.status?.status ?? null,
            categoryName: item.category?.name ?? null,
            selected: false,
            itemId: item.id,
          };
          claimRes.push(newArr);
        });
        state.claimContentListDataFull = claimRes;
        state.claimContentListData = claimRes;
        state.claimErrorMsg = "";
      } else {
        state.claimErrorMsg = claimContentData.message;
      }
    },
    updateClaimContentListData(state, action) {
      const { payload } = action;
      const { claimContentList } = payload;
      state.claimContentListData = claimContentList;
    },
    clearFilter(state) {
      state.claimContentListData = state.claimContentListDataFull;
    },
    deleteClaimContentListItem(state, action) {
      const { payload } = action;
      const { itemId } = payload;

      const claimContentListDataFull = state.claimContentListDataFull;
      const claimContentListData = state.claimContentListData;

      const newClaimContentListFull = claimContentListDataFull.filter((item: any) => {
        return item.itemId !== itemId;
      });
      const newClaimContentList = claimContentListData.filter((item: any) => {
        return item.itemId !== itemId;
      });

      state.claimContentListDataFull = newClaimContentListFull;
      state.claimContentListData = newClaimContentList;
    },
    addClaimListKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;

      state.searchKeyword = searchKeyword;
    },
    addEditItemDetail(state, action) {
      const { payload } = action;
      const { itemDetailData, previousItem, nextItem } = payload;

      const itemData = {
        claimId: itemDetailData.claimId,
        itemId: itemDetailData.id,
        itemUID: itemDetailData.itemUID,
        itemNumber: itemDetailData.itemNumber,
        description: itemDetailData.description,
        quantity: itemDetailData.quantity,
        insuredPrice: itemDetailData.insuredPrice,
        category: itemDetailData.category
          ? {
              categoryId: itemDetailData.category?.id,
              categoryName: itemDetailData.category?.name,
            }
          : null,
        subCategory: itemDetailData.subCategory,
        ageYears: itemDetailData.ageYears,
        ageMonths: itemDetailData.ageMonths,
        applyTax: itemDetailData.applyTax,
        room: itemDetailData.room,
        condition: itemDetailData.condition,
        originallyPurchasedFrom: itemDetailData.originallyPurchasedFrom,
        isScheduledItem: itemDetailData.isScheduledItem,
        scheduleAmount: itemDetailData.scheduleAmount,
        attachments: itemDetailData.attachments,
        selected: false,
      };
      state.editItemDetail = itemData;
      state.previousItem = previousItem;
      state.nextItem = nextItem;
    },

    updateClaimContentListFullData(state, action) {
      const { payload } = action;
      const { claimContentListFull } = payload;
      state.claimContentListDataFull = claimContentListFull;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchClaimContentAction.pending, (state) => {
      state.claimContentListData = [];
    });
    builder.addCase(fetchClaimContentAction.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload?.status === 200) {
        let newArr;
        const claimRes: any = [];

        payload.data.map((item: any) => {
          newArr = {
            ...item,
            statusName: item.status?.status ?? null,
            categoryName: item.category?.name ?? null,
            selected: false,
            itemId: item.id,
          };
          claimRes.push(newArr);
        });
        state.claimContentListData = claimRes;
        state.claimContentListDataFull = claimRes;
      }
    });
  },
});
export default ClaimContentSlice;

export const {
  addClaimContentListData,
  updateClaimContentListData,
  clearFilter,
  deleteClaimContentListItem,
  addClaimListKeyWord,
  addEditItemDetail,
  updateClaimContentListFullData,
} = ClaimContentSlice.actions;
