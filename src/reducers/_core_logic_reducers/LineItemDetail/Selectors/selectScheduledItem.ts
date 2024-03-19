import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectScheduledItem = createSelector([selectLineItemDetailState], (state) => {
  const scheduledItemData = {
    scheduleAmount: state?.lineItem?.scheduleAmount,
    isScheduledItem: state?.lineItem?.isScheduledItem,
  };
  return scheduledItemData;
});

export default selectScheduledItem;
