import React, { forwardRef } from "react";
import ReactSelect, { StylesConfig } from "react-select";
import clsx from "clsx";
import selectStyle from "./genericSelect.module.scss";

interface TypedProps<T> {
  options: T[];
  labelText: string;
  placeholder?: string;
  showError?: boolean;
  errorMsg?: string;
  errorMsgClassname?: string;
  formControlClassname?: string;
  labelClassname?: string;
  isFixedError?: string;
  disabled?: boolean;
  customStyles?: StylesConfig;
  isSearchable?: boolean;
  isModalPopUp: boolean;
  selectRef?: any;
  isFullWidth?: boolean;
  [rest: string]: any;
}

function GenericSelect<T extends object>(props: TypedProps<T>, ref: any) {
  const {
    labelText,
    options,
    placeholder = "Select",
    showError = false,
    errorMsg = "",
    isFixedError = false,
    errorMsgClassname = "",
    formControlClassname = "",
    labelClassname = "",
    isMulti = false,
    customStyles = {},
    customMenuWithClear = false,
    selected = null,
    isManditaory = true,
    hideSelectedOptions = true,
    handleSelectChange,
    handleClear,
    disabled = false,
    isSearchable = true,
    isModalPopUp = false,
    selectRef = null,
    isFullWidth = true,
    ...rest
  } = props;

  const customDefaultStyles: StylesConfig = {
    menu: (styles: any) => ({
      ...styles,
      zIndex: 2,
      top: "auto",
      bottom: "100%",
    }),
    menuPortal: (styles: any) => ({
      ...styles,
      zIndex: 3,
    }),
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      border: "1px solid #c2cad8",
      boxShadow: "none",
      "&:focus, &:active": {
        border: "1px solid #4169e1",
      },
      height: !isMulti ? "30px" : "auto",
      minHeight: "30px",
      ...customStyles.control,
    }),
    valueContainer: (styles: any) => ({
      ...styles,
      ...customStyles.control,
    }),
    option: (styles: any) => {
      return {
        ...styles,
        fontSize: "13px",
        padding: "7px",
        ...customStyles.option,
      };
    },
    input: (styles: any) => ({
      ...styles,
      fontSize: "13px",
      paddingTop: "0",
      ...customStyles.input,
    }),
    placeholder: (styles: any) => ({
      ...styles,
      fontSize: "13px",
      textAlign: "left",
      fontWeight: "400",
      ...customStyles.placeholder,
    }),
    singleValue: (styles: any) => ({
      ...styles,
      fontSize: "13px",
      ...customStyles.singleValue,
    }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      padding: "2px",
      height: "25px",
      width: "22px",
      ...customStyles.dropdownIndicator,
    }),
    indicatorSeparator: (styles: any) => ({
      ...styles,
      ...customStyles.indicatorSeparator,
    }),
    clearIndicator: (styles: any) => ({
      ...styles,
      padding: "2px",
      height: "25px",
      width: "22px",
      ...customStyles.clearIndicator,
    }),

    // ...customStyles,
  };

  const CustomMenuWithClear = ({ innerRef, innerProps, isDisabled, children }: any) =>
    !isDisabled ? (
      <div ref={innerRef} {...innerProps} className={selectStyle.menu}>
        {customMenuWithClear && (
          <a className={selectStyle.clearAllAnchor} onClick={handleClear}>
            Clear All
          </a>
        )}
        {children}
      </div>
    ) : null;
  return (
    <div
      className={clsx({
        [selectStyle["form-control"]]: true,
        [selectStyle["full-width"]]: isFullWidth,
        [formControlClassname]: formControlClassname,
      })}
    >
      {labelText && (
        <label
          className={clsx({
            [labelClassname]: labelClassname,
            "d-none": !isManditaory,
          })}
        >
          <span style={{ color: "red" }}>*</span> {labelText}
        </label>
      )}

      <div>
        <ReactSelect
          styles={customDefaultStyles}
          components={{ Menu: CustomMenuWithClear }}
          value={selected}
          onChange={handleSelectChange}
          options={options}
          placeholder={placeholder}
          isClearable={true}
          isSearchable={isSearchable}
          hideSelectedOptions={hideSelectedOptions}
          isMulti={isMulti}
          classNames={{
            container: () => selectStyle.reactSelectContainer,
            control: () => (disabled ? selectStyle.disabled : ""),
          }}
          menuPortalTarget={
            typeof window !== "undefined" && !isModalPopUp ? document.body : null
          }
          maxMenuHeight={200}
          menuShouldScrollIntoView={false}
          ref={ref ?? selectRef}
          openMenuOnFocus
          {...rest}
        />
        <div
          className={clsx({
            [selectStyle["error-msg"]]: true,
            "d-none": !showError,
            [errorMsgClassname]: errorMsgClassname,
            "position-absolute": isFixedError,
          })}
        >
          {errorMsg}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(GenericSelect);
