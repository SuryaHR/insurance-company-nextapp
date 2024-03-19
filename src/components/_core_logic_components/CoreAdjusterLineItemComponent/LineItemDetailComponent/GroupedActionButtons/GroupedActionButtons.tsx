import React from "react";
import GenericButton from "@/components/common/GenericButton";
import groupedActionButtonsStyle from "./groupedActionButtons.module.scss";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectScheduledItem from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectScheduledItem";
import { ITEM_STATUS } from "@/constants/constants";
import selectItemStatus from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectItemStatus";
interface propType {
  onDeleteClick?: () => void;
}

function GroupedActionButtons(props: propType) {
  const { isScheduledItem, scheduleAmount } = useAppSelector(selectScheduledItem);
  const lineItemStatus = useAppSelector(selectItemStatus);
  const { onDeleteClick } = props;
  return (
    <div className={groupedActionButtonsStyle.root}>
      <GenericButton
        label="Save"
        size="medium"
        type="submit"
        theme="coreLogic"
        disabled={
          lineItemStatus?.status === ITEM_STATUS.underReview ||
          (isScheduledItem && scheduleAmount < 1)
        }
      />
      <GenericButton
        onClickHandler={onDeleteClick}
        label="Delete"
        size="medium"
        theme="coreLogic"
        disabled={lineItemStatus?.status === ITEM_STATUS.underReview}
      />
    </div>
  );
}

export default GroupedActionButtons;
