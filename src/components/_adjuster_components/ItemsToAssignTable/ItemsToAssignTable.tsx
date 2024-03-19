import React from "react";
import ItemsToAssignTableStyle from "./ItemsToAssignTable.module.scss";
import SearchBox from "./SearchBox";
import AssignTable from "./AssignTable";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import {
  setCategoryRows,
  setSelectedCategory,
  setSelectedItems,
} from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";

interface ItemsToAssignTableProps {
  closeModal: () => void;
  selectedItems: any;
  handleRowSelect: (itemId: number) => void;
}

const ItemsToAssignTable: React.FC<ItemsToAssignTableProps & connectorType> = ({
  closeModal,
  handleRowSelect,
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
        <AssignTable
          // selectedItems={selectedItems}
          handleRowSelect={handleRowSelect}
          closeModal={closeModal}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedCategory: state.addItemsTable.selectedCategory,
  selectedItems: state.addItemsTable.selectedItems,
});
const mapDispatchToProps = { setCategoryRows, setSelectedCategory, setSelectedItems };

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;

export default connector(ItemsToAssignTable);
