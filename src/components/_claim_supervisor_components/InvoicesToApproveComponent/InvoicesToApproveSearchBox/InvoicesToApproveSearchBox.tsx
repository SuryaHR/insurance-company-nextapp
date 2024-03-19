"use client";
import React from "react";
import VendorSearchAssignStyle from "./invoicesToApproveSearchBox.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";

import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";
import { fetchVendorTableAction } from "@/reducers/_claim_supervisor_reducers/VendorInvoices/InvoicesVendorSlice";
import { addVendorInvoicesSearchKeyWord } from "@/reducers/_claim_supervisor_reducers/VendorInvoices/InvoicesVendorSlice";
import SearchBox from "@/components/common/SearchBox/SearchBox";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const InvoicesToApproveSearchBox: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const {
    searchKeyword,
    addVendorInvoicesSearchKeyWord,
    setTableLoader,
    fetchVendorTableAction,
    userId,
  }: React.SetStateAction<any> = props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      setTableLoader(true);
      addVendorInvoicesSearchKeyWord({ searchKeyword: "" });
      fetchVendorTableAction({
        page: 1,
        userId: userId,
        sortBy: "",
        orderBy: "",
        searchString: "",
        limit: 10,
      }).then(() => {
        setTableLoader(false);
      });
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      setTableLoader(true);
      addVendorInvoicesSearchKeyWord({ searchKeyword: event.target.value });
      fetchVendorTableAction({
        page: 1,
        userId: userId,
        sortBy: "",
        orderBy: "",
        searchString: event.target.value,
        limit: 10,
      }).then(() => {
        setTableLoader(false);
      });
    }
  };

  return (
    <div className={VendorSearchAssignStyle.searchBox}>
      <SearchBox
        placeholder="Search..."
        value={searchValue}
        onChange={handleSearch}
        onKeyDown={searchKey}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  searchKeyword: state.vendorInvoices.searchKeyword,
  userId: selectLoggedInUserId(state),
});
const mapDispatchToProps = {
  addVendorInvoicesSearchKeyWord,
  fetchVendorTableAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(InvoicesToApproveSearchBox);
