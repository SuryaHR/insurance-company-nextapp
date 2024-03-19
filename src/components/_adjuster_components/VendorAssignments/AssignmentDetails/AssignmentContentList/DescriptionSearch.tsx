"use client";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import AssignmentContentListStyle from "./AssignmentContentListStyle.module.scss";
import { addAssignmentDetailsSearchKeyWord } from "@/reducers/_adjuster_reducers/VendorAssignment/AssignmentDetailsSlice";
import SearchBox from "@/components/common/SearchBox/SearchBox";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const DescriptionSearch: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const { searchKeyword, addAssignmentDetailsSearchKeyWord }: React.SetStateAction<any> =
    props;
  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      addAssignmentDetailsSearchKeyWord({ searchKeyword: "" });
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      addAssignmentDetailsSearchKeyWord({ searchKeyword: event.target.value });
    }
  };

  return (
    <div className={AssignmentContentListStyle.searchbox}>
      <SearchBox
        placeholder="Search description"
        value={searchValue}
        onChange={(e) => handleSearch(e)}
        onKeyDown={(e) => searchKey(e)}
      />
    </div>
  );
};

const mapStateToProps = ({ assignmentDetailsData }: any) => ({
  searchKeyword: assignmentDetailsData.searchKeyword,
});
const mapDispatchToProps = {
  addAssignmentDetailsSearchKeyWord,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(DescriptionSearch);
