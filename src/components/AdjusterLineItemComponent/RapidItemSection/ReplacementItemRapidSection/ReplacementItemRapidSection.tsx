import React from "react";
import replacementItemRapidSectionStyle from "./replacementItemRapidSection.module.scss";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectReplacementItem from "@/reducers/LineItemDetail/Selectors/selectReplacementItem";
import { NO_IMAGE } from "@/constants/constants";
import selectLineItemDetailState from "@/reducers/LineItemDetail/Selectors/selectLineItemDetailState";

function ReplacementItemRapidSection() {
  const replacementItem = useAppSelector(selectReplacementItem);
  const { lineItem } = useAppSelector(selectLineItemDetailState);
  return (
    <div className={replacementItemRapidSectionStyle.root}>
      <h5 className={replacementItemRapidSectionStyle.heading}>Replacement Item</h5>
      {replacementItem && (
        <>
          <div>{replacementItem?.description}</div>
          <div className={replacementItemRapidSectionStyle.content}>
            <div className={replacementItemRapidSectionStyle.removeIcon}>
              <IoMdClose size={20} className={replacementItemRapidSectionStyle.icon} />
            </div>
            <div className={replacementItemRapidSectionStyle.productImage}>
              {/* <Image
                unoptimized={true}
                src={imgUrl}
                alt="products"
                fill={true}
                sizes="100%"
                style={{ objectFit: "contain" }}
              /> */}

              <Image
                unoptimized={true}
                src={replacementItem?.imageURL ?? NO_IMAGE}
                alt="products"
                fill={true}
                sizes="100%"
                style={{ objectFit: "contain" }}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = NO_IMAGE;
                }}
              />
            </div>
            <div className={replacementItemRapidSectionStyle.calculations}>
              <label>Cost Per Unit</label>
              <div>${replacementItem?.unitPrice ?? 0}</div>
              <label>Total Replacement Cost</label>
              <div>${lineItem?.rcvTotal}</div>
              <label>Total Cash Value</label>
              <div>${lineItem?.acv}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReplacementItemRapidSection;
