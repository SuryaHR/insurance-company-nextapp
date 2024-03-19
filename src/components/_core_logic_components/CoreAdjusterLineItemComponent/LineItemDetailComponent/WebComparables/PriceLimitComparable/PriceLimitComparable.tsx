import GenericButton from "@/components/common/GenericButton";
import React, { useContext } from "react";
import webComparablesStyle from "../webComparables.module.scss";
import { lineItemTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-line-item-detail/[claimId]/[itemId]/page";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

interface priceLimitPropType {
  startPrice: number;
  endPrice: number;
  handleSubmit: () => void;
  updateState: (key: string, value: string | number | object) => void;
}

const PriceLimitComparable = (props: priceLimitPropType) => {
  const {
    translate: {
      lineItemTranslate: { searchItem },
    },
  } = useContext<TranslateContextData<lineItemTranslatePropType>>(TranslateContext);

  const { startPrice, endPrice, handleSubmit, updateState } = props;
  // const [pFrom, setPFrom] = useState(startPrice);
  // const [pTo, setPTo] = useState(endPrice);

  const handlePriceFromChange = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    updateState("startPrice", value);
  };

  const handlePriceToChange = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    updateState("endPrice", value);
  };

  const handleSubmitPress = () => {
    handleSubmit();
    // handleSubmit({ startPrice: +pFrom, endPrice: +pTo });
  };
  return (
    <div className={webComparablesStyle.limitSearchSection}>
      <div className={webComparablesStyle.inputSection}>
        <div className={webComparablesStyle.formGroup}>
          <label className={webComparablesStyle.priceRangeLabel} htmlFor="priceFrom">
            $
          </label>
          <input
            autoComplete="off"
            className="hideInputArrow"
            type="number"
            placeholder={searchItem?.formField?.priceFrom?.placeholder}
            id="priceFrom"
            value={startPrice}
            onChange={handlePriceFromChange}
          />
        </div>
        <div>{searchItem?.toText}</div>
        <div className={webComparablesStyle.formGroup}>
          <label className={webComparablesStyle.priceRangeLabel} htmlFor="priceTo">
            $
          </label>
          <input
            autoComplete="off"
            className="hideInputArrow"
            id="priceTo"
            type="number"
            placeholder={searchItem?.formField?.priceTo?.placeholder}
            value={endPrice}
            onChange={handlePriceToChange}
          />
        </div>
      </div>
      <GenericButton
        label={searchItem?.formField?.goBtn?.text}
        size="medium"
        theme="coreLogic"
        onClickHandler={handleSubmitPress}
      />
    </div>
  );
};

export default PriceLimitComparable;
