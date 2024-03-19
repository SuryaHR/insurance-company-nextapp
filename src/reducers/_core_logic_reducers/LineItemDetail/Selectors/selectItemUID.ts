import selectLineItemDetailState from "./selectLineItemDetailState";
import { createSelector } from "@reduxjs/toolkit";

const selectItemUID = createSelector([selectLineItemDetailState], (state) => {
  return state?.lineItem?.itemUID;
});

export default selectItemUID;
