"use client";
import React, { useEffect } from "react";
import styles from "./EmployeListSearchComponent.module.scss";
import { RiSearch2Line } from "react-icons/ri";

const EmployeListSearchComponent = () => {
  useEffect(() => {}, []);

  return (
    <div className={styles.searchBox}>
      <RiSearch2Line className={styles.searchIcon} />
      <input type="text" placeholder="Branch Name, City, Zip Code" />
    </div>
  );
};

export default EmployeListSearchComponent;
