import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  claimedItemsList: [],
  allClaimedItemsList: [],

  filteredClaimItemList: [],
  claimedItemsErrorMsg: "",
  searchKeyword: "",
  selectedCategory: "",

  totalCashPaid: 0,
  noOfHoldoverItems: 0,
  TotalHoldoverPaid: 0,
  TotalHoldoverDue: 0,
};

const ClaimedItemsSlice = createSlice({
  initialState,
  name: "claimedItems",
  reducers: {
    addClaimedItemsListData(state, action) {
      const { payload } = action;

      const { claimedData } = payload;
      let newArr = {};
      const claimRes: any = [];

      (state.totalCashPaid = 0),
        (state.noOfHoldoverItems = 0),
        (state.TotalHoldoverPaid = 0),
        (state.TotalHoldoverDue = 0);
      if (claimedData.data) {
        claimedData.data.itemReplacement.map((item: any) => {
          const subRowRes: any = [];
          const itemId = item.claimItem.id;
          if (item.claimItem.replaceItems) {
            let subRow = {};
            let recieptValueSum = 0;
            let maxReplacmentSum = 0;
            let cashPaidSum = 0;
            let handoverDueSum = 0;
            let handoverPaidSum = 0;
            item.claimItem.replaceItems.map((subItem: any) => {
              recieptValueSum += parseFloat(subItem.receiptValue || 0);
              maxReplacmentSum += parseFloat(subItem.replacementExposure || 0);
              cashPaidSum += parseFloat(subItem.cashPaid || 0);
              handoverDueSum += parseFloat(subItem.holdOverDue || 0);
              handoverPaidSum += parseFloat(subItem.holdOverPaid || 0);
              subRow = {
                ...subItem,
                holdOverPaymentPaidAmount: subItem.holdOverPaid,
                subRowId: subItem.id,
                subRow: true,
              };
              subRowRes.push(subRow);
            });
            const subTotalRow = {
              receiptValue: recieptValueSum,
              quantity: item.claimItem.quantity,
              replacementExposure: maxReplacmentSum,
              cashPaid: cashPaidSum,
              holdOverDue: handoverDueSum,
              holdOverPaymentPaidAmount: handoverPaidSum,
              totalRow: true,
            };
            subRowRes.push(subTotalRow);
          }
          newArr = {
            ...item.claimItem,
            statusFilter: item.claimItem.status?.status,
            categoryFilter: item.claimItem.category?.categoryName,
            itemId,
            selected: false,
            subRows: subRowRes,
          };

          if (
            item.claimItem.holdOverPaymentPaidAmount != null &&
            item.claimItem.holdOverPaymentPaidAmount != 0
          ) {
            state.noOfHoldoverItems++;
          }
          state.totalCashPaid +=
            item.claimItem.cashPaid !== null ? parseFloat(item.claimItem.cashPaid) : 0;
          state.TotalHoldoverDue +=
            item.claimItem.holdOverDue != null
              ? parseFloat(item.claimItem.holdOverDue)
              : 0;
          state.TotalHoldoverPaid +=
            item.claimItem.holdOverPaymentPaidAmount != null
              ? parseFloat(item.claimItem.holdOverPaymentPaidAmount)
              : 0;
          claimRes.push(newArr);
        });

        state.claimedItemsList = claimRes;
        state.allClaimedItemsList = claimRes;
        state.claimedItemsErrorMsg = "";
      } else {
        state.claimedItemsErrorMsg = claimedData.message;
      }
    },
    addClaimedItemsKeyWord(state, action) {
      const { payload } = action;
      const { searchKeyword } = payload;

      state.searchKeyword = searchKeyword;
    },
    updateClaimedItemsListData(state, action) {
      const { payload } = action;
      const { claimedData } = payload;
      state.claimedItemsList = claimedData;
    },
    filteredClaimListData(state, action) {
      const { payload } = action;
      const { filteredata } = payload;
      state.filteredClaimItemList = filteredata;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});
export default ClaimedItemsSlice;

export const {
  addClaimedItemsListData,
  addClaimedItemsKeyWord,
  updateClaimedItemsListData,
  setSelectedCategory,
} = ClaimedItemsSlice.actions;
