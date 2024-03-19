"use client";
import React from "react";
import ReciptMapperSearchBoxStyles from "./reciptMapperSearchBox.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { getReceiptMapperDate } from "@/services/_adjuster_services/ReceiptMapper/ReceiptMapperService";
import { useParams } from "next/navigation";
import {
  addReciptPdfListKeyWord,
  receiptMapperDate,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
import SearchBox from "@/components/common/SearchBox/SearchBox";

interface typeProps {
  setListLoader: React.SetStateAction<any>;
}
const ReciptMapperSearchBox: React.FC<connectorType & typeProps> = (props) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const { claimId } = useParams();
  const [searchValue, setSearchValue] = React.useState("");
  const {
    setListLoader,
    searchKeyword,
    addReciptPdfListKeyWord,
    receiptMapperPdfList,
    receiptMapperDate,
  }: React.SetStateAction<any> = props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      setListLoader(true);
      addReciptPdfListKeyWord({ searchKeyword: "" });
      const result = await getReceiptMapperDate({
        claimId: claimId,
      });
      if (result) {
        setListLoader(false);
      }
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      setListLoader(true);
      addReciptPdfListKeyWord({ searchKeyword: event.target.value });
      const searchWord = event.target.value;
      const updatedData = receiptMapperPdfList.flatMap((entry: any) => {
        const matchingPdfList = entry.pdfList.filter((pdf: any) =>
          pdf.name.toLowerCase().includes(searchWord.toLowerCase())
        );
        return matchingPdfList.length > 0 ? [{ ...entry, pdfList: matchingPdfList }] : [];
      });

      await receiptMapperDate({ receiptMapperPdf: updatedData });
      if (updatedData) {
        setListLoader(false);
      }
    }
  };

  return (
    <div className={ReciptMapperSearchBoxStyles.searchbox}>
      <SearchBox
        placeholder={translate?.receiptMapperTranslate?.claimedItems?.search}
        value={searchValue}
        onChange={handleSearch}
        onKeyDown={searchKey}
      />
    </div>
  );
};

const mapStateToProps = ({ receiptMapper }: any) => ({
  searchKeyword: receiptMapper.searchKeyword,
  receiptMapperPdfList: receiptMapper.receiptMapperPdfList,
});
const mapDispatchToProps = {
  addReciptPdfListKeyWord,
  receiptMapperDate,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ReciptMapperSearchBox);
