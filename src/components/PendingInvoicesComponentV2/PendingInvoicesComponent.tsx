"use client";
import { unknownObjectType } from "@/constants/customTypes";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { addPendingInvoice } from "@/reducers/PendingInvoice/PendingInvoiceSlice";
import PendingInvoiceTable from "./PendingInvoiceTable";
import Loading from "@/app/[lang]/loading";

interface typedProp {
  initData: unknownObjectType | null;
}

const PendingInvoicesComponent: React.FC<connectorType & typedProp> = (props) => {
  const { initData, addPendingInvoice } = props;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    addPendingInvoice(initData);
    setLoaded(true);
    // eslint-disable-next-line
  }, []);

  if (!loaded) return <Loading />;

  return (
    <>
      <div className="row">
        <PendingInvoiceTable />
      </div>
    </>
  );
};

const mapDispatchToProps = {
  addPendingInvoice,
};
const connector = connect(null, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(PendingInvoicesComponent);
