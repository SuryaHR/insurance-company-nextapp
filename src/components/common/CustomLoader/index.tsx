import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import loadingStyle from "./customLoader.module.scss";

export enum loaderTheme {
  spinner1 = "spinner1",
  spinner2 = "spinner2",
}

function CustomLoader({
  loaderType = loaderTheme.spinner1,
}: {
  loaderType?: keyof typeof loaderTheme;
}) {
  if (loaderType === loaderTheme.spinner2) {
    return (
      <div className={loadingStyle.root}>
        <AiOutlineLoading3Quarters size={24} className={loadingStyle.loader} />
      </div>
    );
  }
  return (
    <div className={loadingStyle["page-spinner-bar"]}>
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
}

export default CustomLoader;
