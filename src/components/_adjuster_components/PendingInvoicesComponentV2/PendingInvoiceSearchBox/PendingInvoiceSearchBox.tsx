"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import pendingSearchStyle from "./pendingInvoiceSearchBox.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { handlePendingInvoiceSearch } from "@/reducers/_adjuster_reducers/PendingInvoice/PendingInvoiceSlice";

type propType = {
  resetPage: () => void;
};

const PendingInvoiceSearchBox: React.FC<connectorType & propType> = (props) => {
  const { handlePendingInvoiceSearch, resetPage } = props;
  const [searchValue, setSearchValue] = React.useState("");
  const fetchSearchedData = async (searchKeyword: string) => {
    handlePendingInvoiceSearch({ searchKeyword });
    resetPage();
  };

  const handleSearch = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value === "") {
      fetchSearchedData(value);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchSearchedData(searchValue);
    }
  };

  return (
    <div className={pendingSearchStyle.searchBox}>
      <RiSearch2Line className={pendingSearchStyle.searchIcon} />
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

const mapDispatchToProps = {
  handlePendingInvoiceSearch,
};

const connector = connect(null, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;

export default connector(PendingInvoiceSearchBox);
