"use client";
import React, { useEffect } from "react";
import GenericSelect from "@/components/common/GenericSelect";
import AddItemsDropdownStyle from "./selectBoxAddItems.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import {
  setCategories,
  setSelectedCategory,
} from "@/reducers/UploadCSV/AddItemsTableCSVSlice";
import { RootState } from "@/store/store";
import { getCategories } from "@/services/ClaimService";

const SelectBoxAddItems: React.FC<connectorType> = ({
  categories,
  setSelectedCategory,
  selectedCategory,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        console.log("Categories from API:", data);
        dispatch(setCategories(data));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const customStyles = {
    control: (defaultStyles: any) => ({
      ...defaultStyles,
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
      zIndex: 999,
    }),
  };

  const formattedCategories = [
    { value: 0, label: "All" },
    ...categories.map((category) => ({
      value: category.categoryId,
      label: category.categoryName,
    })),
  ];

  console.log("Formatteddddddddddd", formattedCategories);

  const defaultSelectedValue = formattedCategories.find(
    (category) => category.label === "All"
  );

  const handleCategoryChange = (selectedCategory: string) => {
    dispatch(setSelectedCategory(selectedCategory));
  };
  return (
    <>
      <div className={AddItemsDropdownStyle.addStyleContainer}>
        <p className={AddItemsDropdownStyle.textAddStyle}>View</p>
        <GenericSelect
          placeholder="Select"
          options={formattedCategories}
          customStyles={customStyles}
          onChange={handleCategoryChange}
          isSearchable={true}
          value={
            selectedCategory && selectedCategory !== "All"
              ? selectedCategory
              : defaultSelectedValue
          }
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  categories: state.addItemsTable.categories,
  selectedCategory: state.addItemsTable.selectedCategory,
});

const mapDispatchToProps = {
  setCategories,
  setSelectedCategory,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(SelectBoxAddItems);
