"use client";
import React from "react";
import GenericButton from "@/components/common/GenericButton";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import AddStyle from "./addItemsComponent.module.scss";
import AddItemsTableComponent from "./AddItemsTableComponent";
import { useRouter } from "next/navigation";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";

interface AddItemsComponentProps {
  onAssignItemsClick: () => void;
  onNewClaimsClick: () => void;
}

const AddItemsComponent: React.FC<AddItemsComponentProps & connectorType> = ({
  onAssignItemsClick,
  onNewClaimsClick,
}) => {
  const router = useRouter();

  const handlePreviousClick = () => {
    onNewClaimsClick();
  };
  return (
    <div>
      <div>
        <div className={`col-md-12 col-sm-12 col-12 ${AddStyle.addItemsTitle}`}>
          2) Add Items
        </div>
        <div className="row justify-content-end mt-2">
          <div className="col-auto">
            <GenericButton
              label="Cancel"
              size="small"
              type="submit"
              btnClassname={AddStyle.newClaimBtn}
              onClick={() => router.push("/adjuster-dashboard")}
            />
          </div>
          <div className="col-auto">
            <GenericButton
              label="Previous"
              size="small"
              type="submit"
              onClick={handlePreviousClick}
              btnClassname={AddStyle.newClaimBtn}
            />
          </div>
          <div className="col-auto">
            <GenericButton
              label="Assign Items"
              size="small"
              type="submit"
              btnClassname={AddStyle.newClaimBtn}
            />
          </div>
        </div>
      </div>
      <div>
        <GenericComponentHeading
          title={"Add Items"}
          customHeadingClassname={AddStyle.PolicyholderText}
          customTitleClassname={AddStyle.customTitleClassname}
        />
      </div>
      <div>
        <AddItemsTableComponent onAssignItemsClick={onAssignItemsClick} />
      </div>
      <div className="row justify-content-end">
        <div className="col-auto">
          <GenericButton
            label="Cancel"
            size="small"
            type="submit"
            btnClassname={AddStyle.newClaimBtn}
            onClick={() => router.push("/adjuster-dashboard")}
          />
        </div>
        <div className="col-auto">
          <GenericButton
            label="Previous"
            size="small"
            type="submit"
            btnClassname={AddStyle.newClaimBtn}
            onClick={handlePreviousClick}
          />
        </div>
        <div className="col-auto">
          <GenericButton
            label="Assign Items"
            size="small"
            type="submit"
            btnClassname={AddStyle.newClaimBtn}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  addItemsTableData: state.addItemsTable.addItemsTableData,
  selectedItems: state.addItemsTable.selectedItems,
  selectedCategory: state.addItemsTable.selectedCategory,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AddItemsComponent);
