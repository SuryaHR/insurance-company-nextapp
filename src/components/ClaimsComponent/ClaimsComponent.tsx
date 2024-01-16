"use client";

import React from "react";
import Cards from "../common/Cards";
import ClaimsStyle from "./ClaimsComponent.module.scss";
import ClaimsAllViewButton from "./ClaimsAllViewButton";
import { useRouter } from "next/navigation";

type claimType = {
  claim: {
    claimNumber: string;
    adjusterName: string;
    daysToClose: number;
    noOfItems: number;
    claimId: number;
  };
};

const ClaimsComponent: React.FC<claimType> = (props) => {
  const router = useRouter();
  return (
    <div
      onClick={() =>
        router.push(`/adjuster-property-claim-details/${props?.claim?.claimId}`)
      }
    >
      <Cards className={ClaimsStyle.cardsStylAdjustCalims}>
        <div className="row mt-2">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <h5 className={ClaimsStyle.truncateText}>{props?.claim?.claimNumber}</h5>
            <div className="mt-2">
              <h6>{props?.claim?.adjusterName}</h6>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12 mt-2 mt-md-0">
            <h5>
              <span className={ClaimsStyle.dueStyle}>
                {props?.claim?.daysToClose < 0
                  ? -props?.claim?.daysToClose
                  : props?.claim?.daysToClose}
              </span>{" "}
              days
            </h5>
            <div className="mt-2">
              <h6>{props?.claim?.daysToClose < 0 ? " Over Due" : " To close"}</h6>
            </div>
          </div>
          <div className="col-lg-2 col-md-12 col-sm-12 mt-2 mt-lg-0">
            <span className={ClaimsStyle.dueStyle}>
              <h5>{props?.claim?.noOfItems}</h5>
            </span>
            <div className="mt-2">
              <h6>items</h6>
            </div>
          </div>
        </div>
      </Cards>
      <ClaimsAllViewButton />
    </div>
  );
};

export default ClaimsComponent;
