import UrgentClaimContainer from "@/container/UrgentClaimContainer";
import React, { Suspense } from "react";
import Loading from "../loading";

export default function ClaimsNeedAttention() {
  return (
    <Suspense fallback={<Loading />}>
      <UrgentClaimContainer />;
    </Suspense>
  );
}
