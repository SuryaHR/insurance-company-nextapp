import { getUSDCurrency } from "@/utils/utitlity";
import clsx from "clsx";
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import inputStyle from "./genericInput.module.scss";
import { FieldError, FieldErrorsImpl } from "react-hook-form";
import { inputSize, inputTheme } from "./GenericUseFormInput";

interface InputProps {
  defaultValue?: string;
  handleChange: ({ value }: { value: string }) => void;
  formControlClassname?: string;
  labelClassname?: string;
  label?: string;
  showError?: FieldError | FieldErrorsImpl<any> | boolean;
  errorMsg?: FieldError | FieldErrorsImpl<any> | string;
  errorMsgClassname?: string;
  isFixedError?: boolean;
  placeholder?: string;
  inputFieldClassname?: string;
  theme?: keyof typeof inputTheme;
  fieldSize?: keyof typeof inputSize;
  inputFieldWrapperClassName?: string;
}

export interface currencyFormatHandlers {
  changeValue: (value: string) => void;
}

const GenericCurrencyFormat = (
  props: InputProps & React.HTMLProps<HTMLInputElement>,
  ref: ForwardedRef<currencyFormatHandlers>
) => {
  const {
    handleChange,
    defaultValue,
    formControlClassname = "",
    labelClassname = "",
    label = "",
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
  const [formatValue, setFormatValue] = useState(
    (defaultValue !== undefined && +defaultValue == 0) || defaultValue
      ? getUSDCurrency(+defaultValue)
      : ""
  );

  const updateValue = useCallback(
    (value: string) => {
      setFormatValue(value);
      // if (!value) {
      //   // handleChange({ value: "0" });
      // } else {
      //   handleChange({ value });
      // }
      handleChange({ value });
    },
    [handleChange]
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        changeValue(value: string) {
          setFormatValue(value);
        },
      };
    },
    [setFormatValue]
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
          value={formatValue}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            switch (e.key) {
              case "Backspace":
              case "Enter":
              case "Tab":
              case "Delete":
              case "ArrowLeft":
              case "ArrowRight":
                break;
              default:
                if (!/[.0-9]/.test(e.key)) {
                  e.preventDefault();
                }
            }
          }}
          onChange={(e: React.FocusEvent<HTMLInputElement>) => {
            if (e.target.value) {
              e.target.value = e.target.value.replace("$", "").replaceAll(",", "");
            }
            const tempVal = e.target.value;

            if (!isNaN(+tempVal)) {
              const deciVal = /^\d*\.?\d{0,2}$/;
              if (!deciVal.test(tempVal)) {
                return;
              }
              updateValue(tempVal);
              return;
            }
            const regex = /\D/;
            const val = regex.test(tempVal) ? Number.parseFloat(tempVal) : tempVal;
            if (!isNaN(+val)) {
              e.target.value = val.toString();
            }
            console.log(e.target.value);
            updateValue(e.target.value);
          }}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            let value = e.target.value;
            if (value) {
              value = value.replace("$", "").replaceAll(",", "");
              // if (parseInt(value) === 0) {
              //   value = "";
              // }
              setFormatValue(!value ? value : Number.parseFloat(value).toString());
            }
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            let value = e.target.value;
            if (value) {
              value = getUSDCurrency(+value ?? 0);
            }
            setFormatValue(value);
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

export default forwardRef(GenericCurrencyFormat);
