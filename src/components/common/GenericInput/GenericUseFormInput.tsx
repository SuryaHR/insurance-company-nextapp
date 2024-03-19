"use client";
import clsx from "clsx";
import React, { ForwardedRef, forwardRef, useState } from "react";
import inputStyle from "./genericInput.module.scss";
import { FieldError, FieldErrorsImpl } from "react-hook-form";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

export enum inputTheme {
  normal = "normal-input",
  default = "",
}
export enum inputSize {
  small = "small-input",
  medium = "medium-input",
  large = "large-input",
}
const acceptOnlyNumberHandler = (e: React.KeyboardEvent<HTMLElement>) => {
  switch (e.key) {
    case "Backspace":
    case "Enter":
    case "Tab":
    case "Delete":
    case "ArrowLeft":
    case "ArrowRight":
      break;
    default:
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
  }
};
interface InputProps {
  placeholder?: string;
  showError?: FieldError | boolean | FieldErrorsImpl;
  errorMsg?: string | FieldErrorsImpl | FieldError;
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

const GenericUseFormInput = (
  props: InputProps & React.HTMLProps<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
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
    type = "text",
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const commonProps = {
    type: type === "password" ? (!showPassword ? "password" : "text") : type,
    placeholder,
    autoComplete: "off",
    ref,
    className: clsx({
      [inputStyle["input-field"]]: true,
      [inputFieldClassname]: inputFieldClassname,
      [inputStyle[inputTheme[theme]]]: true,
      [inputStyle[inputSize[fieldSize]]]: true,
      [inputStyle.passwordFieldPadding]: type === "password",
      hideInputArrow: type === "number",
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
        {type !== "password" && (
          <input
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
              rest.isNumberOnly && acceptOnlyNumberHandler(e)
            }
            {...commonProps}
          />
        )}
        {type === "password" && (
          <div className={inputStyle.passwordFieldContainer}>
            <input
              onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                rest.isNumberOnly && e.key === "." && e.preventDefault()
              }
              {...commonProps}
            />
            <div className={inputStyle.eyeIconContainer}>
              {showPassword && (
                <FaRegEye
                  onMouseOver={() => setShowPassword(true)}
                  onMouseLeave={() => setShowPassword(false)}
                />
              )}
              {!showPassword && (
                <FaRegEyeSlash
                  onMouseOver={() => setShowPassword(true)}
                  onMouseLeave={() => setShowPassword(false)}
                />
              )}
            </div>
          </div>
        )}
        <div
          className={clsx({
            [inputStyle["error-msg"]]: true,
            "d-none": !showError,
            [errorMsgClassname]: errorMsgClassname,
            "position-absolute": isFixedError,
          })}
        >
          {errorMsg as string}
        </div>
      </div>
    </div>
  );
};

export default forwardRef(GenericUseFormInput);
