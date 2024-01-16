"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import ServiceRequestSearchStyle from "./ServiceRequestSearchBox.module.scss";
import { fetchServiceRequestList } from "@/services/ClaimServiceRequestListService";
import { addServiceSearchKeyWord } from "@/reducers/ClaimData/ClaimServiceRequestSlice";
import { ConnectedProps, connect } from "react-redux";
import { TABLE_LIMIT_5 } from "@/constants/constants";
import useTranslation from "@/hooks/useTranslation";
import { serviceRequestComponentType } from "@/translations/serviceRequestComponent/en";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
}
const ServiceRequestSearchBox: React.FC<connectorType & typeProps> = (props) => {
  const [searchValue, setSearchValue] = React.useState("");
  const {
    setTableLoader,
    searchKeyword,
    addServiceSearchKeyWord,
  }: React.SetStateAction<any> = props;

  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    if (searchKeyword !== "" && e.target.value === "") {
      setTableLoader(true);
      addServiceSearchKeyWord({ searchKeyword: "" });
      const result = await fetchServiceRequestList();
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const searchKey = async (event: any) => {
    if (event.key === "Enter") {
      setTableLoader(true);
      addServiceSearchKeyWord({ searchKeyword: event.target.value });
      const result = await fetchServiceRequestList(
        0,
        TABLE_LIMIT_5,
        "",
        "asc",
        event.target.value
      );
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const {
    translate,
    loading,
  }: { translate: serviceRequestComponentType | undefined; loading: boolean } =
    useTranslation("serviceRequestComponent");
  console.log("transalte", translate);
  if (loading) {
    return null;
  }

  return (
    <div className={ServiceRequestSearchStyle.searchBox}>
      <RiSearch2Line className={ServiceRequestSearchStyle.searchIcon} />
      <input
        type="text"
        placeholder={translate?.search ?? ""}
        value={searchValue}
        onChange={handleSearch}
        onKeyDown={searchKey}
      />
    </div>
  );
};

const mapStateToProps = ({ claimServiceRequestdata }: any) => ({
  searchKeyword: claimServiceRequestdata.searchKeyword,
});
const mapDispatchToProps = {
  addServiceSearchKeyWord,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ServiceRequestSearchBox);
