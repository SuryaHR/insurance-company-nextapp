import React from "react";

import ReceiptsMapperComponent from "@/components/_adjuster_components/ReceiptsMapperComponent";
import { getCategories } from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";

async function ReceiptMapperContainer({ claimId }: { claimId: string }) {
  const categoryListRes: any = await getCategories();

  return (
    <div>
      <ReceiptsMapperComponent claimId={claimId} categoryListRes={categoryListRes} />
    </div>
  );
}

export default ReceiptMapperContainer;
