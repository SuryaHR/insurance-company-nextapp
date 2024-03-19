"use client";
import React, { useState } from "react";
import GenericButton from "@/components/common/GenericButton";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import AssignItemsTableComponent from "./AssignItemsTableComponent/AssignItemsTableComponent";
import AssignItemsStyle from "./assignItemsComponent.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { submitVendorDetails } from "@/services/_adjuster_services/ClaimService";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import {
  setSelectedItems,
  setTotalValue,
  setCategoryRows,
} from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import Loading from "@/app/[lang]/loading";

interface AssignItemsComponentProps {
  onNewClaimsClick?: () => void;
  checkedItems?: any;
  selectedItems?: any;
  hidePrevAndHeaderProp?: any;
  handleSubmitClick?: () => void;
  handleAfterSubmit?: (res: any) => void;
}

const AssignItemsComponent: React.FC<AssignItemsComponentProps & connectorType> = ({
  onNewClaimsClick,
  hidePrevAndHeaderProp,
  handleAfterSubmit,
}) => {
  const [isSbmitItemsDisabled, setSubmitItemsDisabled] = useState(true);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const hidePrevAndHeader = hidePrevAndHeaderProp ? true : false;
  const dispatch = useAppDispatch();
  const { vendorAssignmentPayload } = useAppSelector((state: RootState) => ({
    selectedItems: state.addItemsTable.selectedItems,
    vendorAssignmentPayload: state.addItemsTable.vendorAssignmentPayload,
    selectedItemsUUIDs: state.addItemsTable.selectedItemsUUIDs,
  }));

  const router = useRouter();

  const handlePreviousClick = () => {
    if (onNewClaimsClick) {
      onNewClaimsClick();
    }
  };

  const handleSubmitClick = async () => {
    try {
      setTableLoader(true);
      const response = await submitVendorDetails(vendorAssignmentPayload);
      if (response?.status === 200) {
        dispatch(
          addNotification({
            message: response.message,
            id: "submit_vendor",
            status: "success",
          })
        );
        if (hidePrevAndHeader && handleAfterSubmit) {
          handleAfterSubmit("success");
        } else {
          router.push("/adjuster-dashboard");
        }
        setTableLoader(false);
      } else {
        dispatch(
          addNotification({
            message: response.message ?? "Something went wrong.",
            id: "submit_failure_vendor",
            status: "error",
          })
        );
        if (hidePrevAndHeader && handleAfterSubmit) {
          handleAfterSubmit("error");
        } else {
          router.push("/adjuster-dashboard");
        }
      }

      setSubmitItemsDisabled(true);
    } catch (error) {
      console.error("Error submitting vendor details", error);
    }
  };

  return (
    <div>
      <div>
        {tableLoader && <Loading />}
        {!hidePrevAndHeader && (
          <div className={`col-md-12 col-sm-12 col-12 ${AssignItemsStyle.addItemsTitle}`}>
            3) Assign Items
          </div>
        )}
        <div className="row justify-content-end mt-2">
          <div className="col-auto">
            <GenericButton
              label="Cancel"
              size="small"
              type="submit"
              btnClassname={AssignItemsStyle.newClaimBtn}
              onClick={() => router.push("/adjuster-dashboard")}
            />
          </div>
          {!hidePrevAndHeader && (
            <div className="col-auto">
              <GenericButton
                label="Previous"
                size="small"
                type="submit"
                onClick={handlePreviousClick}
                btnClassname={AssignItemsStyle.newClaimBtn}
              />
            </div>
          )}
          <div className="col-auto">
            <GenericButton
              label="Submit"
              size="small"
              type="submit"
              btnClassname={AssignItemsStyle.newClaimBtn}
              disabled={!isSbmitItemsDisabled}
              onClick={handleSubmitClick}
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
        <AssignItemsTableComponent onNewClaimsClick={handlePreviousClick} />
      </div>
      <div className="row mt-3 justify-content-end">
        <div className="col-auto">
          <GenericButton
            label="Cancel"
            size="small"
            type="submit"
            btnClassname={AssignItemsStyle.newClaimBtn}
            onClick={() => router.push("/adjuster-dashboard")}
          />
        </div>
        <div
          style={{ display: hidePrevAndHeader ? "none" : "block" }}
          className="col-auto"
        >
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
            disabled={!isSbmitItemsDisabled}
            onClick={handleSubmitClick}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  previousSelectedItems: state.addItemsTable.previousSelectedItems,
  selectedItems: state.addItemsTable.selectedItems,
  selectedCategory: state.addItemsTable.selectedCategory,
  vendorAssignmentPayload: state.addItemsTable.vendorAssignmentPayload,
  selectedItemsUUIDs: state.addItemsTable.selectedItemsUUIDs,
});

const mapDispatchToProps = { setCategoryRows, setSelectedItems, setTotalValue };

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AssignItemsComponent);
