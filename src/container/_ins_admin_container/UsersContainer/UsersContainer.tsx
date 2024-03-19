import React from "react";
import styles from "./userContainer.module.scss";
import UsersComponents from "@/components/_ins_admin_components/UsersComponents";

function UsersContainer() {
  return (
    <div className={styles.root}>
      <UsersComponents />
    </div>
  );
}

export default UsersContainer;
