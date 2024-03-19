import selectRootState from "@/reducers/selectRootState";
import { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";

const selectClaimContentdataState = createSelector(
  [selectRootState],
  (rootState: RootState) => get(rootState, "claimContentdata")
);
export default selectClaimContentdataState;
