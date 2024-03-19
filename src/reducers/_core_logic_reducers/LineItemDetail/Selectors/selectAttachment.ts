import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectAttachment = createSelector([selectLineItemDetailState], (state) => {
  return state?.attachmentList;
});

export default selectAttachment;
