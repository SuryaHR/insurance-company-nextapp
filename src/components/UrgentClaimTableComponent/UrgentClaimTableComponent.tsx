"use client";
import React, { useEffect, useState } from "react";
import UrgentClaimTable from "./UrgentClaimTable/index";
import { ConnectedProps, connect } from "react-redux";
import { addUrgentClaimListData } from "@/reducers/UrgentClaimData/UrgentClaimSlice";
import { unknownObjectType } from "@/constants/customTypes";
import Loading from "@/app/[lang]/loading";

interface typedProp {
  initData: unknownObjectType | null;
}

const UrgentClaimTableComponent: React.FC<typedProp & connectorType> = (props) => {
  const { initData, addUrgentClaimListData } = props;
  console.log("checking props", initData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    addUrgentClaimListData(initData);
    setLoaded(true);
    // eslint-disable-next-line
  }, []);

  if (!loaded) return <Loading />;
  return (
    <div className="row">
      <UrgentClaimTable />
    </div>
  );
};

const mapDispatchToProps = {
  addUrgentClaimListData,
};

const connector = connect(null, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(UrgentClaimTableComponent);
