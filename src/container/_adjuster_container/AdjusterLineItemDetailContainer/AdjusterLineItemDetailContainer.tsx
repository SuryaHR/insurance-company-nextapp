import React from "react";
import lineItemContainerStyle from "./lineItemDetailContainer.module.scss";
import AdjusterLineItemComponent from "@/components/_adjuster_components/AdjusterLineItemComponent";

async function AdjusterLineItemDetailContainer() {
  return (
    <div className={lineItemContainerStyle.container}>
      <AdjusterLineItemComponent />
    </div>
  );
}

export default AdjusterLineItemDetailContainer;
