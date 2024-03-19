import React from "react";
import styles from "./profileDetailWrapper.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { unknownObjectType } from "@/constants/customTypes";
import Image from "next/image";
import { NO_IMAGE } from "@/constants/constants";
import clsx from "clsx";
import ClaimList from "./ClaimList";

interface propType<T> {
  data: T;
}
function ProfileDetailWrapper<T extends unknownObjectType>(props: propType<T>) {
  const { data } = props;
  const imgUrl = data?.displayPicture ?? NO_IMAGE;

  const RowData = ({ label, text }: { label: string; text: string }) => (
    <div className="col-md-12 col-sm-12 col-xs-12 row mb-2">
      <label className={clsx("col-md-3 col-sm-4 col-xs-12", styles.label)}>{label}</label>
      <span className="col-md-9 col-sm-8 col-xs-12">{text}</span>
    </div>
  );
  return (
    <div className={styles.wrapperContainer}>
      <GenericComponentHeading
        title={`${data?.firstName} ${data?.lastName}`}
        customTitleClassname={styles.heading}
      />
      <div className={clsx("row", styles.detailMainDiv)}>
        <div className="col-md-2 col-xs-12 col-sm-4">
          <div className={styles.imageWrapper}>
            <div className={styles.imageDiv}>
              <Image
                unoptimized={true}
                src={imgUrl}
                alt="profile"
                fill={true}
                sizes="100%"
                style={{ objectFit: "contain" }}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = NO_IMAGE;
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-9 col-sm-8 col-xs-12">
          <RowData label="First Name" text={data?.firstName ?? "-"} />
          <RowData label="Last Name" text={data?.lastName ?? "-"} />
          <RowData label="Role / Designation" text={data?.roleText ?? "-"} />
          <RowData label="Organization" text={data?.company?.name ?? "-"} />
          <RowData label="EmaiId" text={data?.email ?? "-"} />
          <div className="row">
            <div className="col-md-6 col-sm-12 col-xs-12 p-0">
              <div className="col-md-12 col-sm-12 col-xs-12 row mb-2">
                <label className={clsx("col-md-6 col-sm-6 col-xs-12", styles.label)}>
                  Primary Phone
                </label>
                <span className="col-md-6 col-sm-6 col-xs-12">
                  {data?.primaryPhone ?? "-"}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-sm-12 col-xs-12 p-0">
              <div className="col-md-12 col-sm-12 col-xs-12 row mb-2">
                <label className={clsx("col-md-6 col-sm-6 col-xs-12", styles.label)}>
                  Mobile Phone
                </label>
                <span className="col-md-6 col-sm-6 col-xs-12">
                  {data?.mobilePhone ?? "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GenericComponentHeading title="Claims" customTitleClassname={styles.subHeading} />
      <ClaimList />
    </div>
  );
}

export default ProfileDetailWrapper;
