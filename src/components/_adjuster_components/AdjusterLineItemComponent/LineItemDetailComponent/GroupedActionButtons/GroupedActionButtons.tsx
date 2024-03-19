import React from "react";
import GenericButton from "@/components/common/GenericButton";
import groupedActionButtonsStyle from "./groupedActionButtons.module.scss";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectScheduledItem from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectScheduledItem";
import { ITEM_STATUS } from "@/constants/constants";
import selectItemStatus from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectItemStatus";

interface propType {
  showAcceptStandardCost?: boolean;
  onDeleteClick?: () => void;
  onSupervisorReviewClick: () => void;
  handleAcceptStandardCost: () => void;
}

function GroupedActionButtons(props: propType) {
  const { isScheduledItem, scheduleAmount } = useAppSelector(selectScheduledItem);
  const lineItemStatus = useAppSelector(selectItemStatus);
  const {
    onDeleteClick,
    onSupervisorReviewClick,
    showAcceptStandardCost = false,
    handleAcceptStandardCost,
  } = props;
  return (
    <div className={groupedActionButtonsStyle.root}>
      <GenericButton
        label="Accept Standard Cost"
        size="medium"
        theme="normal"
        disabled={
          showAcceptStandardCost || lineItemStatus?.status === ITEM_STATUS.underReview
        }
        onClickHandler={handleAcceptStandardCost}
      />
      <GenericButton
        label="Supervisor Review"
        size="medium"
        theme="normal"
        onClickHandler={onSupervisorReviewClick}
        disabled={lineItemStatus?.status === ITEM_STATUS.underReview}
      />
      <GenericButton
        label="Save"
        size="medium"
        type="submit"
        theme="normal"
        disabled={
          lineItemStatus?.status === ITEM_STATUS.underReview ||
          (isScheduledItem && scheduleAmount < 1)
        }
      />
      <GenericButton
        onClickHandler={onDeleteClick}
        label="Delete"
        size="medium"
        theme="normal"
        disabled={lineItemStatus?.status === ITEM_STATUS.underReview}
      />
    </div>
  );
}

export default GroupedActionButtons;
