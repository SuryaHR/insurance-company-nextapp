import React from "react";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import ResetPasswordStyle from "./ResetPasswordContainer.module.scss";
import ResetPasswordComponent from "@/components/_adjuster_components/ResetPasswordComponent";
import { resetPasswordTranslatePropType } from "@/app/[lang]/(adjuster)/(password)/reset-password/page";

const pathList = [
  {
    name: "Home",
    path: "/adjuster-dashboard",
  },
  {
    name: "Security",
    active: true,
    path: "",
  },
];

async function ResetPasswordContainer({
  translate,
}: {
  translate: resetPasswordTranslatePropType;
}) {
  return (
    <div className={ResetPasswordStyle.resetPasswordContainer}>
      <GenericBreadcrumb dataList={pathList} />
      <h4 className={ResetPasswordStyle.subHeading}>
        {translate?.resetPasswordTranslate?.heading}
      </h4>
      <hr className={ResetPasswordStyle.divider} />
      <div className="container-fluid p-0 pt-3">
        <div className="row m-0">
          <ResetPasswordComponent />
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordContainer;
