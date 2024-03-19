// "use client";
import React from "react";
import clsx from "clsx";
import Cards from "../../common/Cards";
import CardsStyle from "./dashboard.module.scss";
import AlertCards from "../../common/AlertCards";
import MyScoreBoardCards from "../../common/MyScoreBoardCards";
import PendingVendorCards from "./PendingVendorCards";
import ClaimsNeedAttention from "./ClaimsNeedAttention";
import OpenClaimsTableComponent from "../OpenClaimsTableComponent";

export default function DashboardComponent(props: { translate: any }) {
  const { translate } = props;

  return (
    <div className={CardsStyle.card}>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
          <Cards className={CardsStyle.cardsStylAdjustAlert}>
            <AlertCards translate={translate} />
          </Cards>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-12 pe-0">
          <Cards className={CardsStyle.cardsStylAdjustScore}>
            <MyScoreBoardCards translate={translate} />
          </Cards>
          <div className="row">
            <div
              className={clsx(
                "col-lg-6 col-md-6 col-sm-12 col-12",
                CardsStyle.attentionPendingContainer
              )}
            >
              <ClaimsNeedAttention translate={translate} />
            </div>
            <div
              className={clsx(
                "col-lg-6 col-md-6 col-sm-12 col-12",
                CardsStyle.attentionPendingContainer
              )}
            >
              <PendingVendorCards translate={translate} />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-12">
          <OpenClaimsTableComponent translate={translate} />
        </div>
      </div>
    </div>
  );
}
