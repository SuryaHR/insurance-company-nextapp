import React from "react";
import PendingInvoicesComponent from "@/components/_adjuster_components/PendingInvoicesComponentV2";
import { unknownObjectType } from "@/constants/customTypes";
import { fetchPendingInvoice } from "@/services/_adjuster_services/ClaimService";
import { getServerCookie } from "@/utils/utitlity";

async function PendingInvoicesContainer(props: { translate: any }) {
  const { translate } = props;
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
  return <PendingInvoicesComponent initData={initData} translate={translate} />;
}

export default PendingInvoicesContainer;
