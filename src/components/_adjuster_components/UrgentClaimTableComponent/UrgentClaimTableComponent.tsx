"use client";
import React, { useEffect, useState } from "react";
import UrgentClaimTable from "./UrgentClaimTable/index";
import { ConnectedProps, connect } from "react-redux";
import { addUrgentClaimListData } from "@/reducers/_adjuster_reducers/UrgentClaimData/UrgentClaimSlice";
import { unknownObjectType } from "@/constants/customTypes";
import Loading from "@/app/[lang]/loading";

interface typedProp {
  initData: unknownObjectType | null;
  translate?: any;
}

const UrgentClaimTableComponent: React.FC<typedProp & connectorType> = (props) => {
  const { initData, addUrgentClaimListData, translate } = props;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    addUrgentClaimListData(initData);
    setLoaded(true);
    // eslint-disable-next-line
  }, []);

  if (!loaded) return <Loading />;
  return (
    <div className="row">
      <UrgentClaimTable translate={translate} />
    </div>
  );
};

const mapDispatchToProps = {
  addUrgentClaimListData,
};

const connector = connect(null, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(UrgentClaimTableComponent);
