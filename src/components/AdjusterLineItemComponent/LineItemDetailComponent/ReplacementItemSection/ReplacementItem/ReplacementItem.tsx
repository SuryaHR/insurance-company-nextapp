import { unknownObjectType } from "@/constants/customTypes";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import replacementItemStyle from "./replacementItemStyle.module.scss";
import GenericInput from "@/components/common/GenericInput";
import clsx from "clsx";
import SettlementSummarySection from "./SettlementSummarySection";
import { NO_IMAGE } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import useDebounce from "@/hooks/useDebounce";
import { updateReplacementItem } from "@/reducers/LineItemDetail/LineItemDetailSlice";
import selectItemTaxDetail from "@/reducers/LineItemDetail/Selectors/selectItemTaxDetail";
import { parseFloatWithFixedDecimal } from "@/utils/utitlity";
interface replaceItemInterface {
  itemDetail: unknownObjectType;
}

function ReplacementItem(props: replaceItemInterface) {
  const { itemDetail } = props;
  const { applyTax, taxRate } = useAppSelector(selectItemTaxDetail);
  const dispatch = useAppDispatch();
  const replacementItemDispatch = (data: unknownObjectType) =>
    dispatch(updateReplacementItem(data));
  const debounce = useDebounce(replacementItemDispatch, 100);
  const [unitCost, setUnitCost] = useState(itemDetail?.unitPrice);
  const [quantity, setQuantity] = useState(itemDetail?.quantity);
  const [source, setSource] = useState(itemDetail?.buyURL);
  const [description, setDescription] = useState(itemDetail?.description);

  const handleUnitCostChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value ? +e.target.value : 0;
    setUnitCost(e.target.value);
    debounce({ unitPrice: value, price: value });
  };

  const handleQuantityChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value ? +e.target.value : 1;
    setQuantity(e.target.value);
    debounce({ quantity: value });
  };

  const calculatedTax = useMemo(() => {
    // if (!applyTax) return { taxAmt: 0, rcvTotal: 0 };
    const _price = Number(unitCost);
    const qty = Number(quantity);
    const totalAmount = (!_price ? 0 : Number(_price)) * (!qty ? 1 : Number(qty));
    const rcv = parseFloatWithFixedDecimal(totalAmount);
    console.log("ppppp", totalAmount);
    let appliedTax = 0;
    if (applyTax) {
      appliedTax = taxRate;
    }

    const taxAmt = parseFloatWithFixedDecimal((rcv * appliedTax) / 100);
    const rcvTotal = rcv + taxAmt;
    return { taxAmt: applyTax ? taxAmt : 0, rcvTotal };
  }, [applyTax, quantity, unitCost, taxRate]);

  return (
    <div className={replacementItemStyle.root}>
      <div className={replacementItemStyle.descriptionDiv}>
        <div className={replacementItemStyle.imageDiv}>
          <Image
            unoptimized={true}
            src={itemDetail?.imageURL ?? NO_IMAGE}
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
        <div className={replacementItemStyle.formGroup}>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="desc">Description</label>
            <textarea
              className={replacementItemStyle.descField}
              rows={5}
              id="desc"
              value={description}
              cols={20}
              placeholder="Description"
              onChange={(e) => {
                const value = e.target.value;
                setDescription(e.target.value);
                debounce({ description: value });
              }}
            />
          </div>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="source">Source</label>
            <GenericInput
              id="source"
              value={source}
              placeholder="Source"
              onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setSource(e.target.value);
                debounce({ buyURL: value });
              }}
            />
          </div>
        </div>
      </div>
      <div className={replacementItemStyle.replaceDetailDiv}>
        <div
          className={clsx(
            replacementItemStyle.formGroup,
            replacementItemStyle.replaceDetailFields
          )}
        >
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="unitCost">Unit Cost</label>
            <GenericInput
              id="unitCost"
              type="number"
              value={unitCost}
              placeholder="Unit Cost"
              onChange={handleUnitCostChange}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                if (!e.target.value) {
                  setUnitCost(0);
                }
              }}
            />
          </div>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="qty">Replacement Quantity</label>
            <GenericInput
              id="qty"
              value={quantity}
              type="number"
              placeholder="Replacement Quantity"
              onChange={handleQuantityChange}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                if (!e.target.value || +e.target.value < 1) {
                  setQuantity(1);
                  debounce({ quantity: 1 });
                }
              }}
            />
          </div>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="tax">Taxes({applyTax ? taxRate : 0}%)</label>
            <div id="tax">${calculatedTax.taxAmt}</div>
          </div>
        </div>
        <div>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="totalReplaceCost">Total Replacement Cost</label>
            <div id="totalReplaceCost">${calculatedTax.rcvTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <SettlementSummarySection />
    </div>
  );
}

export default ReplacementItem;
