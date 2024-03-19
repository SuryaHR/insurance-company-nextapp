import { createSelector } from "@reduxjs/toolkit";
import selectClaimContentState from "./selecClaimContentState";

const selectTotalHoldoverPaid = createSelector(
  [selectClaimContentState],
  (claimContentdata) => {
    const filteredclaimContentListData =
      claimContentdata?.claimContentListDataFull.filter((claimContentListData: any) => {
        if (claimContentListData?.holdOverPaid) {
          return claimContentListData;
        }
      });
    const holdOverPaidTotal = filteredclaimContentListData.reduce(
      (accumulator: any, { holdOverPaid }: any) => accumulator + holdOverPaid,
      0
    );
    return holdOverPaidTotal;
  }
);
export default selectTotalHoldoverPaid;
