import React from "react";

import VendorInvoiceDetailsContainer from "@/container/_adjuster_container/VendorInvoiceDetailsContainer/VendorInvoiceDetailsContainer";

export interface VendorInvoiceDetailsPropType {}

async function page(): Promise<JSX.Element> {
  return <VendorInvoiceDetailsContainer />;
}

export default page;
