"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import SearchAssignStyle from "./searchBoxAssignItems.module.scss";

const SearchBoxAssignItems: React.FC = () => {
  return (
    <div className={SearchAssignStyle.searchBox}>
      <RiSearch2Line className={SearchAssignStyle.searchIcon} />
      <input type="text" placeholder="Search..." />
    </div>
  );
};

export default SearchBoxAssignItems;
