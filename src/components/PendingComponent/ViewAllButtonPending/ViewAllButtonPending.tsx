import React from "react";
import PendingButtonStyle from "./viewAllButtonPending.module.scss";

const ViewAllButtonPending: React.FC = () => {
  return (
    <div className="text-right">
      <a href="/pending-vendor-invoices" className={PendingButtonStyle.anchorStyle}>
        View All Pending Claims
      </a>
    </div>
  );
};

export default ViewAllButtonPending;
