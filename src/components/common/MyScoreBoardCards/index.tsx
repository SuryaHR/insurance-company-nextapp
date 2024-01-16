import React from "react";
import GenericComponentHeading from "../GenericComponentHeading";
import ScoreBoardsComponent from "@/components/ScoreBoardsComponent";
import { getClaimScoreCard } from "@/services/ScoreCardService";

const MyScoreBoardCards: React.FC = async () => {
  let resp;
  try {
    resp = await getClaimScoreCard(1);
  } catch (error) {
    console.log("getClaimScoreCard API error::", error);
  }

  return (
    <div>
      <GenericComponentHeading title="My ScoreBoard" />
      <ScoreBoardsComponent data={resp} />
    </div>
  );
};

export default MyScoreBoardCards;
