"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import ContentListSearchBoxStyle from "./ContentListSearchBox.module.scss";
import { fetchContentList } from "@/services/ClaimContentListService";
import { addClaimListKeyWord } from "@/reducers/ClaimData/ClaimContentSlice";
import { ConnectedProps, connect } from "react-redux";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const ContentListSearchBox: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const {
    setTableLoader,
    searchKeyword,
    addClaimListKeyWord,
  }: React.SetStateAction<any> = props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      setTableLoader(true);
      addClaimListKeyWord({ searchKeyword: "" });
      const result = await fetchContentList();
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      setTableLoader(true);
      addClaimListKeyWord({ searchKeyword: event.target.value });
      const result = await fetchContentList(event.target.value);
      if (result) {
        setTableLoader(false);
      }
    }
  };

  return (
    <div className={ContentListSearchBoxStyle.searchBox}>
      <RiSearch2Line className={ContentListSearchBoxStyle.searchIcon} />
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

const mapStateToProps = ({ claimContentdata }: any) => ({
  searchKeyword: claimContentdata.searchKeyword,
});
const mapDispatchToProps = {
  addClaimListKeyWord,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ContentListSearchBox);
