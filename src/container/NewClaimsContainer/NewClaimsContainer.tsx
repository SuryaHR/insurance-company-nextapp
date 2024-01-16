"use client";
import React from "react";
import NewClaimsStyle from "./newClaimsStyle.module.scss";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb/index";
import NewclaimsComponent from "@/components/NewclaimsComponent/index";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import useTranslation from "@/hooks/useTranslation";

function NewclaimsContainer() {
  const { translate }: { translate: claimDetailsTabTranslateType | undefined } =
    useTranslation("claimDetailsTabTranslate");

  const pathList = [
    {
      name: translate?.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: translate?.breadCrumbsHeading?.newClaimWizard,
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
          title={translate?.breadCrumbsHeading?.newClaimWizard}
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
