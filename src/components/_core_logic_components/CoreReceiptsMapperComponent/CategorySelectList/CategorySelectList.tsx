"use client";
import React from "react";
import GenericSelect from "@/components/common/GenericSelect";
import CategorySelectListStyle from "./CategorySelectList.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import {
  setSelectedCategory,
  updateClaimedItemsListData,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";

const CategorySelectList: React.FC<connectorType> = ({
  categories,
  setSelectedCategory,
  selectedCategory,
  updateClaimedItemsListData,
  allClaimedItemsList,
}) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);
  const dispatch = useAppDispatch();

  const customStyles = {
    control: {
      // ...defaultStyles,
      background: "#00aeef",
      textTransform: "uppercase",
      fontSize: "12px",
      color: "#fff",
      border: "none",
    },
    singleValue: {
      color: "#fff",
    },
    input: { color: "#fff" },

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
    ...categories.map((category: any) => ({
      value: category.categoryId,
      label: category.categoryName,
    })),
  ];

  const defaultSelectedValue = formattedCategories.find(
    (category) => category.label === "All"
  );

  const handleCategoryChange = async (selectedCategory: any) => {
    if (selectedCategory === null) {
      selectedCategory = { value: 0, label: "All" };
    }

    dispatch(setSelectedCategory(selectedCategory));
    if (selectedCategory !== null && selectedCategory !== "") {
      const updatedData = allClaimedItemsList.filter((item: any) => {
        if (selectedCategory?.label === "All") {
          return true;
        } else {
          return item?.category?.name === selectedCategory?.label;
        }
      });
      await updateClaimedItemsListData({ claimedData: updatedData });
    }
  };
  return (
    <>
      <div className={CategorySelectListStyle.addStyleContainer}>
        <p className={CategorySelectListStyle.textAddStyle}>
          {translate?.receiptMapperTranslate?.claimedItems?.view}
        </p>
        <GenericSelect
          placeholder={translate?.receiptMapperTranslate?.claimedItems?.categoryList}
          options={formattedCategories}
          customStyles={customStyles}
          onChange={handleCategoryChange}
          isSearchable={true}
          value={
            selectedCategory &&
            selectedCategory !== translate?.receiptMapperTranslate?.claimedItems?.all
              ? selectedCategory
              : defaultSelectedValue
          }
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ claimedItems, commonData }: any) => ({
  categories: commonData.category,
  selectedCategory: claimedItems.selectedCategory,
  allClaimedItemsList: claimedItems.allClaimedItemsList,
});

const mapDispatchToProps = {
  setSelectedCategory,
  updateClaimedItemsListData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(CategorySelectList);
