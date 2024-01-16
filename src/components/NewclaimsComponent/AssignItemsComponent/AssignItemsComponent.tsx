"use client";
import React, { useState } from "react";
import GenericButton from "@/components/common/GenericButton";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import AssignItemsTableComponent from "./AssignItemsTableComponent/AssignItemsTableComponent";
import AssignItemsStyle from "./assignItemsComponent.module.scss";

interface AssignItemsComponentProps {
  onNewClaimsClick: () => void;
}

const AssignItemsComponent: React.FC<AssignItemsComponentProps> = ({
  onNewClaimsClick,
}) => {
  const [isSbmitItemsDisabled, setSubmitItemsDisabled] = useState(true);

  const handlePreviousClick = () => {
    onNewClaimsClick();
  };
  return (
    <div>
      <div>
        <div className={`col-md-12 col-sm-12 col-12 ${AssignItemsStyle.addItemsTitle}`}>
          3) Assign Items
        </div>
        <div className="row justify-content-end mt-2">
          <div className="col-auto">
            <GenericButton
              label="Cancel"
              size="small"
              type="submit"
              btnClassname={AssignItemsStyle.newClaimBtn}
            />
          </div>
          <div className="col-auto">
            <GenericButton
              label="Previous"
              size="small"
              type="submit"
              onClick={handlePreviousClick}
              btnClassname={AssignItemsStyle.newClaimBtn}
            />
          </div>
          <div className="col-auto">
            <GenericButton
              label="Submit"
              size="small"
              type="submit"
              btnClassname={AssignItemsStyle.newClaimBtn}
              disabled={isSbmitItemsDisabled}
              onClick={() => {
                setSubmitItemsDisabled(true);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <GenericComponentHeading
          title={"New Vendor Assignment"}
          customHeadingClassname={AssignItemsStyle.PolicyholderText}
          customTitleClassname={AssignItemsStyle.customTitleClassname}
        />
      </div>
      <div>
        <AssignItemsTableComponent
          // selectedRowsData={selectedRowsData}
          onNewClaimsClick={handlePreviousClick}
        />
      </div>
      <div className="row mt-3 justify-content-end">
        <div className="col-auto">
          <GenericButton
            label="Cancel"
            size="small"
            type="submit"
            btnClassname={AssignItemsStyle.newClaimBtn}
          />
        </div>
        <div className="col-auto">
          <GenericButton
            label="Previous"
            size="small"
            type="submit"
            onClick={handlePreviousClick}
            btnClassname={AssignItemsStyle.newClaimBtn}
          />
        </div>
        <div className="col-auto">
          <GenericButton
            label="Submit"
            size="small"
            type="submit"
            btnClassname={AssignItemsStyle.newClaimBtn}
            disabled={isSbmitItemsDisabled}
            onClick={() => {
              setSubmitItemsDisabled(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default AssignItemsComponent;
