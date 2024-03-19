import { createSelector } from "@reduxjs/toolkit";
import selectClaimContentState from "./selecClaimContentState";

const selectTotalCashPayoutExposure = createSelector(
  [selectClaimContentState],
  (claimContentdata) => {
    const filteredclaimContentListData =
      claimContentdata?.claimContentListDataFull.filter((claimContentListData: any) => {
        if (claimContentListData?.cashPayoutExposure) {
          return claimContentListData;
        }
      });
    const cashPayoutExposureTotal = filteredclaimContentListData.reduce(
      (accumulator: any, { cashPayoutExposure }: any) => accumulator + cashPayoutExposure,
      0
    );
    return cashPayoutExposureTotal;
  }
);
export default selectTotalCashPayoutExposure;
