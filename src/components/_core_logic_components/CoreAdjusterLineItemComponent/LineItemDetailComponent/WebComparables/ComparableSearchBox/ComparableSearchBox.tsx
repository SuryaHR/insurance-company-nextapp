import React, { useContext } from "react";
import { RiSearch2Line } from "react-icons/ri";
import comparableSearchBoxStyle from "./comparableSearchBox.module.scss";
import GenericSelect from "@/components/common/GenericSelect";
import { WEB_SEARCH_ENGINES } from "@/constants/constants";
import { lineItemTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-line-item-detail/[claimId]/[itemId]/page";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

interface comparableSearchBoxType {
  selectedEngine: typeof WEB_SEARCH_ENGINES;
  searchKey: string;
  // setSearchInput: React.Dispatch<React.SetStateAction<searchInputType>>;
  updateState: (key: string, value: string | number | object) => void;
  handleSubmit: () => void;
  searchByEngine: (engine: typeof WEB_SEARCH_ENGINES) => void;
}

const ComparableSearchBox = (props: comparableSearchBoxType) => {
  const {
    translate: {
      lineItemTranslate: { searchItem },
    },
  } = useContext<TranslateContextData<lineItemTranslatePropType>>(TranslateContext);

  const { searchKey, selectedEngine, updateState, handleSubmit, searchByEngine } = props;
  // const [searchValue, setSearchValue] = React.useState(searchKey);

  const handleSearch = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateState("searchKey", value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // if (isSearching) return null;
  return (
    <div className={comparableSearchBoxStyle.root}>
      <div className={comparableSearchBoxStyle.searchBox}>
        <RiSearch2Line className={comparableSearchBoxStyle.searchIcon} />
        <input
          type="text"
          placeholder={searchItem?.formField?.searchInput?.placeholder}
          value={searchKey}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
      <GenericSelect
        formControlClassname={comparableSearchBoxStyle.selectFormControl}
        customStyles={{
          control: {
            background: "#00aeef",
            minHeight: "37px",
            textTransform: "uppercase",
            fontSize: "12px",
            color: "#fff",
          },
          singleValue: {
            color: "#fff",
          },
          input: { color: "#fff" },
        }}
        options={WEB_SEARCH_ENGINES}
        getOptionLabel={(option: { name: any }) => option.name}
        getOptionValue={(option: { id: any }) => option.id}
        name="engine"
        selected={selectedEngine}
        isClearable={false}
        onChange={(e: typeof WEB_SEARCH_ENGINES) => {
          const value = { ...e };
          searchByEngine(value);
        }}
      />
    </div>
  );
};

export default ComparableSearchBox;
