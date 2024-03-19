"use client";
import React, { useEffect, useState } from "react";
import styles from "./EmployeList.module.scss";
import GenericButton from "@/components/common/GenericButton";
import CustomLoader from "@/components/common/CustomLoader";
import EmployeListSelectComponent from "./EmployeListSelectComponent/EmployeListSelectComponent";
import EmployeListSearchComponent from "./EmployeListSearchComponent/EmployeListSearchComponent";
import EmployeListTable from "./EmployeListTable/EmployeListTable";
interface propsTypes {
  data: any;
}

const EmployeList: React.FC<propsTypes> = ({ data }) => {
  const [isLoader, setIsLoader] = useState<boolean>(false);

  useEffect(() => {
    setIsLoader(false);
  }, [data]);

  return (
    <div className={styles.EmployeListCont}>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <div className={styles.listContainer}>
        <div className={`row ${styles.listContentContainer}`}>
          <div className="col-lg-4 col-md-4 col-sm-12 col-12 d-flex mb-2">
            <GenericButton
              label="New Employee"
              theme="normal"
              size="small"
              type="submit"
              btnClassname={styles.employListActionBtn}
            />
            <GenericButton
              label="Load from file"
              theme="normal"
              size="small"
              type="submit"
              btnClassname={styles.employListActionBtn}
            />
            <GenericButton
              label="Export"
              theme="normal"
              size="small"
              type="submit"
              btnClassname={styles.employListActionBtn}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 col-12">
            <EmployeListSelectComponent />
          </div>

          <div className="col-lg-4 col-md-4 col-sm-12 col-12">
            <EmployeListSearchComponent />
          </div>
        </div>
      </div>
      <div className={styles.tableCont}>
        <EmployeListTable />
      </div>
    </div>
  );
};

export default EmployeList;
