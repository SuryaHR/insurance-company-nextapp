"use client";
import React from "react";
import GenericComponentHeading from "../GenericComponentHeading";
import ScoreBoardsComponent from "@/components/_adjuster_components/ScoreBoardsComponent";

interface MyScoreBoardCardsProps {
  translate?: any;
}

const MyScoreBoardCards: React.FC<MyScoreBoardCardsProps> = ({ translate }) => {
  return (
    <div>
      <GenericComponentHeading
        title={
          translate?.adjusterDashboardTranslate?.adjusterDashboard?.myScoreBoardCrads
            ?.myScored
        }
      />
      <ScoreBoardsComponent />
    </div>
  );
};

export default MyScoreBoardCards;
