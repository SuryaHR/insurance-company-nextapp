import React, { useContext } from "react";
import replacementItemRapidSectionStyle from "./replacementItemRapidSection.module.scss";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import selectReplacementItem from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectReplacementItem";
import { ITEM_STATUS, NO_IMAGE } from "@/constants/constants";
import selectLineItemDetailState from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectLineItemDetailState";
import { removeReplacement } from "@/reducers/_adjuster_reducers/LineItemDetail/LineItemThunkService";
import { LineItemContext } from "../../LineItemContext";
import { getUSDCurrency } from "@/utils/utitlity";

function ReplacementItemRapidSection() {
  const dispatch = useAppDispatch();
  const replacementItem = useAppSelector(selectReplacementItem);
  const { lineItem, acceptedStandardCost } = useAppSelector(selectLineItemDetailState);
  const { setShowLoader, files, clearFile } = useContext(LineItemContext);
  const removeComparable = () => {
    setShowLoader(true);
    dispatch(
      removeReplacement({
        item: replacementItem,
        attachmentList: files,
        clbk: () => {
          setShowLoader(false);
          clearFile();
        },
      })
    );
  };
  return (
    <div className={replacementItemRapidSectionStyle.root}>
      <h5 className={replacementItemRapidSectionStyle.heading}>Replacement Item</h5>
      {(replacementItem || acceptedStandardCost) && (
        <>
          <div className={replacementItemRapidSectionStyle.desc}>
            {lineItem?.adjusterDescription}
          </div>
          <div className={replacementItemRapidSectionStyle.content}>
            {lineItem?.status?.status !== ITEM_STATUS.underReview && (
              <div className={replacementItemRapidSectionStyle.removeIcon}>
                <IoMdClose
                  size={20}
                  className={replacementItemRapidSectionStyle.icon}
                  onClick={removeComparable}
                />
              </div>
            )}
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
                src={replacementItem?.imageURL ?? lineItem?.imageURL ?? NO_IMAGE}
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
              <div>{getUSDCurrency(lineItem?.replacedItemPrice ?? 0)}</div>
              <label>Total Replacement Cost</label>
              <div>{getUSDCurrency(lineItem?.rcvTotal)}</div>
              <label>Total Cash Value</label>
              <div>{getUSDCurrency(lineItem?.acv)}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReplacementItemRapidSection;
