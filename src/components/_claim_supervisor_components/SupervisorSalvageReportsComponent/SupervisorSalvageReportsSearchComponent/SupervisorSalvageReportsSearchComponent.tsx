"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import styles from "./SupervisorSalvageReportsSearchComponent.module.scss";
import { addSearchKeyWord } from "@/reducers/_adjuster_reducers/ClaimData/ClaimSlice";
import { ConnectedProps, connect } from "react-redux";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const SupervisorSalvageReportsSearchBox: React.FC<connectorType & typeProps> = () => {
  return (
    <div className={styles.searchBox}>
      <RiSearch2Line className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Claim #,Salvage ID,Adjuster Name,Policyholder Name,Item Description"
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
export default connector(SupervisorSalvageReportsSearchBox);
