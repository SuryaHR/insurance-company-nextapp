import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import selectRootState from "@/reducers/selectRootState";
import { RootState } from "@/store/store";
import { initialClaimContentState } from "../ClaimContentSlice";

const selectClaimContentState = createSelector(
  [selectRootState],
  (rootState: RootState) =>
    get(rootState, EnumStoreSlice.CLAIM_CONTENT_DATA, initialClaimContentState)
);

export default selectClaimContentState;
