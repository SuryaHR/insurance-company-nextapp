"use client";
import React, { useEffect } from "react";
import { RiSearch2Line } from "react-icons/ri";
import SearchComponentStyle from "./SearchComponent.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { addSearchKey } from "@/reducers/_adjuster_reducers/AllNotes/AllNotesSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";

const SearchComponent: React.FC<connectorType> = ({ searchKey }) => {
  const dispatch = useAppDispatch();
  const prevProps = React.useRef();
  const [searchValue, setSearchValue] = React.useState<any>("");
  const handleSearch = async (e: any) => {
    setSearchValue(e.target.value);
    dispatch(addSearchKey({ searchKey: e.target.value }));
  };

  useEffect(() => {
    if (prevProps.current !== searchKey) {
      setSearchValue(searchKey);
    }
  }, [searchKey]);

  return (
    <div className={SearchComponentStyle.searchBox}>
      <RiSearch2Line className={SearchComponentStyle.searchIcon} />
      <input
        type="text"
        placeholder="Search subject, participant..."
        onChange={handleSearch}
        value={searchValue}
      />
    </div>
  );
};

const mapStateToProps = ({ allNotes }: any) => ({
  searchKey: allNotes.searchKey,
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default SearchComponent;
