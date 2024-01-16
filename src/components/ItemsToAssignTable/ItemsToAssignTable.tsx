import React from "react";
import ItemsToAssignTableStyle from "./ItemsToAssignTable.module.scss";
import SearchBox from "./SearchBox";
import AssignTable from "./AssignTable";
import GenericButton from "../common/GenericButton";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import {
  setCategoryRows,
  setSelectedCategory,
} from "@/reducers/UploadCSV/AddItemsTableCSVSlice";

interface ItemsToAssignTableProps {
  closeModal: () => void;
}

const ItemsToAssignTable: React.FC<ItemsToAssignTableProps & connectorType> = ({
  closeModal,
}) => {
  return (
    <>
      <div className={ItemsToAssignTableStyle.addItemsContainer}>
        <div className={`row gx-2 ${ItemsToAssignTableStyle.addItemsContentContainer}`}>
          <div className={`col-8 mt-2 mb-2 ${ItemsToAssignTableStyle.selectItemsStyle}`}>
            <SearchBox />
          </div>
        </div>
      </div>
      <div className={ItemsToAssignTableStyle.styleTable}>
        <AssignTable />
      </div>
      <div className={ItemsToAssignTableStyle.buttonContainer}>
        <div className="mx-2">
          <GenericButton label={"Cancel"} size="medium" onClick={closeModal} />
        </div>
        <div className="mx-2">
          <GenericButton label={"Save"} size="medium" />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedCategory: state.addItemsTable.selectedCategory,
});
const mapDispatchToProps = { setCategoryRows, setSelectedCategory };

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;

export default connector(ItemsToAssignTable);
