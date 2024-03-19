import { createSelector } from "@reduxjs/toolkit";
import selectGlobalSearchState from "./selectGlobalSearchState";
import { initialGlobalSearchStateType, searchDataType } from "../GlobalSearchSlice";

const selectGlobalSearchCount = createSelector(
  [selectGlobalSearchState],
  (state: initialGlobalSearchStateType) => {
    const data: searchDataType = { ...state.data };
    const res = Object.keys(data).reduce((acc, tab) => {
      return { ...acc, [tab]: data[tab as keyof searchDataType]?.length ?? 0 };
    }, {});
    return res as searchDataType;
  }
);

export default selectGlobalSearchCount;
