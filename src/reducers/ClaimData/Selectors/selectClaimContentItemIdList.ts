import { createSelector } from "@reduxjs/toolkit";
import selectClaimContentdataState from "./selectClaimContentdataState";
import { unknownObjectType } from "@/constants/customTypes";

const selectClaimContentItemIdList = createSelector(
  [selectClaimContentdataState],
  (state) => {
    return state?.claimContentListData?.map((item: unknownObjectType) => item?.id);
  }
);

export default selectClaimContentItemIdList;
