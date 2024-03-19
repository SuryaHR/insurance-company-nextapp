"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import VendorSearchAssignStyle from "./vendorSearchBoxAssignItems.module.scss";
import { setVendorSearchKeyword } from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import { ConnectedProps, connect } from "react-redux";

const VendorSearchBoxAssignItems: React.FC<connectorType> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const { vendorSearchKeyword, setVendorSearchKeyword }: React.SetStateAction<any> =
    props;
  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (vendorSearchKeyword !== "" && e.target.value === "") {
      setVendorSearchKeyword({ searchKeyword: "" });
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      setVendorSearchKeyword({ searchKeyword: event.target.value });
    }
  };
  return (
    <div className={VendorSearchAssignStyle.searchBox}>
      <RiSearch2Line className={VendorSearchAssignStyle.searchIcon} />
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
  vendorSearchKeyword: addItemsTable.vendorSearchKeyword,
});
const mapDispatchToProps = {
  setVendorSearchKeyword,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(VendorSearchBoxAssignItems);
