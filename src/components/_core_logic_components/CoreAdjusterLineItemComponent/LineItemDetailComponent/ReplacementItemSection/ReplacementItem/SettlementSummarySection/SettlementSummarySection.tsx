import React from "react";
import settlementSummarySectionStyle from "./settlementSummarySection.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectItemStatus from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectItemStatus";
import selectLineItem from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectLineItem";
import { getUSDCurrency } from "@/utils/utitlity";

function SettlementSummarySection() {
  const status = useAppSelector(selectItemStatus);
  const lineItem = useAppSelector(selectLineItem);

  const CalculatedValue = ({
    label,
    value,
    id,
  }: {
    label: string;
    value: string;
    id: string;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <div id={id}>{value}</div>
    </div>
  );

  return (
    <div className={settlementSummarySectionStyle.root}>
      <GenericComponentHeading
        title="Settlement Summary"
        customTitleClassname={settlementSummarySectionStyle.heading}
      />
      <div className={settlementSummarySectionStyle.content}>
        <div className={settlementSummarySectionStyle.contentColumn}>
          <CalculatedValue
            id="status"
            label="Item Status"
            value={status?.status?.toUpperCase()}
          />
          <CalculatedValue
            id="totalReplaceCost"
            label="Total Replacement Cost"
            value={getUSDCurrency(lineItem.rcvTotal == null ? 0 : lineItem.rcvTotal)}
          />
          <CalculatedValue
            id="totalCostVal"
            label="Total Cash Value"
            value={getUSDCurrency(lineItem?.acv == null ? 0 : lineItem.acv)}
          />
        </div>
        <div className={settlementSummarySectionStyle.contentColumn}>
          <CalculatedValue
            id="annualDepreciation"
            label="Annual Depreciation"
            value={lineItem.depriciationRateStr}
          />
          <CalculatedValue
            id="itemLimit"
            label="Item Limit"
            value={getUSDCurrency(
              lineItem.individualLimitAmount == null ? 0 : lineItem.individualLimitAmount
            )}
          />
        </div>
        <div className={settlementSummarySectionStyle.contentColumn}>
          <CalculatedValue
            id="total$Depreciation"
            label="Total $ Depreciation"
            value={getUSDCurrency(
              lineItem.depreciationAmount == null ? 0 : lineItem.depreciationAmount
            )}
          />
          <CalculatedValue
            id="itemOverage"
            label="Item Overage"
            value={getUSDCurrency(
              lineItem.itemOverage == null ? 0 : lineItem.itemOverage
            )}
          />
        </div>
      </div>

      <div className={settlementSummarySectionStyle.paymentHistory}>
        <label htmlFor="paymentHistory">Payment History</label>
        <div id="paymentHistory"></div>
      </div>
    </div>
  );
}

export default SettlementSummarySection;
