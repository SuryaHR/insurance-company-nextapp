"use client";
import { useContext } from "react";
import actionsBtnStyle from "./RightActionsButton.module.scss";
import GenericButton from "@/components/common/GenericButton";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

type actionsType = {
  setShowForm: any;
  showForm: any;
};

const RightActionsComponent: React.FC<actionsType> = (props: any) => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  return (
    <div className={actionsBtnStyle.actionBtnContainer}>
      {!props.showForm && (
        <div className={actionsBtnStyle.actionBtns}>
          <GenericButton
            size="small"
            label={translate?.claimDetailsTabTranslate?.claimSnapshot?.edit}
            theme="linkBtn"
            btnClassname={actionsBtnStyle.linkBtnStyle}
            onClick={() => {
              props.setShowForm(true);
            }}
          />
        </div>
      )}
      {props.showForm && (
        <div className={actionsBtnStyle.actionBtns}>
          <GenericButton
            type="submit"
            size="small"
            label={translate?.claimDetailsTabTranslate?.claimSnapshot?.update}
            btnClassname={actionsBtnStyle.linkBtnStyle}
            theme="linkBtn"
            form="claim-info-update-form"
          />
          <GenericButton
            size="small"
            label={translate?.claimDetailsTabTranslate?.claimSnapshot?.cancel}
            theme="linkBtn"
            btnClassname={actionsBtnStyle.linkBtnStyle}
            onClick={() => {
              props.setShowForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RightActionsComponent;
