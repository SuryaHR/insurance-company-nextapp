"use client";
import React, { useEffect } from "react";
import GenericButton from "@/components/common/GenericButton";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import AddStyle from "./addItemsComponent.module.scss";
import AddItemsTableComponent from "./AddItemsTableComponent";
import { useRouter } from "next/navigation";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/hooks/reduxCustomHook";

import { addRoomType } from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";
import {
  addCategories,
  addCondition,
  addRetailer,
  addRoom,
  addSubcategories,
} from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import {
  getCategories,
  getClaimItemCondition,
  getClaimItemRetailers,
  getClaimItemRoom,
  getSubCategories,
} from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import { getClaimRoomTypeData } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { resetAddItemsTableData } from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
interface AddItemsComponentProps {
  onAssignItemsClick: () => void;
  onNewClaimsClick: () => void;
  isAnyItemSelected: boolean;
}

const AddItemsComponent: React.FC<AddItemsComponentProps & connectorType> = ({
  onAssignItemsClick,
  onNewClaimsClick,
  addCategories,
  addSubcategories,
  addCondition,
  addRetailer,
  addRoom,
  addRoomType,
  isAnyItemSelected,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handlePreviousClick = () => {
    onNewClaimsClick();
    dispatch(resetAddItemsTableData());
  };

  useEffect(() => {
    const claimId = sessionStorage.getItem("claimId") ?? "";

    const fetchDetails = async () => {
      const categoryListRes: any = await getCategories(true);
      const subcategoryListRes: any = await getSubCategories({ categoryId: null }, true);

      const claimContitionRes: any = await getClaimItemCondition(true);

      const claimRetailerRes: any = await getClaimItemRetailers(true);

      const claimRoomRes: any = await getClaimItemRoom(claimId, true);
      const claimRoomTypeRes: any = await getClaimRoomTypeData(true);

      if (Array.isArray(categoryListRes?.data)) {
        addCategories(categoryListRes?.data);
      }
      if (Array.isArray(subcategoryListRes?.data)) {
        addSubcategories(subcategoryListRes?.data);
      }
      addCondition(claimContitionRes?.data);
      addRetailer(claimRetailerRes?.data?.retailers);
      addRoom(claimRoomRes?.data);
      addRoomType(claimRoomTypeRes);
    };
    fetchDetails();
  }, [addCategories, addCondition, addRetailer, addRoom, addRoomType, addSubcategories]);
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
              isAnyItemSelected={isAnyItemSelected}
              onClick={onAssignItemsClick}
              disabled={isAnyItemSelected === undefined || !isAnyItemSelected}
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
      <div className="row justify-content-end mt-4">
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
            isAnyItemSelected={isAnyItemSelected}
            onClick={onAssignItemsClick}
            disabled={isAnyItemSelected === undefined || !isAnyItemSelected}
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
  isAnyItemSelected: state.addItemsTable.isAnyItemSelected,
});

const mapDispatchToProps = {
  addCategories,
  addSubcategories,
  addCondition,
  addRetailer,
  addRoom,
  addRoomType,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AddItemsComponent);
