"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import AdjusterByCompanySearchStyle from "./AdjusterByCompanySearch.module.scss";
import { addAdjusterSearchKeyWord } from "@/reducers/_adjuster_reducers/ClaimData/ClaimDetailsBtnSlice";
import { ConnectedProps, connect } from "react-redux";

interface typeProps {
  setTableLoader?: React.SetStateAction<any>;
}
const AdjusterByCompanySearch: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const { searchAdjusterKeyword, addAdjusterSearchKeyWord }: React.SetStateAction<any> =
    props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchAdjusterKeyword !== "" && e.target.value === "") {
      addAdjusterSearchKeyWord({ searchAdjusterKeyword: "" });
    } else {
      addAdjusterSearchKeyWord({ searchAdjusterKeyword: e.target.value });
    }
  };

  return (
    <div className={AdjusterByCompanySearchStyle.searchBox}>
      <RiSearch2Line className={AdjusterByCompanySearchStyle.searchIcon} />
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={handleSearch}
      />
    </div>
  );
};

const mapStateToProps = ({ ClaimDetailsBtn }: any) => ({
  searchAdjusterKeyword: ClaimDetailsBtn.searchAdjusterKeyword,
});
const mapDispatchToProps = {
  addAdjusterSearchKeyWord,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AdjusterByCompanySearch);
