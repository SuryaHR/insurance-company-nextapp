"use client";
import React, { useState } from "react";
import AddItemsButton from "./AddItemsButton";
import AddTableSTyle from "./addItemsTableComponent.module.scss";
import AssignAddItemButton from "./AssignAddItemButton";
import SelectBoxAddItems from "./SelectBoxAddItems";
import LoadFileAddItemButton from "./LoadFileAddItemButton";
import SearchBoxAddItems from "./SearchBoxAddItems";
import ListAddItemsTable from "./ListAddItemsTable";
import AddItemModal from "@/components/_adjuster_components/AddItemModal/AddItemModal";
import { ConnectedProps, connect } from "react-redux";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setSelectedRows,
  setCategoryRows,
} from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import { RootState } from "@/store/store";
import { fetchAddItemsTableCSVData } from "@/services/_adjuster_services/ClaimService";
import Loading from "@/app/[lang]/loading";

interface AddItemsTableComponentProps {
  onAssignItemsClick: () => void;
  isAnyItemSelected: boolean;
  selectedItems: any;
}

const AddItemsTableComponent: React.FC<AddItemsTableComponentProps & connectorType> = ({
  onAssignItemsClick,
  isAnyItemSelected,
  selectedItems,
  editItemDetail,
  addItemsTableData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = React.useState<React.SetStateAction<any>>(null);
  const [tableLoader, setTableLoader] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const itemListApi = async () => {
    const claimId = sessionStorage.getItem("claimId") || "";
    const claimNumber = sessionStorage.getItem("claimNumber") || "";
    const addItemsPayload = { claimId, claimNumber };

    const addItemsTableResponse = await fetchAddItemsTableCSVData(addItemsPayload);

    if (addItemsTableResponse.status === 200) {
      dispatch(setAddItemsTableData(addItemsTableResponse.data));
    }
  };
  const closeModal = async () => {
    await itemListApi();
    setEditItem(null);
    setIsModalOpen(false);
  };

  const handleCheckboxChange = async (item: any) => {
    const updatedSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter((selectedItem: any) => selectedItem !== item)
      : [...selectedItems, item];

    await dispatch(setSelectedItems(updatedSelectedItems));
    dispatch(setSelectedRows(updatedSelectedItems));
  };

  return (
    <>
      {tableLoader && <Loading />}
      <div className={AddTableSTyle.addItemsContainer}>
        <div className="col-12">
          {isModalOpen && (
            <AddItemModal
              closeModal={closeModal}
              isModalOpen={isModalOpen}
              editItem={editItem}
              editItemDetail={editItemDetail}
              contentData={addItemsTableData}
            />
          )}
        </div>

        <div className={`row gx-2 ${AddTableSTyle.addItemsContentContainer}`}>
          <div
            className={`col-lg-2 col-md-2 col-sm-12 col-12 mt-2 mb-2 ${AddTableSTyle.addButtonStyle}`}
            onClick={openModal}
          >
            <AddItemsButton />
          </div>
          <div
            className={`col-lg-2 col-md-2 col-sm-12 col-12 mt-2 mb-2 ${AddTableSTyle.loadButtonStyle}`}
          >
            <LoadFileAddItemButton />
          </div>
          <div
            className={`col-lg-2 col-md-2 col-sm-12 col-12 mt-2 mb-2 ${AddTableSTyle.assignButtonStyle}`}
          >
            <AssignAddItemButton
              isAnyItemSelected={isAnyItemSelected}
              onClick={onAssignItemsClick}
            />
          </div>
          <div
            className={`col-lg-3 col-md-3 col-sm-12 col-12 mt-2 mb-2 ${AddTableSTyle.selectItemsStyle}`}
          >
            <SelectBoxAddItems />
          </div>
          <div
            className={`col-lg-3 col-md-3 col-sm-12 col-12 mt-2 mb-2 ${AddTableSTyle.searchItemsStyle}`}
          >
            <SearchBoxAddItems />
          </div>
        </div>
      </div>
      <div className="row">
        <ListAddItemsTable
          onCheckboxChange={handleCheckboxChange}
          setIsModalOpen={setIsModalOpen}
          setEditItem={setEditItem}
          setTableLoader={setTableLoader}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  addItemsTableData: state.addItemsTable.addItemsTableData,
  selectedItems: state.addItemsTable.selectedItems,
  isAnyItemSelected: state.addItemsTable.isAnyItemSelected,
  selectedCategory: state.addItemsTable.selectedCategory,
  editItemDetail: state.claimContentdata.editItemDetail,
});

const mapDispatchToProps = {
  setAddItemsTableData,
  setSelectedItems,
  setSelectedCategory,
  setSelectedRows,
  setCategoryRows,
  addClaimContentListData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AddItemsTableComponent);
