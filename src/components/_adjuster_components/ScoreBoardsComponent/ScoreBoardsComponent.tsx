"use client";

import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import ScoreCardComponent from "./ScoreCradComponent";
import { useCallback, useEffect, useState } from "react";
import { getClaimScoreCard } from "@/services/_adjuster_services/ScoreCardService";
import scoreBoardStyle from "./ScoreBoardsComponent.module.scss";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { getCurrentQuarter, getCurrentYear } from "@/utils/helper";
import { adjusterDashboardTranslateProp } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-dashboard/page";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import selectScoreCardData from "@/reducers/_adjuster_reducers/AdjusterDashboard/Selectors/selectScoreCardData";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addScoreCardData } from "@/reducers/_adjuster_reducers/AdjusterDashboard/AdjusterDashboardSlice";

const ScoreBoardsComponent: React.FC<connectorType> = (props) => {
  const { translate } =
    useContext<TranslateContextData<adjusterDashboardTranslateProp>>(TranslateContext);
  const { scoreCardData } = props;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const scoreDataHandle = useCallback(
    async (scoreDataValue: number) => {
      setIsLoading(true);
      try {
        const resp = await getClaimScoreCard(scoreDataValue, true);
        if (resp?.status === 200) {
          dispatch(addScoreCardData(resp?.data));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    scoreDataHandle(1);
  }, [scoreDataHandle]);

  const tabData = [
    {
      name: translate?.adjusterDashboardTranslate?.adjusterDashboard?.myScoreBoardCrads
        ?.scoreBoardComponent?.thisMonth,
      content: (
        <ScoreCardComponent
          isLoading={isLoading}
          newClaims={scoreCardData?.newClaims}
          closedClaims={scoreCardData?.closedClaims}
          avgClosingClaim={
            !scoreCardData?.avgClosingClaim ? 0 : scoreCardData?.avgClosingClaim
          }
          translate={translate}
        />
      ),
      clickable: true,
      clickHandler: scoreDataHandle,
    },
    {
      name:
        translate?.adjusterDashboardTranslate?.adjusterDashboard?.myScoreBoardCrads
          ?.scoreBoardComponent?.thisQuarter + ` (${getCurrentQuarter()})`,
      content: (
        <ScoreCardComponent
          isLoading={isLoading}
          newClaims={scoreCardData?.newClaims}
          closedClaims={scoreCardData?.closedClaims}
          avgClosingClaim={
            !scoreCardData?.avgClosingClaim ? 0 : scoreCardData?.avgClosingClaim
          }
          translate={translate}
        />
      ),
      clickable: true,
      clickHandler: scoreDataHandle,
    },
    {
      name:
        translate?.adjusterDashboardTranslate?.adjusterDashboard?.myScoreBoardCrads
          ?.scoreBoardComponent?.thisYear + ` (${getCurrentYear()})`,
      content: (
        <ScoreCardComponent
          isLoading={isLoading}
          newClaims={scoreCardData?.newClaims}
          closedClaims={scoreCardData?.closedClaims}
          avgClosingClaim={
            !scoreCardData?.avgClosingClaim ? 0 : scoreCardData?.avgClosingClaim
          }
          translate={translate}
        />
      ),
      clickable: true,
      clickHandler: scoreDataHandle,
    },
  ];

  return (
    <div className={scoreBoardStyle.container}>
      <TabsButtonComponent tabData={tabData} showBorders={true} clickable={true} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  scoreCardData: selectScoreCardData(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ScoreBoardsComponent);
