import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import selectRootState from "@/reducers/selectRootState";
import { RootState } from "@/store/store";
import { initialCalimDetailState } from "../ClaimDetailSlice";

const selectClaimDetailState = createSelector([selectRootState], (rootState: RootState) =>
  get(rootState, EnumStoreSlice.CLAIM_DETAIL, initialCalimDetailState)
);

export default selectClaimDetailState;
