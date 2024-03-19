import React from "react";
import Cards from "@/components/common/Cards";
import ViewAllButtonPending from "./ViewAllButtonPending";
import PendingStyle from "./pendingComponenet.module.scss";

type pendingInvoiceType = {
  pendingInvoice: {
    amount: number;
    claimNumber: string;
    insuredName: string;
  };
  translate?: any;
};

const PendingComponent: React.FC<pendingInvoiceType> = (props) => {
  const { translate } = props;
  return (
    <div>
      <Cards className={PendingStyle.cardsStylAdjustCalims}>
        <div className=" row mt-2">
          <h6>
            {
              translate?.adjusterDashboardTranslate?.adjusterDashboard?.PendingVendorCards
                ?.PendingComponent.payArtigemContent
            }{" "}
            ${props?.pendingInvoice?.amount}{" "}
            {
              translate?.adjusterDashboardTranslate?.adjusterDashboard?.PendingVendorCards
                ?.PendingComponent.forClaim
            }
            {props?.pendingInvoice?.claimNumber} ({props?.pendingInvoice?.insuredName})
          </h6>
        </div>
      </Cards>
      <ViewAllButtonPending translate={translate} />
    </div>
  );
};

export default PendingComponent;
