"use client";
import React from "react";
import SummarySearchComponentStyle from "./SummarySearchComponent.module.scss";
import {
  addClaimedItemsKeyWord,
  updateClaimedItemsListData,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import { ConnectedProps, connect } from "react-redux";
import { getClaimedItems } from "@/services/_adjuster_services/ReceiptMapper/ReceiptMapperService";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
import SearchBox from "@/components/common/SearchBox/SearchBox";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const ClaimedItemsSearchBox: React.FC<connectorType & typeProps> = (props) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const { claimId } = useParams();

  const {
    setTableLoader,
    searchKeyword,
    addClaimedItemsKeyWord,
    allClaimedItemsList,
    updateClaimedItemsListData,
  }: React.SetStateAction<any> = props;

  const handleSearch = async (e: any) => {
    if (searchKeyword !== "" && e.target.value === "") {
      setTableLoader(true);
      addClaimedItemsKeyWord({ searchKeyword: "" });
      const result = await getClaimedItems({
        claimId: claimId,
        reqForReceiptMapper: true,
      });
      if (result) {
        setTableLoader(false);
      }
    } else {
      setTableLoader(true);
      addClaimedItemsKeyWord({ searchKeyword: e.target.value });
      const searchWord = e.target.value;
      const updatedData = allClaimedItemsList.filter(
        (item: any) =>
          item?.itemNumber.toString().includes(searchWord) ||
          item.description.toLowerCase().includes(searchWord.toLowerCase()) ||
          item.category?.name?.toLowerCase().includes(searchWord.toLowerCase()) ||
          item.subCategory?.name?.toLowerCase().includes(searchWord.toLowerCase())
      );
      await updateClaimedItemsListData({ claimedData: updatedData });
      if (updatedData) {
        setTableLoader(false);
      }
    }
  };

  return (
    <div className={SummarySearchComponentStyle.searchbox}>
      <SearchBox
        placeholder={translate?.receiptMapperTranslate?.summary?.searchPlaceholder}
        value={searchKeyword}
        onChange={handleSearch}
      />
    </div>
  );
};

const mapStateToProps = ({ claimedItems }: any) => ({
  searchKeyword: claimedItems.searchKeyword,
  allClaimedItemsList: claimedItems.allClaimedItemsList,
});
const mapDispatchToProps = {
  addClaimedItemsKeyWord,
  updateClaimedItemsListData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ClaimedItemsSearchBox);
