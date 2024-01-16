import React from "react";
import PendingInvoicesComponent from "@/components/PendingInvoicesComponentV2";
import { unknownObjectType } from "@/constants/customTypes";
import { fetchPendingInvoice } from "@/services/ClaimService";
import { getServerCookie } from "@/utils/utitlity";

async function PendingInvoicesContainer() {
  let initData: unknownObjectType | null = null;
  const userId = await getServerCookie("userId");
  try {
    const res = await fetchPendingInvoice({
      userId,
    });
    initData = res;
  } catch (error) {
    initData = null;
  }
  return <PendingInvoicesComponent initData={initData} />;
}

export default PendingInvoicesContainer;
