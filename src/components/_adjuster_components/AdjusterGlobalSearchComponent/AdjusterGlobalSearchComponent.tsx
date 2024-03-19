"use client";
import React, { useContext, useEffect, useRef } from "react";
import GenericBreadcrumb from "../../common/GenericBreadcrumb";
import GlobalSearchTabsComponent from "./GlobalSearchTabsComponent";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { adjusterGlobalSearchTranslatePropsType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-global-search/page";
import selectSearchText from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectSearchText";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import { globalSearch } from "@/reducers/_adjuster_reducers/GlobalSearch/GlobalSearchThunkService";
import selectIsGlobalSearchFetching from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectIsGlobalSearchFetching";
import Loading from "@/app/[lang]/loading";
import {
  resetGlobalSearch,
  updateGlobalSearch,
} from "@/reducers/_adjuster_reducers/GlobalSearch/GlobalSearchSlice";

const AdjusterGlobalSearchComponent: React.FC<connectorType> = (props) => {
  const {
    searchString,
    globalSearch,
    isSearching,
    resetGlobalSearch,
    updateGlobalSearch,
  } = props;
  const { translate } =
    useContext<TranslateContextData<adjusterGlobalSearchTranslatePropsType>>(
      TranslateContext
    );

  const initRender = useRef(false);
  useEffect(() => {
    if (!initRender.current) {
      initRender.current = true;
      if (!searchString) {
        updateGlobalSearch({ isFetching: false });
        return;
      }
      globalSearch({ searchString, initSearch: true });
    }
    return () => {
      if (initRender.current) {
        resetGlobalSearch();
      }
    };
  }, [searchString, globalSearch, resetGlobalSearch, updateGlobalSearch]);

  const pathList = [
    {
      name: `${translate?.adjusterGlobalSearchTranslate?.home}`,
      path: "/adjuster-dashboard",
    },
    {
      name: `${translate?.adjusterGlobalSearchTranslate?.searchResults}`,
      path: "#",
      active: true,
    },
  ];

  return (
    <div className="row">
      {isSearching && <Loading />}
      <GenericBreadcrumb dataList={pathList} />
      <GlobalSearchTabsComponent />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  searchString: selectSearchText(state),
  isSearching: selectIsGlobalSearchFetching(state),
});

const mapStateToDispatch = {
  globalSearch,
  resetGlobalSearch,
  updateGlobalSearch,
};

const connector = connect(mapStateToProps, mapStateToDispatch);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AdjusterGlobalSearchComponent);
