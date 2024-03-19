import clsx from "clsx";
import React from "react";
import { FieldError } from "react-hook-form";
import { inputSize, inputTheme } from "./GenericUseFormInput";
import inputStyle from "./genericInput.module.scss";

interface InputProps {
  placeholder?: string;
  showError?: FieldError | boolean;
  errorMsg?: string;
  formControlClassname?: string;
  errorMsgClassname?: string;
  inputFieldClassname?: string;
  label?: string;
  labelClassname?: string;
  theme?: keyof typeof inputTheme;
  fieldSize?: keyof typeof inputSize;
  type?: string;
  isNumberOnly?: boolean;
  isFixedError?: boolean;
  inputFieldWrapperClassName?: string;
}

function GenericNormalInput(props: InputProps & React.HTMLProps<HTMLInputElement>) {
  const {
    label,
    placeholder,
    inputFieldClassname = "",
    formControlClassname = "",
    labelClassname = "",
    theme = "default",
    fieldSize = "small",
    errorMsg = "",
    showError = false,
    errorMsgClassname = "",
    isFixedError = "",
    inputFieldWrapperClassName = "",
    ...rest
  } = props;

  const commonProps = {
    type: "text",
    placeholder,
    autoComplete: "off",
    className: clsx({
      [inputStyle["input-field"]]: true,
      [inputFieldClassname]: inputFieldClassname,
      [inputStyle[inputTheme[theme]]]: true,
      [inputStyle[inputSize[fieldSize]]]: true,
      hideInputArrow: rest?.type === "number",
    }),
    ...rest,
  };

  return (
    <div
      className={clsx({
        [inputStyle["form-control"]]: true,
        [formControlClassname]: formControlClassname,
      })}
    >
      <label
        htmlFor={rest.id}
        className={clsx({
          [labelClassname]: labelClassname,
        })}
      >
        {label}
      </label>
      <div
        className={clsx({
          [inputFieldWrapperClassName]: inputFieldWrapperClassName,
        })}
      >
        <input {...commonProps} />
        <div
          className={clsx({
            [inputStyle["error-msg"]]: true,
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

export default GenericNormalInput;
