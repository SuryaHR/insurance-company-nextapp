"use client";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import styles from "./searchBox.module.scss";

interface SearchBoxProps {
  value?: string;
  placeholder: string;
  onChange: (value: any) => void;
  onKeyDown?: (value: any) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onChange,
  onKeyDown,
  value,
  placeholder,
}) => {
  return (
    <div className={styles.searchBox}>
      <RiSearch2Line className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default SearchBox;
