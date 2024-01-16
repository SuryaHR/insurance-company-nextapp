import React from "react";
import securityQusetionContainerStyle from "./securityQuestionContainer.module.scss";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import SecurityQuestionComponent from "@/components/SecurityQuestionComponent";

const pathList = [
  {
    name: "Home",
    path: "/login",
  },
  {
    name: "All Claim",
    path: "/login",
    active: true,
  },
];

function SecurityQuestionContainer() {
  return (
    <div className={securityQusetionContainerStyle.securityQuestionContainer}>
      <GenericBreadcrumb dataList={pathList} />
      <hr className={securityQusetionContainerStyle.divider} />
      <div className="container-fluid p-0 pt-3">
        <div className="row m-0">
          <SecurityQuestionComponent />
        </div>
      </div>
    </div>
  );
}

export default SecurityQuestionContainer;
