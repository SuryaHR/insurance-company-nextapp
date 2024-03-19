import { unknownObjectType } from "@/constants/customTypes";
import selectLineItemDetailState from "./selectLineItemDetailState";
import { createSelector } from "@reduxjs/toolkit";

const selectActiveComparable = createSelector([selectLineItemDetailState], (state) => {
  if (state.comparableItems) {
    return state.comparableItems?.filter((item: unknownObjectType) => !item.isDelete);
  }
  return state.comparableItems;
});

export default selectActiveComparable;
