import React from "react";
import clsx from "clsx";
import buttonStyle from "./genericButton.module.scss";

enum btnThemes {
  lightBlue = "light-blue",
  darkBlue = "dark-blue",
  normal = "normal-button",
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
  onClickHandler?: (value: any) => void;
  [rest: string | number]: any;
};

function GenericButton({
  label,
  btnClassname = "",
  theme = "normal",
  size = "large",
  disabled,
  onClickHandler,
  ...rest
}: genericButtonType) {
  return (
    <button
      className={clsx({
        [buttonStyle[btnThemes[theme]]]: true,
        [buttonStyle.genericBtn]: true,
        [btnClassname]: btnClassname,
        [buttonStyle[btnSize[size]]]: size,
      })}
      disabled={disabled}
      type="button"
      onClick={onClickHandler}
      {...rest}
    >
      {label}
    </button>
  );
}

export default GenericButton;
