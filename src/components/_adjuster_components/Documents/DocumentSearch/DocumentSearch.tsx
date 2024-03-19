"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import styles from "../documents.module.scss";
import { fetchClaimList } from "@/services/_adjuster_services/ClaimService";
import { addDocSearchKeyWord } from "@/reducers/_adjuster_reducers/ClaimData/ClaimSlice";
import { ConnectedProps, connect } from "react-redux";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const DocumentSearch: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const {
    setTableLoader,
    searchDocumentKeyword,
    addDocSearchKeyWord,
  }: React.SetStateAction<any> = props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchDocumentKeyword !== "" && e.target.value === "") {
      setTableLoader(true);
      addDocSearchKeyWord({ searchDocumentKeyword: "" });
      const result = await fetchClaimList();
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      addDocSearchKeyWord({ searchDocumentKeyword: event.target.value });
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
    <div className={styles.searchBox}>
      <RiSearch2Line className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Document name, uploaded by.."
        value={searchValue}
        onChange={handleSearch}
        onKeyDown={searchKey}
      />
    </div>
  );
};

const mapStateToProps = ({ claimdata }: any) => ({
  searchDocumentKeyword: claimdata.searchDocumentKeyword,
});
const mapDispatchToProps = {
  addDocSearchKeyWord,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(DocumentSearch);
