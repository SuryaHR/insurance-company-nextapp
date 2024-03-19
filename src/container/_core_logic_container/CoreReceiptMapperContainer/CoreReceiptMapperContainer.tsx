import React from "react";

import CoreReceiptsMapperComponent from "@/components/_core_logic_components/CoreReceiptsMapperComponent/CoreReceiptsMapperComponent";

async function CoreReceiptMapperContainer({ claimId }: { claimId: string }) {
  return (
    <div>
      <CoreReceiptsMapperComponent claimId={claimId} />
    </div>
  );
}

export default CoreReceiptMapperContainer;
