import { unknownObjectType } from "@/constants/customTypes";
import Image from "next/image";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import replacementItemStyle from "./replacementItemStyle.module.scss";
import clsx from "clsx";
import SettlementSummarySection from "./SettlementSummarySection";
import { ITEM_STATUS, NO_IMAGE } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import useDebounce from "@/hooks/useDebounce";
import { updateReplacementItem } from "@/reducers/_adjuster_reducers/LineItemDetail/LineItemDetailSlice";
import selectItemTaxDetail from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectItemTaxDetail";
import {
  getUSDCurrency,
  parseFloatWithFixedDecimal,
  parseTranslateString,
} from "@/utils/utitlity";
import { LineItemContext } from "@/components/_adjuster_components/AdjusterLineItemComponent/LineItemContext";
import selectLineItem from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectLineItem";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { lineItemTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-line-item-detail/[claimId]/[itemId]/page";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";
import GenericCurrencyFormat, {
  currencyFormatHandlers,
} from "@/components/common/GenericInput/GenericCurrencyFormat";
interface replaceItemInterface {
  itemDetail: unknownObjectType;
}

export interface calculatedTaxType {
  taxAmt: number;
  rcvTotal: number;
}

function ReplacementItem(props: replaceItemInterface) {
  const {
    translate: {
      lineItemTranslate: { replacementTexts },
    },
  } = useContext<TranslateContextData<lineItemTranslatePropType>>(TranslateContext);

  const { itemDetail } = props;
  const { applyTax, taxRate } = useAppSelector(selectItemTaxDetail);
  const lineItem = useAppSelector(selectLineItem);
  const dispatch = useAppDispatch();
  const replacementItemDispatch = (data: unknownObjectType) =>
    dispatch(updateReplacementItem(data));
  const debounce = useDebounce(replacementItemDispatch, 100);
  const replacedItemPrice = useMemo(
    () => lineItem?.replacedItemPrice,
    [lineItem?.replacedItemPrice]
  );
  const [unitCost, setUnitCost] = useState(replacedItemPrice);
  const [quantity, setQuantity] = useState(lineItem?.replacementQty);
  const [source, setSource] = useState(lineItem?.source);
  const [description, setDescription] = useState(lineItem?.adjusterDescription);
  const { itemReplaced } = useContext(LineItemContext);
  const costUnitInputRef = useRef<currencyFormatHandlers>(null);
  useEffect(() => {
    if (itemReplaced) {
      costUnitInputRef.current?.changeValue(getUSDCurrency(+lineItem?.replacedItemPrice));
      setUnitCost(lineItem?.replacedItemPrice);
      setQuantity(lineItem?.replacementQty);
      setSource(lineItem?.source);
      setDescription(lineItem?.adjusterDescription);
    }
  }, [
    itemReplaced,
    lineItem?.replacedItemPrice,
    lineItem?.replacementQty,
    lineItem?.source,
    lineItem?.adjusterDescription,
  ]);

  const handleUnitCostChange = (value: string) => {
    const unitCostValue = value ? +value : 0;
    setUnitCost(unitCostValue);
    debounce({ unitPrice: unitCostValue, price: unitCostValue });
  };

  const handleQuantityChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value ? +e.target.value : 1;
    setQuantity(e.target.value);
    debounce({ quantity: value });
  };

  const calculatedTax = useMemo<calculatedTaxType>(() => {
    // if (!applyTax) return { taxAmt: 0, rcvTotal: 0 };
    const _price = Number(unitCost);
    const qty = Number(quantity);
    const totalAmount = (!_price ? 0 : Number(_price)) * (!qty ? 1 : Number(qty));
    const rcv = parseFloatWithFixedDecimal(totalAmount);
    let appliedTax = 0;
    if (applyTax) {
      appliedTax = taxRate;
    }

    const taxAmt = parseFloatWithFixedDecimal((rcv * appliedTax) / 100);
    const rcvTotal = rcv + taxAmt;
    return { taxAmt: applyTax ? taxAmt : 0, rcvTotal: +rcvTotal.toFixed(2) };
  }, [applyTax, quantity, unitCost, taxRate]);

  return (
    <div className={replacementItemStyle.root}>
      <div className={replacementItemStyle.descriptionDiv}>
        <div className={replacementItemStyle.imageDiv}>
          <Image
            unoptimized={true}
            src={itemDetail?.imageURL ?? lineItem?.imageURL ?? NO_IMAGE}
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
            <label htmlFor="desc">{replacementTexts?.formField?.desc?.label}</label>
            <textarea
              className={replacementItemStyle.descField}
              rows={5}
              id="desc"
              value={description}
              cols={20}
              placeholder={replacementTexts?.formField?.desc?.placeholder}
              disabled={lineItem?.status?.status === ITEM_STATUS.underReview}
              onChange={(e) => {
                const value = e.target.value;
                setDescription(e.target.value);
                debounce({ description: value });
              }}
            />
          </div>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="source">{replacementTexts?.formField?.source?.label}</label>
            <GenericNormalInput
              id="source"
              value={source}
              placeholder={replacementTexts?.formField?.source?.placeholder}
              disabled={lineItem?.status?.status === ITEM_STATUS.underReview}
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
            <label htmlFor="unitCost">
              {replacementTexts?.formField?.unitCost?.label}
            </label>
            <GenericCurrencyFormat
              ref={costUnitInputRef}
              defaultValue={unitCost}
              placeholder={replacementTexts?.formField?.unitCost?.placeholder}
              handleChange={({ value }) => {
                handleUnitCostChange(value);
              }}
              disabled={lineItem?.status?.status === ITEM_STATUS.underReview}
            />
          </div>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="qty">{replacementTexts?.formField?.replaceQty?.label}</label>
            <GenericNormalInput
              id="qty"
              value={quantity}
              type="number"
              placeholder={replacementTexts?.formField?.replaceQty?.placeholder}
              onChange={handleQuantityChange}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                if (!e.target.value || +e.target.value < 1) {
                  setQuantity(1);
                  debounce({ quantity: 1 });
                }
              }}
              isNumberOnly={true}
              disabled={lineItem?.status?.status === ITEM_STATUS.underReview}
            />
          </div>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="tax">
              {parseTranslateString({
                parseString: replacementTexts?.formField?.taxes?.label,
                replaceMapper: { TAX: applyTax ? taxRate : 0 },
              })}
            </label>
            <div id="tax">{getUSDCurrency(calculatedTax.taxAmt)}</div>
          </div>
        </div>
        <div>
          <div className={replacementItemStyle.formControl}>
            <label htmlFor="totalReplaceCost">
              {replacementTexts?.formField?.totalCost?.label}
            </label>
            <div id="totalReplaceCost">{getUSDCurrency(calculatedTax.rcvTotal)}</div>
          </div>
        </div>
      </div>
      <SettlementSummarySection />
    </div>
  );
}

export default ReplacementItem;
