import React from "react";
// import { fetchClaimItemDetails } from "@/services/AdjusterMyClaimServices/LineItemDetailService";
import lineItemContainerStyle from "./lineItemDetailContainer.module.scss";
// import { redirect } from "next/navigation";
// import PaginationButtons from "../../components/AdjusterLineItemComponent/PaginationButtons";
import AdjusterLineItemComponent from "@/components/AdjusterLineItemComponent";

interface itemDetailPropType {
  itemId: string;
  claimId: string;
}

async function AdjusterLineItemDetailContainer({ itemId, claimId }: itemDetailPropType) {
  console.log(">>>>>>>>>", itemId, claimId);

  return (
    <div className={lineItemContainerStyle.container}>
      <AdjusterLineItemComponent />
    </div>
  );
}

export default AdjusterLineItemDetailContainer;
