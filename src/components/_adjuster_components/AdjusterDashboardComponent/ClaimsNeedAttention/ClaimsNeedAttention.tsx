"use client";
import React, { useEffect, useState } from "react";
import GenericComponentHeading from "../../../common/GenericComponentHeading";
import ClaimsComponent from "@/components/_adjuster_components/ClaimsComponent";
import { getImmediateClaims } from "@/services/_adjuster_services/AdjusterDashboardService";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import claimAttentionStyle from "./claim-need-attention.module.scss";
import { RootState } from "@/store/store";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";
import { ConnectedProps, connect } from "react-redux";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addImmidiateClaimData } from "@/reducers/_adjuster_reducers/AdjusterDashboard/AdjusterDashboardSlice";
import CustomLoader from "@/components/common/CustomLoader";
import selectImmidiateClaimData from "@/reducers/_adjuster_reducers/AdjusterDashboard/Selectors/selectImmidiateClaimData";
import Cards from "@/components/common/Cards";

interface ClaimsNeedAttentionProps {
  translate?: any;
}

const ClaimsNeedAttention: React.FC<connectorType & ClaimsNeedAttentionProps> = ({
  translate,
  userId,
  immidiateClaimData,
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getImmediateClaimsData = async () => {
      setIsLoading(true);
      try {
        const resp = await getImmediateClaims(userId, true);
        if (resp?.status === 200) {
          dispatch(addImmidiateClaimData(resp?.data));
        }
      } finally {
        setIsLoading(false);
      }
    };
    getImmediateClaimsData();
  }, [dispatch, userId]);

  if (isLoading) {
    return (
      <div className={claimAttentionStyle.loaderContainer}>
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }
  return (
    <>
      <Cards className={claimAttentionStyle.cardsCotainer}>
        <GenericComponentHeading
          title={
            translate?.adjusterDashboardTranslate?.adjusterDashboard?.ClaimsNeedAttention
              ?.claimNeedingAttenttion + ` (${immidiateClaimData?.totalClaims})`
          }
        />
        {immidiateClaimData?.claims?.length > 0 ? (
          <ClaimsComponent claim={immidiateClaimData?.claims[0]} />
        ) : (
          <div className={claimAttentionStyle.noRecordContainer}>
            <NoRecordComponent
              message={
                translate?.adjusterDashboardTranslate?.adjusterDashboard
                  ?.ClaimsNeedAttention?.NoRecordComponent.message
              }
            />
          </div>
        )}
      </Cards>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  userId: selectLoggedInUserId(state),
  immidiateClaimData: selectImmidiateClaimData(state),
});
const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ClaimsNeedAttention);
