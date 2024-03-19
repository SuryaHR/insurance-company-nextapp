import { createSelector } from "@reduxjs/toolkit";
import selectClaimContentState from "./selecClaimContentState";

const selectClaimContentStatusValued = createSelector(
  [selectClaimContentState],
  (claimContentdata) => {
    const filteredClaimContent = claimContentdata?.claimContentListDataFull?.filter(
      (claimContentItem: any) => {
        if (
          claimContentItem?.replaced &&
          ["CREATED", "VALUED", "UNDER REVIEW"].includes(claimContentItem.status?.status)
        ) {
          return claimContentItem;
        }
      }
    );
    return filteredClaimContent;
  }
);

export default selectClaimContentStatusValued;
