"use client";
import React from "react";
import NewClaimsStyle from "./newClaimsStyle.module.scss";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb/index";
import NewclaimsComponent from "@/components/_adjuster_components/NewclaimsComponent";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { newClaimTransalateProp } from "@/app/[lang]/(adjuster)/new-claim/page";

function NewclaimsContainer() {
  const { translate } =
    useContext<TranslateContextData<newClaimTransalateProp>>(TranslateContext);

  const pathList = [
    {
      name: translate?.newClaimTransalate?.newClaim?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: translate?.newClaimTransalate?.newClaim?.newClaimWizard,
      path: "",
      active: true,
    },
  ];

  return (
    <div className="row">
      <div className={NewClaimsStyle.stickyContainer}>
        <GenericBreadcrumb dataList={pathList} />
        <GenericComponentHeading
          customHeadingClassname={NewClaimsStyle.headingContainer}
          customTitleClassname={NewClaimsStyle.headingTxt}
          title={translate?.newClaimTransalate?.newClaim?.newClaimWizard}
        />
      </div>
      <div className="container-fluid p-0 pt-2">
        <div className="row m-0">
          {/* <SecurityQuestionComponent /> */}
          <NewclaimsComponent />
        </div>
      </div>
    </div>
  );
}

export default NewclaimsContainer;
