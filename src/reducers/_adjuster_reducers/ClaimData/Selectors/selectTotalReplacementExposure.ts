import { createSelector } from "@reduxjs/toolkit";
import selectClaimContentState from "./selecClaimContentState";

const selectTotalReplacementExposure = createSelector(
  [selectClaimContentState],
  (claimContentdata) => {
    const filteredclaimContentListData =
      claimContentdata?.claimContentListDataFull.filter((claimContentListData: any) => {
        if (claimContentListData?.replacementExposure) {
          return claimContentListData;
        }
      });
    const replacementExposureTotal = filteredclaimContentListData.reduce(
      (accumulator: any, { replacementExposure }: any) =>
        accumulator + replacementExposure,
      0
    );
    return replacementExposureTotal;
  }
);
export default selectTotalReplacementExposure;
