"use client";
import React from "react";
import { useEffect } from "react";
import GenericSelect from "@/components/common/GenericSelect";
import SearchBoxStyle from "./SearchBox.module.scss";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import {
  setCategories,
  setSelectedCategory,
} from "@/reducers/UploadCSV/AddItemsTableCSVSlice";
import { getCategories } from "@/services/ClaimService";

interface typeProps {
  [key: string | number]: any;
}
const SearchBox: React.FC<typeProps & connectorType> = ({
  categories,
  setSelectedCategory,
  selectedCategory,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        dispatch(setCategories(data));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const formattedCategories = [
    { value: 0, label: "All" },
    ...(categories || []).map((category: any) => ({
      value: category.categoryId,
      label: category.categoryName,
    })),
  ];

  const handleCategoryChange = (selectedCategory: string) => {
    dispatch(setSelectedCategory(selectedCategory));
  };

  return (
    <>
      <div className={SearchBoxStyle.addStyleContainer}>
        <p className={SearchBoxStyle.textAddStyle}>Category</p>
        <div className={SearchBoxStyle.selectWidth}>
          <GenericSelect
            placeholder="All"
            options={formattedCategories}
            onChange={handleCategoryChange}
            value={selectedCategory}
          />
        </div>
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
export default connector(SearchBox);
