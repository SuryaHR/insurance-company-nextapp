import React from "react";
import Cards from "@/components/common/Cards";
import ScoreCardsStyle from "./scoreCard.module.scss";
import CustomLoader from "@/components/common/CustomLoader";

interface ScoreCardProps {
  newClaims: number;
  closedClaims: number;
  avgClosingClaim: string;
  isLoading: boolean;
}

const ScoreCardComponent: React.FC<ScoreCardProps> = ({
  newClaims,
  closedClaims,
  avgClosingClaim,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={ScoreCardsStyle.loaderContainer}>
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }
  return (
    <div className="row p-3">
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreCardsStyle.newClaimCard}>
          <div className={ScoreCardsStyle.alignText}>
            <div className={ScoreCardsStyle.claimTypeCount}>{newClaims}</div>
            <div className={ScoreCardsStyle.claimTypeLabel}>New claims</div>
          </div>
        </Cards>
      </div>
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreCardsStyle.closedClaimCard}>
          <div className={ScoreCardsStyle.claimTypeCount}>{closedClaims}</div>
          <div className={ScoreCardsStyle.claimTypeLabel}>Closed claims</div>
        </Cards>
      </div>
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreCardsStyle.avgClosingTimeCard}>
          <div className={ScoreCardsStyle.claimTypeCount}>{avgClosingClaim}</div>
          <div className={ScoreCardsStyle.claimTypeLabel}>Avg. Closing Time</div>
        </Cards>
      </div>
    </div>
  );
};

export default ScoreCardComponent;
