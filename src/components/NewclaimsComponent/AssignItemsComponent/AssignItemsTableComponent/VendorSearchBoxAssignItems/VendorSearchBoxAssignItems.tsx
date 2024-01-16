"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import VendorSearchAssignStyle from "./vendorSearchBoxAssignItems.module.scss";

const VendorSearchBoxAssignItems: React.FC = () => {
  return (
    <div className={VendorSearchAssignStyle.searchBox}>
      <RiSearch2Line className={VendorSearchAssignStyle.searchIcon} />
      <input type="text" placeholder="Vendor name,Speciality,City" />
    </div>
  );
};

export default VendorSearchBoxAssignItems;
