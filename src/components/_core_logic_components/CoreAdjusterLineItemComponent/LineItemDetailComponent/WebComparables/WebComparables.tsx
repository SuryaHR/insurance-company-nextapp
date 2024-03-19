import React, { useContext, useState } from "react";
import webComparablesStyle from "./webComparables.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import PriceLimitComparable from "./PriceLimitComparable";
import ComparableSearchBox from "./ComparableSearchBox";
import LoadingSkelton from "./LoadingSkelton";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/store/store";
import SearchedItem from "./ComparableSearchBox/SearchedItem";
import { unknownObjectType } from "@/constants/customTypes";
import {
  addtoComparableList,
  searchComparable,
} from "@/reducers/_core_logic_reducers/LineItemDetail/LineItemThunkService";
import { WEB_SEARCH_ENGINES } from "@/constants/constants";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { LineItemContext } from "../../LineItemContext";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import selectItemCategory from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectItemCategory";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { lineItemTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-line-item-detail/[claimId]/[itemId]/page";

export interface searchInputType {
  endPrice: number;
  startPrice: number;
  searchKey: string;
  // selectedEngine: typeof WEB_SEARCH_ENGINES;
}

const WebComparables: React.FC<connectorType> = (props) => {
  const {
    translate: {
      lineItemTranslate: { searchItem },
    },
  } = useContext<TranslateContextData<lineItemTranslatePropType>>(TranslateContext);
  const {
    isSearching,
    searchList,
    searchComparable,
    priceFrom,
    priceTo,
    searchKey,
    selectedEngine,
    addtoComparableList,
    addNotification,
    selectedCategory,
  } = props;
  const [searchInput, setSearchInput] = useState<searchInputType>({
    startPrice: priceFrom,
    endPrice: priceTo,
    searchKey,
  });

  const searchByEngine = (engine: typeof WEB_SEARCH_ENGINES) => {
    const payload = { ...searchInput, selectedEngine: engine };
    searchComparable(payload);
  };

  const startSearch = () => {
    const payload = { ...searchInput };
    if (!payload?.startPrice) {
      payload["startPrice"] = 0;
    }
    searchComparable(payload);
  };

  const updateState = (key: string, value: string | number | object) =>
    setSearchInput((prev) => ({ ...prev, [key]: value }));

  const {
    subCategoryRef,
    categoryRef,
    inView,
    rapidSubCategoryRef,
    rapidcategoryRef,
    setShowLoader,
    handleItemReplace,
    files,
    clearFile,
  } = useContext(LineItemContext);
  const addComparable = (
    data: unknownObjectType,
    index: number,
    isReplaceItem = false
  ) => {
    if (isReplaceItem && !selectedCategory?.category && !selectedCategory?.subCategory) {
      if (inView) {
        if (categoryRef?.current) {
          categoryRef.current.focus();
        }
      } else if (rapidcategoryRef?.current) {
        rapidcategoryRef?.current?.focus();
      }
      addNotification({
        message: "Please select category and subcategory",
        id: new Date().valueOf(),
        status: "warning",
      });
    } else if (isReplaceItem && !selectedCategory?.subCategory) {
      if (inView) {
        if (subCategoryRef?.current) {
          subCategoryRef.current.focus();
        }
      } else if (rapidSubCategoryRef?.current) {
        rapidSubCategoryRef?.current?.focus();
      }
      addNotification({
        message: "Please select subcategory",
        id: new Date().valueOf(),
        status: "warning",
      });
    } else {
      setShowLoader(true);
      addtoComparableList({
        item: data,
        index,
        isReplacement: isReplaceItem,
        attachmentList: files,
        clbk: () => {
          handleItemReplace();
          setShowLoader(false);
          clearFile();
        },
      });
    }
  };

  return (
    <div className={webComparablesStyle.root}>
      <div className={webComparablesStyle.searchContainer}>
        <GenericComponentHeading title={searchItem?.heading} />
        <div className={webComparablesStyle.searchWraper}>
          <ComparableSearchBox
            selectedEngine={selectedEngine}
            searchKey={searchInput.searchKey}
            updateState={updateState}
            handleSubmit={startSearch}
            searchByEngine={searchByEngine}
          />
          <PriceLimitComparable
            startPrice={searchInput.startPrice}
            endPrice={searchInput.endPrice}
            handleSubmit={startSearch}
            updateState={updateState}
          />
        </div>
      </div>
      <div className={webComparablesStyle.itemListContainer}>
        {!isSearching &&
          searchList?.length > 0 &&
          searchList?.map((data: unknownObjectType, i: number) => (
            <SearchedItem key={i} index={i} data={data} onComparableAdd={addComparable} />
          ))}

        {!isSearching && searchList?.length === 0 && (
          <div className={webComparablesStyle.noDataDiv}>
            <NoRecordComponent message={searchItem?.noSearch} />
          </div>
        )}
        {isSearching && (
          <>
            <LoadingSkelton />
            <LoadingSkelton />
            <LoadingSkelton />
            <LoadingSkelton />
            <LoadingSkelton />
            <LoadingSkelton />
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isSearching: state[EnumStoreSlice.LINE_ITEM_DETAIL].webSearch.isSearching,
  searchList: state[EnumStoreSlice.LINE_ITEM_DETAIL].webSearch.searchList,
  priceFrom: state[EnumStoreSlice.LINE_ITEM_DETAIL].webSearch.priceFrom,
  priceTo: state[EnumStoreSlice.LINE_ITEM_DETAIL].webSearch.priceTo,
  searchKey: state[EnumStoreSlice.LINE_ITEM_DETAIL].webSearch.searchKey,
  selectedEngine: state[EnumStoreSlice.LINE_ITEM_DETAIL].webSearch.selectedEngine,
  selectedCategory: selectItemCategory(state),
});

const mapDispatchToProps = {
  searchComparable,
  addtoComparableList,
  addNotification,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(WebComparables);
