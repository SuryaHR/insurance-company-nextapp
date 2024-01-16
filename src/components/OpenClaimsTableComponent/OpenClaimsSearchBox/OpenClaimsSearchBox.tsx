"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import OpenClaimsSearchStyle from "./OpenClaimsSearchBox.module.scss";
import { fetchClaimList } from "@/services/ClaimService";
import { addSearchKeyWord } from "@/reducers/ClaimData/ClaimSlice";
import { ConnectedProps, connect } from "react-redux";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const OpenClaimsSearchBox: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const { setTableLoader, searchKeyword, addSearchKeyWord }: React.SetStateAction<any> =
    props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      setTableLoader(true);
      addSearchKeyWord({ searchKeyword: "" });
      const result = await fetchClaimList();
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      addSearchKeyWord({ searchKeyword: event.target.value });
      const result = await fetchClaimList(
        1,
        20,
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
    <div className={OpenClaimsSearchStyle.searchBox}>
      <RiSearch2Line className={OpenClaimsSearchStyle.searchIcon} />
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

const mapStateToProps = ({ claimdata }: any) => ({
  searchKeyword: claimdata.searchKeyword,
});
const mapDispatchToProps = {
  addSearchKeyWord,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(OpenClaimsSearchBox);
