"use client";
import React from "react";
import OpenClaimsText from "./OpenClaimsText";
import NewClaimButton from "./NewClaimButton";
import OpenClaimsSearchBox from "./OpenClaimsSearchBox/OpenClaimsSearchBox";
import OpenClaimsComponentStyleTable from "./OpenClaimsTableComponent.module.scss";
import OpenClaimTable from "./OpenClaimTable/index";
import { connect } from "react-redux";
import { addSearchKeyWord } from "@/reducers/_adjuster_reducers/ClaimData/ClaimSlice";
import { fetchClaimList } from "@/services/_adjuster_services/ClaimService";

function OpenClaimsTableComponent(props: {
  translate: any;
  addSearchKeyWord: any;
}): React.ReactNode {
  const { translate, addSearchKeyWord } = props;
  const [tableLoader, setTableLoader] = React.useState<boolean>(false);
  const [resetPagination, setResetPagination] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTableLoader(true);
    addSearchKeyWord({ searchKeyword: "" });
    fetchClaimList().then((resp) => {
      if (resp) {
        setTableLoader(false);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="mt-4">
        <OpenClaimsText translate={translate} />
      </div>
      <div className={OpenClaimsComponentStyleTable.claimContainer}>
        <div className={`row ${OpenClaimsComponentStyleTable.claimContentContainer}`}>
          <div className="col-lg-8 col-md-6 col-sm-12 col-12 d-flex ps-0">
            <NewClaimButton translate={translate} />
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 col-12 ps-0 pe-0">
            <OpenClaimsSearchBox
              setTableLoader={setTableLoader}
              setResetPagination={setResetPagination}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <OpenClaimTable
          setTableLoader={setTableLoader}
          tableLoader={tableLoader}
          resetPagination={resetPagination}
          setResetPagination={setResetPagination}
        />
      </div>
    </>
  );
}
const mapDispatchToProps = {
  addSearchKeyWord,
};
export default connect(null, mapDispatchToProps)(OpenClaimsTableComponent);
