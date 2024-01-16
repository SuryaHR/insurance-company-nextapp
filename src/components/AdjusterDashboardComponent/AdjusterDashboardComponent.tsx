import React from "react";
import clsx from "clsx";
import Cards from "../common/Cards";
import CardsStyle from "./dashboard.module.scss";
import AlertCards from "../common/AlertCards";
import MyScoreBoardCards from "../common/MyScoreBoardCards";
import PendingVendorCards from "./PendingVendorCards";
import ClaimsNeedAttention from "./ClaimsNeedAttention";
// import OpenClaimsTableContainer from "@/container/OpenClaimsTableContainer";
// import OpenClaimsTableComponent from "../OpenClaimsTableComponent";
import OpenClaimsTableComponent from "../OpenClaimsTableComponent";
import CustomLoader from "@/components/common/CustomLoader";
import { claimList } from "@/services/ClaimService";
import { cookies } from "next/headers";

export default async function DashboardComponent() {
  const cookieStore = cookies();
  let token = "";
  let userId = "";
  if (cookieStore.has("accessToken")) {
    token = cookieStore.get("accessToken")?.value ?? "";
    userId = cookieStore.get("userId")?.value ?? "";
  }
  const payload = {
    assignedUserId: userId,
    pagination: {
      pageNumber: 1,
      limit: 20,
      sortBy: "createDate",
      orderBy: "desc",
    },
    searchKeyword: "",
    statusIds: null,
  };
  const claimListRes: any = await claimList(payload, token);
  if (claimListRes?.result?.status === 200) {
    return (
      <div className={CardsStyle.card}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <Cards className={CardsStyle.cardsStylAdjustAlert}>
              <AlertCards />
            </Cards>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pr-0">
            <Cards className={CardsStyle.cardsStylAdjustScore}>
              <MyScoreBoardCards />
            </Cards>
            <div className="row">
              <div
                className={clsx(
                  "col-lg-6 col-md-6 col-sm-12 col-xs-12",
                  CardsStyle.attentionPendingContainer
                )}
              >
                <Cards className={CardsStyle.cardsStylClaims}>
                  <ClaimsNeedAttention />
                </Cards>
              </div>
              <div
                className={clsx(
                  "col-lg-6 col-md-6 col-sm-12 col-xs-12",
                  CardsStyle.attentionPendingContainer
                )}
              >
                <Cards className={CardsStyle.cardsStylVendor}>
                  <PendingVendorCards />
                </Cards>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-12">
            <OpenClaimsTableComponent claimListRes={claimListRes} />
          </div>
        </div>
      </div>
    );
  }
  return <CustomLoader />;
}
