import React from "react";
import loadingSkeltonStyle from "./loadingSkelton.module.scss";
import clsx from "clsx";
import Image from "next/image";
import loadingImg from "@/assets/images/dummyimage.png";

function LoadingSkelton() {
  const CardLoading = (
    <div className={loadingSkeltonStyle.row}>
      <div className={loadingSkeltonStyle.loading} />
      <div
        className={clsx(loadingSkeltonStyle.loading, loadingSkeltonStyle.middleLine)}
      />
      <div
        className={loadingSkeltonStyle.loading}
        style={{ backgroundColor: "#d7e5f1" }}
      />
    </div>
  );

  return (
    <div className={clsx(loadingSkeltonStyle.root)}>
      <div className={clsx(loadingSkeltonStyle.card__image, loadingSkeltonStyle.loading)}>
        <Image src={loadingImg} alt="image" fill={true} />
      </div>
      <div className={loadingSkeltonStyle.container}>
        {CardLoading}
        {CardLoading}
        {CardLoading}
      </div>
    </div>
  );
}

export default LoadingSkelton;
