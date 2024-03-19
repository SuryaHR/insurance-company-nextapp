import React from "react";
import coreLineItemDetailContainer from "./coreLineItemDetailContainer.module.scss";
import CoreAdjusterLineItemComponent from "@/components/_core_logic_components/CoreAdjusterLineItemComponent";

async function CoreAdjusterLineItemDetailContainer() {
  return (
    <div className={coreLineItemDetailContainer.container}>
      <CoreAdjusterLineItemComponent />
    </div>
  );
}

export default CoreAdjusterLineItemDetailContainer;
