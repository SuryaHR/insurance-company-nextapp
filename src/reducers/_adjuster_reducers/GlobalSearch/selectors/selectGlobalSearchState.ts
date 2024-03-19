import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import selectRootState from "@/reducers/selectRootState";
import { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";

const selectGlobalSearchState = createSelector(
  [selectRootState],
  (rootState: RootState) => get(rootState, EnumStoreSlice.GLOBAL_SEARCH)
);

export default selectGlobalSearchState;
