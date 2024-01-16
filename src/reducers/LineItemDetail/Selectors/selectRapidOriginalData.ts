import { createSelector } from "@reduxjs/toolkit";
import selectLineItemDetailState from "./selectLineItemDetailState";

const selectRapidOriginalData = createSelector([selectLineItemDetailState], (state) => {
  const rapidOriginalData = {
    description: state?.lineItem?.description,
    ageYears: state?.lineItem?.ageYears ?? 0,
    ageMonths: state?.lineItem?.ageMonths ?? 0,
    insuredPrice: state?.lineItem?.insuredPrice ?? 0,
    selectedCategory: state?.lineItem?.category,
    selectedSubCategory: state?.lineItem?.subCategory,
    selectedCondition: state?.lineItem?.condition,
  };
  return rapidOriginalData;
});

export default selectRapidOriginalData;
