import React from "react";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import securityContainerStyle from "./securityContainer.module.scss";
import SecurityComponent from "@/components/SecurityComponent";
import { Locale } from "@/i18n.config";
import { getTranslate } from "@/translations";
import { securityTranslateType } from "@/translations/securityTranslate/en";

const pathList = [
  {
    name: "Home",
    path: "/login",
  },
  {
    name: "Support",
    active: true,
    path: "",
  },
];

async function SecurityContainer({ lang }: { lang: Locale }) {
  const translate: securityTranslateType = await getTranslate(lang, "securityTranslate");
  return (
    <div className={securityContainerStyle.securityContainer}>
      <GenericBreadcrumb dataList={pathList} />
      <h4 className={securityContainerStyle.subHeading}>{translate?.heading}</h4>
      <hr className={securityContainerStyle.divider} />
      <div className="container-fluid p-0 pt-3">
        <div className="row m-0">
          <SecurityComponent />
        </div>
      </div>
    </div>
  );
}

export default SecurityContainer;
