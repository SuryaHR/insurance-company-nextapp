import React from "react";
import GenericComponentHeading from "../GenericComponentHeading";
import AlertTabsButton from "./AlertTabsButton";

const AlertCards: React.FC = () => {
  return (
    <div>
      <GenericComponentHeading title="Alert" />
      <AlertTabsButton />
    </div>
  );
};

export default AlertCards;
