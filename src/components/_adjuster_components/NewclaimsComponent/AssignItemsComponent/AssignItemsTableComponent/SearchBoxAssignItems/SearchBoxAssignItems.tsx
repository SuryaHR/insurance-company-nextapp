"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import SearchAssignStyle from "./searchBoxAssignItems.module.scss";
import { setSearchKeyword } from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import { ConnectedProps, connect } from "react-redux";

const SearchBoxAssignItems: React.FC<connectorType> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const { searchKeyword, setSearchKeyword }: React.SetStateAction<any> = props;
  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      setSearchKeyword({ searchKeyword: "" });
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      setSearchKeyword({ searchKeyword: event.target.value });
    }
  };

  return (
    <div className={SearchAssignStyle.searchBox}>
      <RiSearch2Line className={SearchAssignStyle.searchIcon} />
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

const mapStateToProps = ({ addItemsTable }: any) => ({
  searchKeyword: addItemsTable.searchKeyword,
});
const mapDispatchToProps = {
  setSearchKeyword,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(SearchBoxAssignItems);
