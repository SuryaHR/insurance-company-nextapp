"use client";
import React, { useState } from "react";
import OpenClaimsText from "./OpenClaimsText";
import NewClaimButton from "./NewClaimButton";
import OpenClaimsSearchBox from "./OpenClaimsSearchBox/OpenClaimsSearchBox";
import OpenClaimsComponentStyleTable from "./OpenClaimsTableComponent.module.scss";
import OpenClaimTable from "./OpenClaimTable/index";
import { connect } from "react-redux";
import { addClaimListData } from "@/reducers/ClaimData/ClaimSlice";

function OpenClaimsTableComponent(props: any): React.ReactNode {
  const [loading, setLoading] = useState(true);
  const [tableLoader, setTableLoader] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(false);
    const claimData = props.claimListRes.result;
    props.addClaimListData({ claimData });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return null;
  }
  return (
    <>
      <div className="mt-4">
        <OpenClaimsText />
      </div>
      <div className={OpenClaimsComponentStyleTable.claimContainer}>
        <div className={`row ${OpenClaimsComponentStyleTable.claimContentContainer}`}>
          <div className="col-lg-8 col-md-6 col-sm-12 col-12 d-flex mb-2">
            <NewClaimButton />
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 col-12">
            <OpenClaimsSearchBox setTableLoader={setTableLoader} />
          </div>
        </div>
      </div>

      <div className="row">
        <OpenClaimTable setTableLoader={setTableLoader} tableLoader={tableLoader} />
      </div>
    </>
  );
}
const mapDispatchToProps = {
  addClaimListData,
};
export default connect(null, mapDispatchToProps)(OpenClaimsTableComponent);
