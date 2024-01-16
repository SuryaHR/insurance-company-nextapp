import React from "react";
import Cards from "@/components/common/Cards";
import ScoreQuaterCardsStyle from "./thisQuaterScoreBoard.module.scss";

interface ThisQuaterProps {
  newClaims: number;
  closedClaims: number;
  avgClosingClaim: string;
}

const ThisQuaterScoreBoard: React.FC<ThisQuaterProps> = ({
  newClaims,
  closedClaims,
  avgClosingClaim,
}) => {
  return (
    <div className="row">
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreQuaterCardsStyle.scoreWidthQuater}>
          <p>{newClaims}</p>
          <div className="mt-2">
            <h6>New claims</h6>
          </div>
        </Cards>
      </div>
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreQuaterCardsStyle.scoreWidthQuater}>
          <p>{closedClaims}</p>
          <div className="mt-2">
            <h6>Closed claims</h6>
          </div>
        </Cards>
      </div>
      <div className="col-md-4 col-sm-4 col-xs-4">
        <Cards className={ScoreQuaterCardsStyle.scoreWidthQuater}>
          <p>{avgClosingClaim}</p>
          <div className="mt-2">
            <h6>Avg. Closing Time</h6>
          </div>
        </Cards>
      </div>
    </div>
  );
};

export default ThisQuaterScoreBoard;
