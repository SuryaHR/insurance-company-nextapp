import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { FieldError, FieldErrorsImpl } from "react-hook-form";
import { inputSize, inputTheme } from "./GenericUseFormInput";
import clsx from "clsx";
import inputStyle from "./genericInput.module.scss";

interface InputProps {
  defaultValue?: string;
  handleChange: ({ value }: { value: string; clbk?: (maxdata: string) => void }) => void;
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

export interface percentFormatHandlers {
  changeValue: (value: string) => void;
}

function GenericPercentFormat(
  props: InputProps & React.HTMLProps<HTMLInputElement>,
  ref: ForwardedRef<percentFormatHandlers>
) {
  const {
    handleChange,
    formControlClassname = "",
    labelClassname = "",
    label = "",
    errorMsg = "",
    errorMsgClassname = "",
    showError = false,
    isFixedError = false,
    placeholder = "",
    inputFieldClassname = "",
    theme = "default",
    fieldSize = "small",
    inputFieldWrapperClassName = "",
    defaultValue,
    ...rest
  } = props;
  const [formatValue, setFormatValue] = useState(
    // defaultValue ? parseFloat(defaultValue).toFixed(2) + "%" : ""
    (defaultValue !== undefined && +defaultValue == 0) || defaultValue
      ? parseFloat(defaultValue).toFixed(2) + "%"
      : ""
  );

  const updateValue = useCallback(
    (value: string) => {
      setFormatValue(value);
      if (!value && value !== "0") {
        handleChange({
          value,
          clbk: (maxdata) => {
            setFormatValue(maxdata);
          },
        });
      } else {
        value = Number.parseFloat(value).toString();

        handleChange({
          value,
          clbk: (maxdata) => {
            setFormatValue(maxdata);
          },
        });
      }
    },
    [handleChange]
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        changeValue(value: string) {
          updateValue(value);
        },
      };
    },
    [updateValue]
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
              value = value.replace("%", "").replaceAll(",", "");
              if (parseInt(value) === 0) {
                value = "";
              } else {
                value = parseFloat(value).toString();
              }
              setFormatValue(!value ? value : Number.parseFloat(value).toString());
            }
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            let value = e.target.value;
            if (value) {
              value = Number(value).toFixed(2);
              value = `${value}%`;
            }
            updateValue(value);
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
}

export default forwardRef(GenericPercentFormat);
