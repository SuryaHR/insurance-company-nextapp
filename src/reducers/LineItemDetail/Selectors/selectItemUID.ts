import selectLineItemDetailState from "./selectLineItemDetailState";
import { createSelector } from "@reduxjs/toolkit";

const selectItemUID = createSelector([selectLineItemDetailState], (state) => {
  console.log(">>>>>>>", state?.lineItem?.claimId);
  return state?.lineItem?.itemUID;
});

export default selectItemUID;
