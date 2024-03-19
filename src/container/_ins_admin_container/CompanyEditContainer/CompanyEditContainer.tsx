import React from "react";
import styles from "./CompanyEditContainer.module.scss";
import CompanyEdit from "@/components/_ins_admin_components/CompanyEditComponent/CompanyEdit";

interface propsTypes {
  officeId: any;
}

const CompanyEditContainer: React.FC<propsTypes> = ({ officeId }) => {
  return (
    <div className={styles.root}>
      <CompanyEdit officeId={officeId} />
    </div>
  );
};

export default CompanyEditContainer;
