import React from "react";
import replacementItemSectionStyle from "./replacementItemSection.module.scss";
import GenericButton from "@/components/common/GenericButton";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectReplacementItem from "@/reducers/LineItemDetail/Selectors/selectReplacementItem";
import ReplacementItem from "./ReplacementItem";

interface propType {
  showCustomComparableModal: React.SetStateAction<any>;
}

function ReplacementItemSection(props: propType) {
  const { showCustomComparableModal } = props;

  const replacementItem = useAppSelector(selectReplacementItem);
  return (
    <div className={replacementItemSectionStyle.root}>
      <div className={replacementItemSectionStyle.heading}>
        <span>Replacement Item</span>
        <GenericButton
          label="Build a custom comparable"
          size="small"
          theme="normal"
          onClickHandler={showCustomComparableModal}
        />
      </div>
      <div className={replacementItemSectionStyle.content}>
        {replacementItem && <ReplacementItem itemDetail={replacementItem} />}
        {!replacementItem && (
          <div className="m-auto">
            <NoRecordComponent message="Scroll down to find comparable" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReplacementItemSection;
