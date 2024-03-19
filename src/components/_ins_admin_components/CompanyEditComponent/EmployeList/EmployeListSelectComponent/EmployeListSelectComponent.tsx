"use client";
import React, { useEffect, useState } from "react";
import styles from "./EmployeListSelectComponent.module.scss";
import GenericSelect from "@/components/common/GenericSelect";

const EmployeListSelectComponent = () => {
  const [selectedOption, setSelectedOption] = useState<any>();
  const options = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Inactive",
      label: "Inactive",
    },
  ];

  const customStyles = {
    control: (defaultStyles: any) => ({
      ...defaultStyles,
      width: "252px",
      minHeight: "25px",
      maxHeight: "27px",
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      "@media only screen and (min-width: 2560px)": {
        width: "340px",
        height: "29px",
        marginBottom: "0px",
      },
    }),
    placeholder: (defaultStyles: any) => ({
      ...defaultStyles,
      fontSize: "12px",
      padding: "2px 0px 10px 2px",
    }),
    indicatorSeparator: (defaultStyles: any) => ({
      ...defaultStyles,
      display: "none",
    }),
    dropdownIndicator: (defaultStyles: any) => ({
      ...defaultStyles,
      padding: "2px 0px 10px 2px",
    }),
    option: (defaultStyles: any, state: any) => ({
      ...defaultStyles,
      backgroundColor: state.isSelected ? "#e1e5ec" : "white",
      color: "#262626",
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "#337ab7",
        color: "white",
      },
      "&:active": {
        backgroundColor: "#337ab7",
        color: "white",
      },
    }),
  };
  useEffect(() => {
    setSelectedOption({
      value: "All",
      label: "All",
    });
  }, []);

  return (
    <>
      <div className={styles.addStyleContainer}>
        <p className={styles.textAddStyle}>View</p>
        <GenericSelect
          placeholder="Select"
          options={options}
          customStyles={customStyles}
          hideSelectedOptions={false}
          value={selectedOption}
          formControlClassname={styles.labelClassStyle}
        />
      </div>
    </>
  );
};

export default EmployeListSelectComponent;
