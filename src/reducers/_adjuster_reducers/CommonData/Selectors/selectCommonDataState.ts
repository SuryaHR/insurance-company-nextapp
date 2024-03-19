import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import selectRootState from "@/reducers/selectRootState";
import { RootState } from "@/store/store";
import { initialCommonDataState } from "../CommonDataSlice";

const selectCommonDataState = createSelector([selectRootState], (rootState: RootState) =>
  get(rootState, EnumStoreSlice.COMMON_DATA, initialCommonDataState)
);

export default selectCommonDataState;
