import React from "react";
import PendingButtonStyle from "./viewAllButtonPending.module.scss";
import Link from "next/link";

interface ViewAllButtonPendingProps {
  translate?: any;
}

const ViewAllButtonPending: React.FC<ViewAllButtonPendingProps> = ({ translate }) => {
  return (
    <div className="text-right">
      <Link href="/pending-vendor-invoices" className={PendingButtonStyle.anchorStyle}>
        {
          translate?.adjusterDashboardTranslate?.adjusterDashboard?.PendingVendorCards
            ?.PendingComponent.ViewAllButtonPending.viewAllPendingClaims
        }
      </Link>
    </div>
  );
};

export default ViewAllButtonPending;
