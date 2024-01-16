import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import selectRootState from "@/reducers/selectRootState";
import { initialSessionState } from "@/reducers/Session/SessionSlice";
import { RootState } from "@/store/store";

const selectSessionState = createSelector([selectRootState], (rootState: RootState) =>
  get(rootState, EnumStoreSlice.SESSION, initialSessionState)
);

export default selectSessionState;
