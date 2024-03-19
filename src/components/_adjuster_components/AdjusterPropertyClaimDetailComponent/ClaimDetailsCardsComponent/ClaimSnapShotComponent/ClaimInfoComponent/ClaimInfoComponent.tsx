"use client";
import ClmainInfoStyle from "./ClaimInfo.module.scss";
import { convertToCurrentTimezone } from "@/utils/helper";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import { getUSDCurrency } from "@/utils/utitlity";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";

interface calimInfoType {
  claimSnapShotData: any;
}

const ClaimInfoComponent: React.FC<calimInfoType> = ({ claimSnapShotData }) => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  const dateFormate = "MMM DD, YYYY h:mm A";
  return (
    <>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.claim}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>
            <GenericNormalInput
              value={claimSnapShotData?.claimNumber ?? ""}
              inputFieldClassname={ClmainInfoStyle.customInput}
              readOnly
            />
          </div>
        </fieldset>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.status}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>
            {claimSnapShotData?.claimStatus?.status}
          </div>
        </fieldset>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.tax}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>
            <div>
              {claimSnapShotData?.taxRate
                ? claimSnapShotData?.taxRate?.toFixed(2)
                : "0.00"}
              %
            </div>
          </div>
        </fieldset>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.elapsedTime}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>{claimSnapShotData?.claimTime}</div>
        </fieldset>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.coverageLimits}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>
            <div>{getUSDCurrency(+claimSnapShotData?.policyLimit ?? 0)}</div>
          </div>
        </fieldset>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.deductible}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>
            <div>{getUSDCurrency(+claimSnapShotData?.deductible ?? 0)}</div>
          </div>
        </fieldset>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.createdDate}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>
            {convertToCurrentTimezone(claimSnapShotData?.createdDate, dateFormate)}
          </div>
        </fieldset>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.minItemToPrice}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>
            <div>{getUSDCurrency(+claimSnapShotData?.minimumThreshold ?? 0)}</div>
          </div>
        </fieldset>
        <fieldset
          className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldSetContainer}`}
        >
          <legend className={ClmainInfoStyle.fieldSetLabel}>
            {translate?.claimDetailsTabTranslate?.claimSnapshot?.lossType}
          </legend>
          <div className={ClmainInfoStyle.fieldValue}>
            <div className={ClmainInfoStyle.customInput}>
              {claimSnapShotData?.damageType}
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};
export default ClaimInfoComponent;
