import GenericButton from "@/components/common/GenericButton";
import React from "react";
import webComparablesStyle from "../webComparables.module.scss";

interface priceLimitPropType {
  startPrice: number;
  endPrice: number;
  handleSubmit: () => void;
  updateState: (key: string, value: string | number | object) => void;
  isSearching: boolean;
}

const PriceLimitComparable = (props: priceLimitPropType) => {
  const { startPrice, endPrice, handleSubmit, updateState, isSearching } = props;
  // const [pFrom, setPFrom] = useState(startPrice);
  // const [pTo, setPTo] = useState(endPrice);

  const handlePriceFromChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    updateState("startPrice", value);
  };

  const handlePriceToChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = +e.target.value;
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
            placeholder="Price From"
            id="priceFrom"
            value={startPrice}
            onChange={handlePriceFromChange}
            disabled={isSearching}
          />
        </div>
        <div>To</div>
        <div className={webComparablesStyle.formGroup}>
          <label className={webComparablesStyle.priceRangeLabel} htmlFor="priceTo">
            $
          </label>
          <input
            autoComplete="off"
            className="hideInputArrow"
            id="priceTo"
            type="number"
            placeholder="Price To"
            value={endPrice}
            onChange={handlePriceToChange}
            disabled={isSearching}
          />
        </div>
      </div>
      <GenericButton
        disabled={isSearching}
        label="Go"
        size="medium"
        theme="existingDarkBlueBtn"
        onClickHandler={handleSubmitPress}
      />
    </div>
  );
};

export default PriceLimitComparable;
