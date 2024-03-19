import React from "react";
import originalItemPreviewStyle from "./originalItemPreview.module.scss";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectLineItem from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectLineItem";
import { getUSDCurrency } from "@/utils/utitlity";

function OriginalItemPreview() {
  const lineItem = useAppSelector(selectLineItem);
  const ContentDiv = ({ label, desc }: { label: string; desc: string }) => (
    <div className={originalItemPreviewStyle.contentDiv}>
      <label>{label}</label>
      <div className={originalItemPreviewStyle.contentDiv}>{desc}</div>
    </div>
  );
  return (
    <div className={originalItemPreviewStyle.root}>
      <ContentDiv label="Original Item Description" desc={lineItem?.description ?? ""} />
      <ContentDiv label="Category" desc={lineItem?.category?.name ?? ""} />
      <ContentDiv
        label="Sub-Category"
        desc={lineItem.subCategory ? lineItem.subCategory.name : "NA"}
      />
      <div className={originalItemPreviewStyle.groupedContent}>
        <ContentDiv
          label="Cost Per Unit"
          desc={getUSDCurrency(
            lineItem?.insuredPrice == null ? 0 : lineItem?.insuredPrice
          )}
        />
        <ContentDiv label="Qty Lost / Damaged" desc={lineItem?.quantity} />
        <ContentDiv
          label="Total Cost"
          desc={getUSDCurrency(lineItem?.totalStatedAmount)}
        />
      </div>
      <ContentDiv
        label="Age of Item"
        desc={`${lineItem.ageYears} (Years)  ${lineItem.ageMonths} (Months)`}
      />
      {(lineItem?.brand !== null || lineItem?.model !== null) && (
        <div className={originalItemPreviewStyle.groupedContent}>
          {lineItem?.brand !== null && (
            <ContentDiv label="Brand / Manufacturer" desc={lineItem?.brand} />
          )}
          {lineItem?.model !== null && (
            <ContentDiv label="Model" desc={lineItem?.model} />
          )}
        </div>
      )}
      <div className={originalItemPreviewStyle.groupedContent}>
        {lineItem?.purchaseMethod?.value != "Gift" && (
          <ContentDiv
            label="Purchased From"
            desc={lineItem?.originallyPurchasedFrom?.name ?? "-"}
          />
        )}
        <ContentDiv
          label="Purchase Method"
          desc={lineItem?.purchaseMethod?.value ?? "-"}
        />
      </div>
      {lineItem?.purchaseMethod?.value === "Gift" && (
        <ContentDiv label="Purchase Method" desc={lineItem?.giftedFrom} />
      )}
      <div className={originalItemPreviewStyle.groupedContent}>
        <ContentDiv label="Condition" desc={lineItem?.condition?.conditionName} />
        <ContentDiv label="Room" desc={lineItem?.room?.roomName} />
      </div>
    </div>
  );
}

export default OriginalItemPreview;
