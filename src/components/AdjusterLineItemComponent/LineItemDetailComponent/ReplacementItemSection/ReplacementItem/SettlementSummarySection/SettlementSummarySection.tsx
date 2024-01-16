import React from "react";
import settlementSummarySectionStyle from "./settlementSummarySection.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";

function SettlementSummarySection() {
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
            value={"Valued".toUpperCase()}
          />
          <CalculatedValue
            id="totalReplaceCost"
            label="Total Replacement Cost"
            value="$33.49"
          />
          <CalculatedValue id="totalCostVal" label="Total Cash Value" value="$33.49" />
        </div>
        <div className={settlementSummarySectionStyle.contentColumn}>
          <CalculatedValue
            id="annualDepreciation"
            label="Annual Depreciation"
            value="0%, 0% max"
          />
          <CalculatedValue id="itemLimit" label="Item Limit" value="$0.00" />
        </div>
        <div className={settlementSummarySectionStyle.contentColumn}>
          <CalculatedValue
            id="total$Depreciation"
            label="Total $ Depreciation"
            value="$0.00"
          />
          <CalculatedValue id="itemOverage" label="Item Overage" value="$0.00" />
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
