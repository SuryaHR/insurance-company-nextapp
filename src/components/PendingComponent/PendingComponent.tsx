import React from "react";
import Cards from "../common/Cards";
import ViewAllButtonPending from "./ViewAllButtonPending";
import PendingStyle from "./pendingComponenet.module.scss";

type pendingInvoiceType = {
  pendingInvoice: {
    amount: number;
    claimNumber: string;
    insuredName: string;
  };
};

const PendingComponent: React.FC<pendingInvoiceType> = (props) => {
  return (
    <div>
      <Cards className={PendingStyle.cardsStylAdjustCalims}>
        <div className=" row mt-2">
          <h6>
            Pay Artigem Contents ${props?.pendingInvoice?.amount} for claim #
            {props?.pendingInvoice?.claimNumber} ({props?.pendingInvoice?.insuredName})
          </h6>
        </div>
      </Cards>
      <ViewAllButtonPending />
    </div>
  );
};

export default PendingComponent;
