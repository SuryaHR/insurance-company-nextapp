import React, { forwardRef } from "react";
import { clsx } from "clsx";

import textAreaStyle from "./genericTextArea.module.scss";

type propsType = {
  placeholder?: string;
  showError?: boolean;
  errorMsg?: string;
  formControlClassname?: string;
  errorMsgClassname?: string;
  fieldClassname?: string;

  [rest: string]: any;
};

function GenericTextArea(props: propsType, ref: any) {
  const {
    placeholder = "",
    showError = false,
    formControlClassname = "",
    errorMsgClassname = "",
    fieldClassname = "",
    errorMsg = "",
    isFixedError = false,
    fieldWrapperClassName = "",
    ...rest
  } = props;
  return (
    <div
      className={clsx({
        [textAreaStyle["form-control"]]: true,
        [formControlClassname]: formControlClassname,
      })}
    >
      <div
        className={clsx({
          [fieldWrapperClassName]: fieldWrapperClassName,
        })}
      >
        <textarea
          ref={ref}
          placeholder={placeholder}
          autoComplete="false"
          className={clsx({
            [textAreaStyle["text-field"]]: true,
            [fieldClassname]: fieldClassname,
          })}
          {...rest}
        />
        <div
          className={clsx({
            [textAreaStyle["error-msg"]]: true,
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

export default forwardRef(GenericTextArea);
