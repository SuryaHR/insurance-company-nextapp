import React from "react";
import headingStyle from "./genericComponentHeading.module.scss";
import clsx from "clsx";

type TypedHeading = {
  title: string | any;
  children?: React.ReactNode;
  customHeadingClassname?: string;
  customTitleClassname?: string;
};

function GenericComponentHeading(props: TypedHeading) {
  const {
    title,
    children = null,
    customHeadingClassname = "",
    customTitleClassname = "",
  } = props;
  return (
    <div
      className={clsx(headingStyle.heading, {
        [customHeadingClassname]: customHeadingClassname,
      })}
    >
      <div
        className={clsx({
          [customTitleClassname]: customTitleClassname,
        })}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

export default GenericComponentHeading;
