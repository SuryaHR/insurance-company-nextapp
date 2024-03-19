"use client";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import DetailedInventorySearchStyle from "./DetailedInventorySearchBox.module.scss";
import { addDetailedInventorySearchKeyWord } from "@/reducers/_adjuster_reducers/ContentsEvaluation/DetailedInventorySlice";

import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import SearchBox from "@/components/common/SearchBox/SearchBox";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const DetailedInventorySearchBox: React.FC<connectorType & typeProps> = (props) => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  const [searchValue, setSearchValue] = React.useState("");
  const { searchKeyword, addDetailedInventorySearchKeyWord }: React.SetStateAction<any> =
    props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      addDetailedInventorySearchKeyWord({ searchKeyword: "" });
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      addDetailedInventorySearchKeyWord({ searchKeyword: event.target.value });
    }
  };

  return (
    <div className={DetailedInventorySearchStyle.searchbox}>
      <SearchBox
        placeholder={
          translate?.contentsEvaluationTranslate?.detailedInventory?.searchPlaceHolder
        }
        value={searchValue}
        onChange={(e) => handleSearch(e)}
        onKeyDown={(e) => searchKey(e)}
      />
    </div>
  );
};

const mapStateToProps = ({ detailedInventorydata }: any) => ({
  searchKeyword: detailedInventorydata.searchKeyword,
});
const mapDispatchToProps = {
  addDetailedInventorySearchKeyWord,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(DetailedInventorySearchBox);
