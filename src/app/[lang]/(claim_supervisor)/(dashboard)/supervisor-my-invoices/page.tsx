import React, { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import InvoicesToApproveContainer from "@/container/_claim_supervisor_container/InvoicesToApproveContainer";

export default async function SupervisorMyInvoices() {
  return (
    <Suspense fallback={<Loading />}>
      <InvoicesToApproveContainer />;
    </Suspense>
  );
}
