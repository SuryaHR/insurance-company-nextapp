import React from "react";
import Cards from "@/components/common/Cards";
import ScoreYearCardsStyle from "./thisYearScoreBoard.module.scss";

interface ThisYearProps {
  newClaims: number;
  closedClaims: number;
  avgClosingClaim: string;
}

const ThisYearScoreBoard: React.FC<ThisYearProps> = ({
  newClaims,
  closedClaims,
  avgClosingClaim,
}) => {
  return (
    <div className="row">
      <div className="col-md-4 col-sm-4 col-4">
        <Cards className={ScoreYearCardsStyle.scoreWidthYear}>
          <p>{newClaims}</p>
          <div className="mt-2">
            <h6>New claims</h6>
          </div>
        </Cards>
      </div>
      <div className="col-md-4 col-sm-4 col-4">
        <Cards className={ScoreYearCardsStyle.scoreWidthYear}>
          <p>{closedClaims}</p>
          <div className="mt-2">
            <h6>Closed claims</h6>
          </div>
        </Cards>
      </div>
      <div className="col-md-4 col-sm-4 col-4">
        <Cards className={ScoreYearCardsStyle.scoreWidthYear}>
          <p>{avgClosingClaim}</p>
          <div className="mt-2">
            <h6>Avg. Closing Time</h6>
          </div>
        </Cards>
      </div>
    </div>
  );
};

export default ThisYearScoreBoard;
