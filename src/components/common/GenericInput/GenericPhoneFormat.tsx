import clsx from "clsx";
import React, { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import inputStyle from "./genericInput.module.scss";
import { FieldError, FieldErrorsImpl } from "react-hook-form";
import { inputSize, inputTheme } from "./GenericUseFormInput";
import { phoneFormatHandler } from "@/utils/utitlity";

interface InputProps {
  defaultValue?: string;
  handleChange: ({
    originalValue,
    formattedValue,
  }: {
    originalValue?: string;
    formattedValue?: string;
  }) => void;
  formControlClassname?: string;
  labelClassname?: string;
  label?: string;
  showError?: FieldError | FieldErrorsImpl<any> | boolean;
  errorMsg?: FieldError | FieldErrorsImpl<any> | string;
  errorMsgClassname?: string;
  theme?: keyof typeof inputTheme;
  fieldSize?: keyof typeof inputSize;
  isFixedError?: boolean;
  placeholder?: string;
  inputFieldClassname?: string;
  inputFieldWrapperClassName?: string;
}

export interface phoneFormatHandlers {
  changeValue: (value: string) => void;
}

const GenericPhoneFormat = (
  props: InputProps & React.HTMLProps<HTMLInputElement>,
  ref: ForwardedRef<phoneFormatHandlers>
) => {
  const {
    defaultValue = "",
    handleChange,
    formControlClassname = "",
    label,
    labelClassname = "",
    showError = false,
    errorMsgClassname = "",
    errorMsg = "",
    isFixedError = false,
    placeholder = "",
    inputFieldClassname = "",
    theme = "default",
    fieldSize = "small",
    inputFieldWrapperClassName = "",
    ...rest
  } = props;

  const [formatField, setFormatField] = useState(
    phoneFormatHandler(defaultValue).formattedInput
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        changeValue(value: string) {
          const { formattedInput } = phoneFormatHandler(value);
          setFormatField(formattedInput);
        },
      };
    },
    []
  );

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
        <input
          value={formatField}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            const text = (e.target as HTMLInputElement).value;
            const inputValue = text.replace(/\D/g, "");
            switch (e.key) {
              case "Backspace":
              case "Enter":
              case "Tab":
              case "Delete":
              case "ArrowLeft":
              case "ArrowRight":
                break;
              default:
                if (e.key === "." || !/[.0-9]/.test(e.key) || inputValue.length > 9) {
                  e.preventDefault();
                }
            }
          }}
          onChange={(e) => {
            const textField = e.target.value;
            const { formattedInput, input } = phoneFormatHandler(textField);
            setFormatField(formattedInput);
            handleChange({ originalValue: input, formattedValue: formattedInput });
          }}
          {...commonProps}
        />
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

export default forwardRef(GenericPhoneFormat);
