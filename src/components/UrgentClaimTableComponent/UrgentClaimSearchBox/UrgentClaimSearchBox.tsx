"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import UrgentClaimSearchStyle from "./UrgentClaimSearchBox.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { handleUrgentClaimSearch } from "@/reducers/UrgentClaimData/UrgentClaimSlice";

type propType = {
  resetPage: () => void;
};
const UrgentClaimSearchBox: React.FC<connectorType & propType> = (props) => {
  const { handleUrgentClaimSearch, resetPage } = props;
  const [searchValue, setSearchValue] = React.useState("");
  const fetchSearchedData = async (searchKeyword: string) => {
    resetPage();
    handleUrgentClaimSearch({ searchKeyword });
  };
  const handleSearch = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value === "") {
      fetchSearchedData(value);
    }
  };
  const searchKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchSearchedData(searchValue);
    }
  };

  return (
    <div className={UrgentClaimSearchStyle.searchBox}>
      <RiSearch2Line className={UrgentClaimSearchStyle.searchIcon} />
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={handleSearch}
        onKeyDown={searchKey}
      />
    </div>
  );
};

const mapDispatchToProps = { handleUrgentClaimSearch };
const connector = connect(null, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;

export default connector(UrgentClaimSearchBox);
