"use client";
import React, { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { connect, ConnectedProps } from "react-redux";
import SearchAddStyle from "./searchBoxAddItems.module.scss";
import { RootState } from "@/store/store";
import { setSearchKeyword } from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
interface SearchBoxAddItemsProps {
  setSearchKeyword: (keyword: string) => void;
}

const SearchBoxAddItems: React.FC<SearchBoxAddItemsProps & connectorType> = ({
  setSearchKeyword,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSearchKeyword(searchValue);
  };
  return (
    <div className={SearchAddStyle.searchBox}>
      <RiSearch2Line className={SearchAddStyle.searchIcon} />
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={handleSearch}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  addItemsTableData: state.addItemsTable.addItemsTableData,
  selectedItems: state.addItemsTable.selectedItems,
  isAnyItemSelected: state.addItemsTable.isAnyItemSelected,
  selectedCategory: state.addItemsTable.selectedCategory,
  searchKeyword: state.addItemsTable.searchKeyword,
});

const mapDispatchToProps = {
  setSearchKeyword,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(SearchBoxAddItems);
