import React from "react";
import AdjusterLineItemDetailContainer from "@/container/AdjusterLineItemDetailContainer";

function ItemDetail({ params }: { params: { itemId: string; claimId: string } }) {
  const { itemId, claimId } = params;
  return <AdjusterLineItemDetailContainer itemId={itemId} claimId={claimId} />;
}

export default ItemDetail;
