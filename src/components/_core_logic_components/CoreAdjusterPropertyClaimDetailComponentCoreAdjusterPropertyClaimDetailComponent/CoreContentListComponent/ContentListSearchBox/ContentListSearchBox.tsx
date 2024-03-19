"use client";
import React from "react";
import { addClaimListKeyWord } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import { ConnectedProps, connect } from "react-redux";
import SearchBox from "@/components/common/SearchBox/SearchBox";
import style from "./contentListSearchBox.module.scss";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
  fetchContentList: React.SetStateAction<any>;
}
const ContentListSearchBox: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const {
    setTableLoader,
    searchKeyword,
    addClaimListKeyWord,
    fetchContentList,
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
    <div className={style.searchbox}>
      <SearchBox
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
