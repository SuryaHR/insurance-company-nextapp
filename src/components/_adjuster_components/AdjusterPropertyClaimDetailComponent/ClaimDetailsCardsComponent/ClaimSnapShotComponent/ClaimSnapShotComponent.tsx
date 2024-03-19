"use client";
import Cards from "@/components/common/Cards";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import claimSnapShotStyle from "./claim-snap-shot.module.scss";
import { useContext, useState } from "react";
import RightActionsComponent from "./RightActionsButton";
import ClaimInfoComponent from "./ClaimInfoComponent";
import UpdateClaimInfoForm from "./UpdateClaimInfoForm";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import selectTotalReplacementExposure from "@/reducers/_adjuster_reducers/ClaimData/Selectors/selectTotalReplacementExposure";
import selectTotalCashPayoutExposure from "@/reducers/_adjuster_reducers/ClaimData/Selectors/selectTotalCashPayoutExposure";
import selectTotalCashPaid from "@/reducers/_adjuster_reducers/ClaimData/Selectors/selectTotalCashPaid";
import selectTotalHoldoverPaid from "@/reducers/_adjuster_reducers/ClaimData/Selectors/selectTotalHoldoverPaid";
import { getUSDCurrency } from "@/utils/utitlity";

const ClaimSnapShotComponent: React.FC<connectorType> = (props) => {
  const {
    claimSnapShotData,
    totalReplacementExposure,
    totalCashPayoutExposure,
    totalCashPaid,
    totalHoldoverPaid,
  } = props;
  const [showForm, setShowForm] = useState(false);
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  return (
    <>
      <Cards className={claimSnapShotStyle.snapShotcardContainer}>
        <GenericComponentHeading
          title={translate?.claimDetailsTabTranslate?.claimSnapshot?.claimSnapshotHeading}
        >
          <RightActionsComponent setShowForm={setShowForm} showForm={showForm} />
        </GenericComponentHeading>
        <div className={claimSnapShotStyle.contentContainer}>
          {!showForm && (
            <>
              <ClaimInfoComponent claimSnapShotData={claimSnapShotData} />
            </>
          )}
          {showForm && (
            <UpdateClaimInfoForm
              claimSnapShotData={claimSnapShotData}
              setShowForm={setShowForm}
            />
          )}
          <div className={claimSnapShotStyle.contentCardsContainer}>
            <div className="mt-2">
              <Cards className={claimSnapShotStyle.snapShotContentCard}>
                <div className={claimSnapShotStyle.cardItemContainer}>
                  <div className={claimSnapShotStyle.itemTitle}>
                    {translate?.claimDetailsTabTranslate?.claimSnapshot?.items}
                  </div>
                  <div>
                    <span className={claimSnapShotStyle.numericContent}>
                      {claimSnapShotData?.itemsClaimed}
                    </span>
                    <span className={claimSnapShotStyle.textContent}>
                      {translate?.claimDetailsTabTranslate?.claimSnapshot?.claimed}
                    </span>
                  </div>
                  <div>
                    <span className={claimSnapShotStyle.numericContent}>
                      {claimSnapShotData?.itemsProcessed}
                    </span>
                    <span className={claimSnapShotStyle.textContent}>
                      {translate?.claimDetailsTabTranslate?.claimSnapshot?.processed}
                    </span>
                  </div>
                </div>
              </Cards>
            </div>
            <div className="mt-2">
              <Cards className={claimSnapShotStyle.snapShotContentCard}>
                <div className={claimSnapShotStyle.cardItemContainer}>
                  <div className={claimSnapShotStyle.itemTitle}>
                    {translate?.claimDetailsTabTranslate?.claimSnapshot?.exposure}
                  </div>
                  <div>
                    {getUSDCurrency(+totalReplacementExposure ?? 0)}{" "}
                    <span className={claimSnapShotStyle.textContent}>
                      {translate?.claimDetailsTabTranslate?.claimSnapshot?.repl}
                    </span>
                  </div>
                  <div>
                    {getUSDCurrency(+totalCashPayoutExposure ?? 0)}{" "}
                    <span className={claimSnapShotStyle.textContent}>
                      {translate?.claimDetailsTabTranslate?.claimSnapshot?.cash}
                    </span>
                  </div>
                </div>
              </Cards>
            </div>
            <div className="mt-2">
              <Cards className={claimSnapShotStyle.snapShotContentCard}>
                <div className={claimSnapShotStyle.cardItemContainer}>
                  <div className={claimSnapShotStyle.itemTitle}>
                    {translate?.claimDetailsTabTranslate?.claimSnapshot?.paid}
                  </div>
                  <div>
                    {getUSDCurrency(+totalCashPaid ?? 0)}{" "}
                    <span className={claimSnapShotStyle.textContent}>
                      {translate?.claimDetailsTabTranslate?.claimSnapshot?.paidCash}
                    </span>
                  </div>
                  <div>
                    {getUSDCurrency(+totalHoldoverPaid ?? 0)}{" "}
                    <span className={claimSnapShotStyle.textContent}>
                      {translate?.claimDetailsTabTranslate?.claimSnapshot?.holdover}
                    </span>
                  </div>
                </div>
              </Cards>
            </div>
          </div>
        </div>
      </Cards>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  claimSnapShotData: state?.claimDetail?.contents,
  totalReplacementExposure: selectTotalReplacementExposure(state),
  totalCashPayoutExposure: selectTotalCashPayoutExposure(state),
  totalCashPaid: selectTotalCashPaid(state),
  totalHoldoverPaid: selectTotalHoldoverPaid(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ClaimSnapShotComponent);
