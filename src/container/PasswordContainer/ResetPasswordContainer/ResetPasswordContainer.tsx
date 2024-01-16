import React from "react";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import ResetPasswordStyle from "./ResetPasswordContainer.module.scss";
import ResetPasswordComponent from "@/components/ResetPasswordComponent";
import { Locale } from "@/i18n.config";
import { getTranslate } from "@/translations";
import { resetPasswordTranslateType } from "@/translations/resetPasswordTranslate/en";

const pathList = [
  {
    name: "Home",
    path: "/login",
  },
  {
    name: "Security",
    active: true,
    path: "",
  },
];

async function ResetPasswordContainer({ lang }: { lang: Locale }) {
  const translate: resetPasswordTranslateType = await getTranslate(
    lang,
    "resetPasswordTranslate"
  );
  return (
    <div className={ResetPasswordStyle.resetPasswordContainer}>
      <GenericBreadcrumb dataList={pathList} />
      <h4 className={ResetPasswordStyle.subHeading}>{translate?.heading}</h4>
      <hr className={ResetPasswordStyle.divider} />
      <div className="container-fluid p-0 pt-3">
        <div className="row m-0">
          <ResetPasswordComponent translate={translate} />
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordContainer;
