"use client";
import React from "react";
import UserProfileBreadCrumpsComponent from "@/components/_adjuster_components/UserProfileBreadCrumpsComponent/UserProfileBreadCrumpsComponent";
import { ConnectedProps, connect } from "react-redux";

const UserProfileContainer: React.FC<connectorType> = () => {
  return (
    <div className="row">
      <div className="container-fluid p-0 pt-2">
        <div className="row m-0">
          <UserProfileBreadCrumpsComponent />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(UserProfileContainer);
