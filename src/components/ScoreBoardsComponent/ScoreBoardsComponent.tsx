"use client";

import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import ScoreCardComponent from "./ScoreCradComponent";
import { Suspense, useState } from "react";
import CustomLoader from "../common/CustomLoader";
import { getClaimScoreCard } from "@/services/ScoreCardService";
import scoreBoardStyle from "./ScoreBoardsComponent.module.scss";

const ScoreBoardsComponent = (props: { data: any }) => {
  const [scoreData, setScoreData] = useState(props.data);
  const [isLoading, setIsLoading] = useState(false);

  const scoreDataHandle = async (scoreDataValue: number) => {
    setIsLoading(true);
    try {
      const resp = await getClaimScoreCard(scoreDataValue, true);
      setScoreData(resp);
    } finally {
      setIsLoading(false);
    }
  };
  const tabData = [
    {
      name: "This Month",
      content: (
        <ScoreCardComponent
          isLoading={isLoading}
          newClaims={scoreData.newClaims}
          closedClaims={scoreData.closedClaims}
          avgClosingClaim={!scoreData.avgClosingClaim ? 0 : scoreData.avgClosingClaim}
        />
      ),
      clickable: true,
      clickHandler: scoreDataHandle,
    },
    {
      name: "This Quater(Oct-Dec)",
      content: (
        <ScoreCardComponent
          isLoading={isLoading}
          newClaims={scoreData.newClaims}
          closedClaims={scoreData.closedClaims}
          avgClosingClaim={!scoreData.avgClosingClaim ? 0 : scoreData.avgClosingClaim}
        />
      ),
      clickable: true,
      clickHandler: scoreDataHandle,
    },
    {
      name: "This Year(2023)",
      content: (
        <ScoreCardComponent
          isLoading={isLoading}
          newClaims={scoreData.newClaims}
          closedClaims={scoreData.closedClaims}
          avgClosingClaim={!scoreData.avgClosingClaim ? 0 : scoreData.avgClosingClaim}
        />
      ),
      clickable: true,
      clickHandler: scoreDataHandle,
    },
  ];
  return (
    <Suspense fallback={<CustomLoader loaderType="spinner2" />}>
      <div className={scoreBoardStyle.container}>
        <TabsButtonComponent tabData={tabData} showBorders={true} clickable={true} />
      </div>
    </Suspense>
  );
};

export default ScoreBoardsComponent;
