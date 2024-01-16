import React from "react";
import Cards from "@/components/common/Cards";
import ScoreMonthCardsStyle from "./thisMonthScoreBoard.module.scss";

interface ThisMonthProps {
  newClaims: number;
  closedClaims: number;
  avgClosingClaim: string;
}

const ThisMonthScoreBoard: React.FC<ThisMonthProps> = ({
  newClaims,
  closedClaims,
  avgClosingClaim,
}) => {
  return (
    <div className="row">
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreMonthCardsStyle.scoreWidthMonth}>
          <div className={ScoreMonthCardsStyle.alignText}>
            <p>{newClaims}</p>
            <div className="mt-2">
              <h6>New claims</h6>
            </div>
          </div>
        </Cards>
      </div>
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreMonthCardsStyle.scoreWidthMonth}>
          <p>{closedClaims}</p>
          <div className="mt-2">
            <h6>Closed claims</h6>
          </div>
        </Cards>
      </div>
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreMonthCardsStyle.scoreWidthMonth}>
          <p>{avgClosingClaim}</p>
          <div className="mt-2">
            <h6>Avg. Closing Time</h6>
          </div>
        </Cards>
      </div>
    </div>
  );
};

export default ThisMonthScoreBoard;
