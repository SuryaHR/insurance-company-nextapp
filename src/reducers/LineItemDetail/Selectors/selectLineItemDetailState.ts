import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import selectRootState from "@/reducers/selectRootState";
import { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";

const selectLineItemDetailState = createSelector(
  [selectRootState],
  (rootState: RootState) => get(rootState, EnumStoreSlice.LINE_ITEM_DETAIL)
);
export default selectLineItemDetailState;
