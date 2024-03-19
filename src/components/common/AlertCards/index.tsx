import React from "react";
import GenericComponentHeading from "../GenericComponentHeading";
import AlertTabsButton from "./AlertTabsButton";

interface AlertCardsProps {
  translate?: any;
}
const AlertCards: React.FC<AlertCardsProps> = (props) => {
  const { translate } = props;
  return (
    <div>
      <GenericComponentHeading title="Alert" />
      <AlertTabsButton translate={translate} />
    </div>
  );
};

export default AlertCards;
