"use client";
import React, { useState } from "react";
import GenericSelect from "@/components/common/GenericSelect";
import AssignItemsDropdownStyle from "./selectBoxAssignItems.module.scss";
import { setSelectedCategory } from "@/reducers/_adjuster_reducers/UploadCSV/AddItemsTableCSVSlice";
import { ConnectedProps, connect } from "react-redux";

const SelectBoxAssignItems: React.FC<connectorType> = (props) => {
  const { setSelectedCategory }: React.SetStateAction<any> = props;
  const options = [
    { value: 1, label: "All" },
    { value: 2, label: "Appliances" },
    { value: 3, label: "Art" },
    { value: 4, label: "Automative and Motorcycle Accessories" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const customStyles = {
    control: (defaultStyles: any) => ({
      ...defaultStyles,
      width: "252px",
      minHeight: "25px",
      maxHeight: "27px",
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      "@media only screen and (min-width: 2560px)": {
        width: "340px",
        height: "29px",
        marginBottom: "0px",
      },
    }),
    placeholder: (defaultStyles: any) => ({
      ...defaultStyles,
      fontSize: "12px",
      padding: "2px 0px 10px 2px",
    }),
    indicatorSeparator: (defaultStyles: any) => ({
      ...defaultStyles,
      display: "none",
    }),
    dropdownIndicator: (defaultStyles: any) => ({
      ...defaultStyles,
      padding: "2px 0px 10px 2px",
    }),
    option: (defaultStyles: any, state: any) => ({
      ...defaultStyles,
      backgroundColor: state.isSelected ? "#e1e5ec" : "white",
      color: "#262626",
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "#337ab7",
        color: "white",
      },
      "&:active": {
        backgroundColor: "#337ab7",
        color: "white",
      },
    }),
  };

  const handleChange = (selected: any) => {
    setSelectedOption(selected);
    setSelectedCategory(selected ? selected : "");
  };
  return (
    <>
      <div className={AssignItemsDropdownStyle.addStyleContainer}>
        <p className={AssignItemsDropdownStyle.textAddStyle}>View</p>
        <GenericSelect
          placeholder="Select"
          options={options}
          customStyles={customStyles}
          hideSelectedOptions={false}
          value={selectedOption}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ addItemsTable }: any) => ({
  searchKeyword: addItemsTable.selectedCategory,
});
const mapDispatchToProps = {
  setSelectedCategory,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(SelectBoxAssignItems);
