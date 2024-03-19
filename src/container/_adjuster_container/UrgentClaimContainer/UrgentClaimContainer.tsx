import React from "react";
import { unknownObjectType } from "@/constants/customTypes";
import { fetchUrgentClaimList } from "@/services/_adjuster_services/ClaimService";
import { getServerCookie } from "@/utils/utitlity";
import UrgentClaimTableComponent from "@/components/_adjuster_components/UrgentClaimTableComponent";

async function UrgentClaimContainer(props: { translate: any }) {
  const { translate } = props;
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
  return <UrgentClaimTableComponent initData={initData} translate={translate} />;
}

export default UrgentClaimContainer;
