import React, { FC, useRef, useState } from "react";
import Select, { components, InputAction, OptionProps, StylesConfig } from "react-select";

import style from "./checkBoxSelect.module.scss";

interface OptionType {
  label: string;
  value: string;
}
interface CheckBoxSelectProps extends OptionProps<any> {
  options: OptionType[];
  placeholder?: string;
  selected?: OptionType[];
  defaultValue?: OptionType[];
  selectRef?: any;
  [key: string]: any;
}
export type Option = {
  value: number | string;
  label: string;
};

const CheckBoxSelect: FC<CheckBoxSelectProps> = (props) => {
  const [selectInput, setSelectInput] = useState<string>("");
  const isAllSelected = useRef<boolean>(false);
  const selectAllLabel = useRef<string>("Select all");
  const allOption = { value: "*", label: selectAllLabel.current };

  const Option = (props: any) => {
    return (
      <components.Option {...props}>
        {props.value === "*" &&
        !isAllSelected.current &&
        filteredSelectedOptions?.length > 0 ? (
          <input
            key={props.value}
            type="checkbox"
            ref={(input) => {
              if (input) input.indeterminate = true;
            }}
          />
        ) : (
          <input
            key={props.value}
            type="checkbox"
            checked={isAllSelected.current || props.isSelected}
            onChange={() => {}}
          />
        )}
        <label className={style.marginLeft}>{props.label}</label>
      </components.Option>
    );
  };

  const Input = (props: any) => (
    <>
      {selectInput.length === 0 ? (
        <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
          {props.children}
        </components.Input>
      ) : (
        <div>
          <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
            {props.children}
          </components.Input>
        </div>
      )}
    </>
  );

  const onInputChange = (inputValue: string, event: { action: InputAction }) => {
    if (event.action === "input-change") setSelectInput(inputValue);
    else if (event.action === "menu-close" && selectInput !== "") setSelectInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === " " || e.key === "Enter") && !selectInput) e.preventDefault();
  };

  const filterOptions = (options: Option[], input: string) =>
    options?.filter(({ label }: Option) =>
      label.toLowerCase().includes(input.toLowerCase())
    );

  const comparator = (v1: Option, v2: Option) =>
    (v1.value as number) - (v2.value as number);

  const filteredOptions = filterOptions(props.options, selectInput);
  const filteredSelectedOptions = filterOptions(props.value, selectInput);

  const handleChange = (selected: Option[] | any) => {
    if (
      selected.length > 0 &&
      !isAllSelected.current &&
      (selected[selected.length - 1].value === allOption.value ||
        JSON.stringify(filteredOptions) === JSON.stringify(selected.sort(comparator)))
    )
      return props.onChange(
        [
          ...(props.value ?? []),
          ...props.options.filter(
            ({ label }: Option) =>
              label.toLowerCase().includes(selectInput?.toLowerCase()) &&
              (props.value ?? []).filter((opt: Option) => opt.label === label).length ===
                0
          ),
        ].sort(comparator)
      );
    else if (
      selected.length > 0 &&
      selected[selected.length - 1].value !== allOption.value &&
      JSON.stringify(selected.sort(comparator)) !== JSON.stringify(filteredOptions)
    )
      return props.onChange(selected);
    else
      return props.onChange([
        ...(props.value || []).filter(
          ({ label }: Option) =>
            !label.toLowerCase().includes((selectInput || "").toLowerCase())
        ),
      ]);
  };
  const customStyles: StylesConfig<OptionType, boolean> = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      border: "1px solid #c2cad8",
      boxShadow: "none",
      "&:focus, &:active": {
        border: "1px solid #4169e1",
      },
    }),
    menu: (styles: any) => ({
      ...styles,
      zIndex: 500,
      overflowY: "hidden",
    }),
    menuPortal: (styles: any) => ({
      ...styles,
      zIndex: 3,
      overflowY: "scroll",
    }),
    option: (styles: any) => {
      return {
        ...styles,
        fontSize: "13px",
        padding: "7px",
        height: "28px",
        position: "relative",
        background: "none",
        color: "black",
      };
    },
    valueContainer: (styles: any) => ({
      ...styles,
      height: "30px",
      fontSize: "12px",
      overflowY: "auto",
    }),
    input: (styles: any) => ({
      ...styles,
      fontSize: "10px",
      paddingTop: "0",
      height: "10px",
      ...customStyles.input,
    }),
    placeholder: (styles: any) => ({
      ...styles,
      fontSize: "13px",
      textAlign: "left",
      fontWeight: "400",
      ...customStyles.placeholder,
    }),
  };

  if (props.isSelectAll && props?.options?.length !== 0) {
    isAllSelected.current =
      JSON.stringify(filteredSelectedOptions) === JSON.stringify(filteredOptions);
    selectAllLabel.current = "Select all";
    allOption.label = selectAllLabel.current;

    return (
      <Select
        {...props}
        inputValue={selectInput}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        options={[allOption, ...props.options]}
        onChange={handleChange}
        components={{
          Option: Option,
          Input: Input,
          ...props.components,
        }}
        menuPlacement={props.menuPlacement ?? "auto"}
        styles={customStyles}
        isMulti
        closeMenuOnSelect={false}
        tabSelectsValue={false}
        hideSelectedOptions={false}
      />
    );
  }

  return (
    <div>
      <Select
        {...props}
        inputValue={selectInput}
        onInputChange={onInputChange}
        components={{
          Input: Input,
          ...props.components,
        }}
        menuPlacement={props.menuPlacement ?? "auto"}
        onKeyDown={onKeyDown}
        tabSelectsValue={false}
        hideSelectedOptions={true}
      />
    </div>
  );
};

export default CheckBoxSelect;
