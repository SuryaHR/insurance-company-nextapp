"use client";
import React from "react";
import { fetchClaimList } from "@/services/_adjuster_services/ClaimService";
import { addSearchKeyWord } from "@/reducers/_adjuster_reducers/ClaimData/ClaimSlice";
import { ConnectedProps, connect } from "react-redux";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import SearchBox from "@/components/common/SearchBox/SearchBox";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
  setResetPagination: React.SetStateAction<any>;
}
const OpenClaimsSearchBox: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const {
    setTableLoader,
    searchKeyword,
    addSearchKeyWord,
    setResetPagination,
  }: React.SetStateAction<any> = props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      setTableLoader(true);
      addSearchKeyWord({ searchKeyword: "" });
      setResetPagination(true);
      const result = await fetchClaimList();
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      setTableLoader(true);
      addSearchKeyWord({ searchKeyword: event.target.value });
      setResetPagination(true);
      const result = await fetchClaimList(
        1,
        PAGINATION_LIMIT_20,
        "createDate",
        "desc",
        event.target.value
      );
      if (result) {
        setTableLoader(false);
      }
    }
  };

  return (
    <SearchBox
      placeholder="Search..."
      value={searchValue}
      onChange={handleSearch}
      onKeyDown={searchKey}
    />
  );
};

const mapStateToProps = ({ claimdata }: any) => ({
  searchKeyword: claimdata.searchKeyword,
});
const mapDispatchToProps = {
  addSearchKeyWord,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(OpenClaimsSearchBox);
