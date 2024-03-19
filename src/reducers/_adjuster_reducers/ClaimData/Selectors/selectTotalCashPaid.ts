import { createSelector } from "@reduxjs/toolkit";
import selectClaimContentState from "./selecClaimContentState";

const selectTotalCashPaid = createSelector(
  [selectClaimContentState],
  (claimContentdata) => {
    const filteredclaimContentListData =
      claimContentdata?.claimContentListDataFull.filter((claimContentListData: any) => {
        if (claimContentListData?.cashPaid) {
          return claimContentListData;
        }
      });
    const cashPaidExposureTotal = filteredclaimContentListData.reduce(
      (accumulator: any, { cashPaid }: any) => accumulator + cashPaid,
      0
    );
    return cashPaidExposureTotal;
  }
);
export default selectTotalCashPaid;
