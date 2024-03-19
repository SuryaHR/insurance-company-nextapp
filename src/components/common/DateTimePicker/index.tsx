import React from "react";
import { clsx } from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import inputStyle from "./dateTimePicker.module.scss";

type Props = {
  minDate?: Date | null;
  maxDate?: Date | null;
  placeholderText?: string;
  showIcon?: boolean;
  disable?: boolean;
  name: string;
  labelClassname?: string;
  formControlClassname?: string;
  errorMsg?: string;
  labelText?: string;
  dateFormat?: string;
  showTimeSelect?: boolean;
  isRequired?: boolean;
  time_24hr?: boolean;
  enableTime?: boolean;
  minTime?: Date;
  maxTime?: Date;
  showError?: boolean;
  selected?: Date | null;
  errorMsgClassname?: string;
  customDateClassName: string;
  onChange: (value: Date | null) => void;
  value: Date | null;
};

const DateTimePicker = (props: Props) => {
  const {
    name,
    labelText,
    isRequired,
    showError,
    errorMsg = "",
    onChange,
    errorMsgClassname = "",
    labelClassname = "",
    formControlClassname = "",
    value,
    customDateClassName = "",
    ...rest
  } = props;

  return (
    <>
      <div
        className={clsx({
          [inputStyle["form-control"]]: true,
          [formControlClassname]: formControlClassname,
        })}
      >
        <label
          htmlFor={name}
          className={clsx({
            [labelClassname]: labelClassname,
          })}
        >
          {isRequired && <span style={{ color: "red" }}>*</span>} {labelText}
        </label>
        <DatePicker
          selected={value}
          onChange={(date: Date | null) => onChange(date)}
          calendarClassName={inputStyle.calendarClassName}
          className={`${inputStyle.dateClassName} ${customDateClassName}`}
          {...rest}
        />
        <div
          className={clsx({
            [inputStyle["error-msg"]]: true,
            "d-none": showError,
            [errorMsgClassname]: errorMsgClassname,
          })}
        >
          {errorMsg}
        </div>
      </div>
    </>
  );
};

export default DateTimePicker;
