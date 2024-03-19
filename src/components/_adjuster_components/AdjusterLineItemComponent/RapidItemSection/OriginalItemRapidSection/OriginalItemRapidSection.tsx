import React, { useContext } from "react";
import GenericSelect from "@/components/common/GenericSelect";
import originalItemRapidSectionStyle from "./originalItemRapidSection.module.scss";
import clsx from "clsx";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import selectRapidOriginalData from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectRapidOriginalData";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import {
  updateLineItem,
  updateOnCategoryChange,
} from "@/reducers/_adjuster_reducers/LineItemDetail/LineItemDetailSlice";
import {
  fetchSubCategory,
  saveSubCategoryChange,
} from "@/reducers/_adjuster_reducers/LineItemDetail/LineItemThunkService";
import Tooltip from "@/components/common/ToolTip";
import { LineItemContext } from "../../LineItemContext";
import { getUSDCurrency } from "@/utils/utitlity";

interface CategoryType {
  categoryId: number;
  categoryName: string;
}

interface subCategoryType {
  id: number;
  name: string;
}

interface conditionType {
  conditionId: number;
  conditionName: string;
}

const OriginalItemRapidSection: React.FC<connectorType> = (props) => {
  const {
    rapidData,
    category,
    subCategory,
    updateOnCategoryChange,
    fetchSubCategory,
    saveSubCategoryChange,
    condition,
    updateLineItem,
  } = props;

  const { rapidSubCategoryRef, rapidcategoryRef, setShowLoader } =
    useContext(LineItemContext);
  const handleCategorySelect = (e: CategoryType | null) => {
    if (e !== null) {
      fetchSubCategory(e.categoryId); //fetch new sub-category
    }
    updateOnCategoryChange(e);
  };

  const handleSubCategorySelect = (e: subCategoryType) => {
    setShowLoader(true);
    saveSubCategoryChange({
      subCategory: e,
      clbk: () => {
        setShowLoader(false);
      },
    });
  };

  const handleConditionSelect = (e: conditionType) => {
    updateLineItem({ condition: e });
  };
  return (
    <div className={originalItemRapidSectionStyle.root}>
      <h5 className={originalItemRapidSectionStyle.heading}>Original Item</h5>
      <div>{rapidData?.description}</div>
      <div className={originalItemRapidSectionStyle.content}>
        <div className={clsx(originalItemRapidSectionStyle.leftSideDiv)}>
          <label>Age</label>
          <div>{`${rapidData?.ageYears} Yrs ${rapidData?.ageMonths} Months`}</div>
          <label>Cost Per Unit</label>
          <div>{getUSDCurrency(rapidData?.insuredPrice)}</div>
        </div>
        <div className={originalItemRapidSectionStyle.rightSideDiv}>
          <div className={originalItemRapidSectionStyle.selectBox}>
            <label htmlFor="category">Category</label>
            <GenericSelect
              id="category"
              value={
                rapidData?.selectedCategory
                  ? {
                      categoryId: rapidData?.selectedCategory?.id,
                      categoryName: rapidData?.selectedCategory?.name,
                    }
                  : null
              }
              options={category}
              getOptionLabel={(option: { categoryName: any }) => option.categoryName}
              getOptionValue={(option: { categoryId: any }) => option.categoryId}
              onChange={handleCategorySelect}
              isModalPopUp={true}
              selectRef={rapidcategoryRef}
            />
            <Tooltip
              // className={orginalItemFormStyle.infoIconContainer}
              text={
                rapidData?.selectedCategory?.name
                  ? rapidData?.selectedCategory?.name
                  : "Select Category"
              }
            />
          </div>
          <div className={originalItemRapidSectionStyle.selectBox}>
            <label htmlFor="subCategory">Sub-Category</label>
            <GenericSelect
              id="subCategory"
              value={rapidData.selectedSubCategory}
              options={subCategory}
              getOptionLabel={(option: { name: string }) => option.name}
              getOptionValue={(option: { id: number }) => option.id}
              onChange={handleSubCategorySelect}
              isModalPopUp={true}
              selectRef={rapidSubCategoryRef}
            />
            <Tooltip
              // className={orginalItemFormStyle.infoIconContainer}
              text={
                rapidData?.selectedSubCategory?.name
                  ? rapidData?.selectedSubCategory?.name
                  : "Select SubCategory"
              }
            />
          </div>
          <div className={originalItemRapidSectionStyle.selectBox}>
            <label htmlFor="condition">Condition</label>
            <GenericSelect
              id="condition"
              value={rapidData.selectedCondition}
              options={condition}
              getOptionLabel={(option: { conditionName: any }) => option.conditionName}
              getOptionValue={(option: { conditionId: any }) => option.conditionId}
              onChange={handleConditionSelect}
              isModalPopUp={true}
            />
            <Tooltip
              // className={orginalItemFormStyle.infoIconContainer}
              text={
                rapidData?.selectedCondition?.conditionName
                  ? rapidData?.selectedCondition?.conditionName
                  : "Select Condition"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  rapidData: selectRapidOriginalData(state),
  category: state[EnumStoreSlice.LINE_ITEM_DETAIL].category,
  subCategory: state[EnumStoreSlice.LINE_ITEM_DETAIL].subCategory,
  condition: state[EnumStoreSlice.LINE_ITEM_DETAIL].condition,
});

const mapDispatchToProps = {
  updateOnCategoryChange,
  fetchSubCategory,
  saveSubCategoryChange,
  updateLineItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;

export default connector(OriginalItemRapidSection);
