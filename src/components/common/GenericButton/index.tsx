import React from "react";
import clsx from "clsx";
import buttonStyle from "./genericButton.module.scss";
import CustomLoader from "../CustomLoader";

enum btnThemes {
  lightBlue = "light-blue",
  darkBlue = "dark-blue",
  normal = "normal-button",
  coreLogic = "core-logic-button",
  deleteBtn = "delete-button",
  existingDarkBlueBtn = "existing-blue-btn",
  linkBtn = "linkButton",
}

enum btnSize {
  medium = "medium-btn",
  large = "large-btn",
  small = "small-btn",
}

type genericButtonType = {
  label: string | any;
  theme?: keyof typeof btnThemes;
  size?: keyof typeof btnSize;
  btnClassname?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  onClickHandler?: any;
  [rest: string | number]: any;
};

function GenericButton({
  label,
  btnClassname = "",
  theme = "normal",
  size = "large",
  disabled,
  isSubmitting = false,
  onClickHandler,
  tableBtn = false,
  ...rest
}: genericButtonType) {
  return (
    <button
      className={clsx({
        [buttonStyle[btnThemes[theme]]]: true,
        [buttonStyle.genericBtn]: true,
        [btnClassname]: btnClassname,
        [buttonStyle[btnSize[size]]]: size,
        [buttonStyle.btnLoader]: isSubmitting,
        [buttonStyle.tableBtn]: tableBtn,
      })}
      disabled={disabled}
      type="button"
      onClick={onClickHandler}
      {...rest}
    >
      {isSubmitting && (
        <span className={buttonStyle.loadingState}>
          {" "}
          <CustomLoader loaderType="spinner2" />
        </span>
      )}
      {label}
    </button>
  );
}

export default GenericButton;
