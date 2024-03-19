import { createSelector } from "@reduxjs/toolkit";
import selectClaimContentState from "./selecClaimContentState";
import { unknownObjectType } from "@/constants/customTypes";

const selectClaimContentItemIdList = createSelector(
  [selectClaimContentState],
  (claimContentdata) => {
    return claimContentdata?.claimContentListData?.map(
      (item: unknownObjectType) => item?.id
    );
  }
);

export default selectClaimContentItemIdList;
