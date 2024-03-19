"use client";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import userStyle from "./userProfileBreadCrumpsComponent.module.scss";
import UserProfileComponent from "./UserProfileComponent/UserProfileComponent";

const UserProfileBreadCrumpsComponent: React.FC<connectorType> = () => {
  const pathList = [
    {
      name: "Home",
      path: "/adjuster-dashboard",
    },
    {
      name: "My profile",
      path: "",
      active: true,
    },
  ];

  const imgType = "";
  const fileUrl = "";

  return (
    <>
      <div className={userStyle.stickyContainer}>
        <GenericBreadcrumb dataList={pathList} />
        <GenericComponentHeading
          customHeadingClassname={userStyle.headingContainer}
          customTitleClassname={userStyle.headingTxt}
          title={"Profile"}
        />
      </div>
      <div>
        <UserProfileComponent imgType={imgType} fileUrl={fileUrl} />
      </div>
    </>
  );
};

const mapStateToProps = () => ({});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(UserProfileBreadCrumpsComponent);
