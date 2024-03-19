import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import selectRootState from "@/reducers/selectRootState";
import { RootState } from "@/store/store";
import { initialAdjusterDashboardState } from "../AdjusterDashboardSlice";

const selectAdjusterDashboardState = createSelector(
  [selectRootState],
  (rootState: RootState) =>
    get(rootState, EnumStoreSlice.ADJUSTER_DASHBOARD, initialAdjusterDashboardState)
);

export default selectAdjusterDashboardState;
