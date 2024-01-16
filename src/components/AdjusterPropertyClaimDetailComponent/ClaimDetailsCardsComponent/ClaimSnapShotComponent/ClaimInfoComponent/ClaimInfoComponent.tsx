import ClmainInfoStyle from "./ClaimInfo.module.scss";
import { claimDetailsTranslateType } from "@/translations/claimDetailsTranslate/en";
import useTranslation from "@/hooks/useTranslation";

const ClaimInfoCompoonent: React.FC = () => {
  const { translate }: { translate: claimDetailsTranslateType | undefined } =
    useTranslation("claimDetailsTranslate");
  return (
    <>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.claim}
        </label>
        <div className="col-md-3 col-sm-3 col-6">FLOW4122023</div>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.status}
        </label>
        <div className="col-md-3 col-sm-3 col-6">Work In Progress</div>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.createdDate}
        </label>
        <div className="col-md-3 col-sm-3 col-6">Dec 8, 2023 7:53 PM</div>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.elapsedTime}
        </label>
        <div className="col-md-3 col-sm-3 col-6">2 d 19 h 9 m</div>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.lossType}
        </label>
        <div className="col-md-3 col-sm-3 col-6">Not Specified</div>
        <label className={`col-md-3 col-sm-3 col-6 ps-1 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.claimDeductible}
        </label>
        <div className="col-md-3 col-sm-3 col-6">$11.00</div>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.tax}
        </label>
        <div className="col-md-3 col-sm-3 col-6">11</div>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.contentLimits}
        </label>
        <div className="col-md-3 col-sm-3 col-6">$11.00</div>
      </div>
      <div className={`col-md-12 col-sm-12 col-12 ${ClmainInfoStyle.fieldRowContainer}`}>
        <label className={`col-md-3 col-sm-3 col-6 ${ClmainInfoStyle.fieldLabel}`}>
          {translate?.claimSnapshot?.minItemToPrice}
        </label>
        <div className="col-md-3 col-sm-3 col-6">$1.00</div>
      </div>
    </>
  );
};
export default ClaimInfoCompoonent;
