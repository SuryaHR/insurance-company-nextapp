import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import comparableSearchBoxStyle from "./comparableSearchBox.module.scss";
import GenericSelect from "@/components/common/GenericSelect";
import { WEB_SEARCH_ENGINES } from "@/constants/constants";

interface comparableSearchBoxType {
  selectedEngine: typeof WEB_SEARCH_ENGINES;
  searchKey: string;
  // setSearchInput: React.Dispatch<React.SetStateAction<searchInputType>>;
  updateState: (key: string, value: string | number | object) => void;
  handleSubmit: () => void;
  isSearching: boolean;
  searchByEngine: (engine: typeof WEB_SEARCH_ENGINES) => void;
}

const ComparableSearchBox = (props: comparableSearchBoxType) => {
  const {
    searchKey,
    selectedEngine,
    updateState,
    handleSubmit,
    isSearching,
    searchByEngine,
  } = props;
  // const [searchValue, setSearchValue] = React.useState(searchKey);

  const handleSearch = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateState("searchKey", value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
          placeholder="Search..."
          value={searchKey}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
        />
      </div>
      <GenericSelect
        formControlClassname={comparableSearchBoxStyle.selectFormControl}
        customStyles={{
          control: {
            background: "#347ab6",
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
        disabled={isSearching}
        onChange={(e: typeof WEB_SEARCH_ENGINES) => {
          const value = { ...e };
          searchByEngine(value);
        }}
      />
    </div>
  );
};

export default ComparableSearchBox;
