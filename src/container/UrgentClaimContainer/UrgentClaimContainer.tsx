import React from "react";
import UrgentClaimTableComponent from "@/components/UrgentClaimTableComponent";
import { unknownObjectType } from "@/constants/customTypes";
import { fetchUrgentClaimList } from "@/services/ClaimService";
import { getServerCookie } from "@/utils/utitlity";

async function UrgentClaimContainer() {
  let initData: unknownObjectType | null = null;
  const userId = await getServerCookie("userId");
  try {
    const res = await fetchUrgentClaimList({
      userId,
    });
    initData = res;
  } catch (error) {
    initData = null;
  }
  return <UrgentClaimTableComponent initData={initData} />;
}

export default UrgentClaimContainer;
