import React from "react";
import styles from "./NewEmployContainer.module.scss";
import NewEmployComponent from "@/components/_ins_admin_components/NewEmployComponent/NewEmployComponent";

const CompanyEditContainer: React.FC = () => {
  return (
    <div className={styles.root}>
      <NewEmployComponent />
    </div>
  );
};

export default CompanyEditContainer;
