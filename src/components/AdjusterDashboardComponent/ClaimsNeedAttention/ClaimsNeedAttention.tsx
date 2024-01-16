import React from "react";
import GenericComponentHeading from "../../common/GenericComponentHeading";
import ClaimsComponent from "@/components/ClaimsComponent";
import { cookies } from "next/headers";
import { getImmediateClaims } from "@/services/AdjusterDashboardService";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import claimAttentionStyle from "./claim-need-attention.module.scss";

const ClaimsNeedAttention: React.FC = async () => {
  const cookieStore = cookies();
  let userId;
  let resp;
  if (cookieStore.has("userId")) {
    userId = cookieStore.get("userId")?.value ?? "";
  }
  try {
    resp = await getImmediateClaims(userId);
  } catch (error) {
    console.log("getImmediateClaims API error::", error);
  }
  const respData = resp?.data;
  if (resp?.status === 200) {
    return (
      <>
        <GenericComponentHeading
          title={`Claims Needing Attention (${respData.totalClaims})`}
        />
        {respData?.claims.length > 0 ? (
          <ClaimsComponent claim={respData?.claims[0]} />
        ) : (
          <div className={claimAttentionStyle.noRecordContainer}>
            <NoRecordComponent message="No records available" />
          </div>
        )}
      </>
    );
  }
};

export default ClaimsNeedAttention;
