import React, { useContext } from "react";
import replacementItemSectionStyle from "./replacementItemSection.module.scss";
import GenericButton from "@/components/common/GenericButton";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectReplacementItem from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectReplacementItem";
import ReplacementItem from "./ReplacementItem";
import selectAcceptedStandardCost from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectAcceptedStandardCost";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { lineItemTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-line-item-detail/[claimId]/[itemId]/page";

interface propType {
  showCustomComparableModal: React.SetStateAction<any>;
}

function ReplacementItemSection(props: propType) {
  const {
    translate: {
      lineItemTranslate: { replacementTexts },
    },
  } = useContext<TranslateContextData<lineItemTranslatePropType>>(TranslateContext);

  const { showCustomComparableModal } = props;

  const replacementItem = useAppSelector(selectReplacementItem);
  const acceptedStandardCost = useAppSelector(selectAcceptedStandardCost);
  return (
    <div className={replacementItemSectionStyle.root}>
      <div className={replacementItemSectionStyle.heading}>
        <span>{replacementTexts?.heading}</span>
        <GenericButton
          label={replacementTexts?.addComparable}
          size="small"
          theme="coreLogic"
          onClickHandler={showCustomComparableModal}
        />
      </div>
      <div className={replacementItemSectionStyle.content}>
        {(replacementItem || acceptedStandardCost) && (
          <ReplacementItem itemDetail={replacementItem} />
        )}
        {!replacementItem && !acceptedStandardCost && (
          <div className="m-auto">
            <NoRecordComponent message={replacementTexts?.findMsg} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReplacementItemSection;
