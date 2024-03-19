import React from "react";
import "@/scss/custom/custom_breadcrumb.scss";
import Link from "next/link";
import clsx from "clsx";

interface dataType {
  name: string;
  active?: boolean;
  path: string;
  optional?: boolean;
  clickHandler?: () => void;
}

type breadcrumbPropType = {
  dataList: dataType[] | any;
  customClassname?: string;
  customNavClassname?: string;
  [rest: string | number]: any;
};

function GenericBreadcrumb({
  dataList = [],
  customClassname = "",
  customNavClassname = "",
  ...rest
}: breadcrumbPropType) {
  return (
    <nav
      aria-label="breadcrumb"
      className={clsx({
        [customNavClassname]: customNavClassname,
      })}
    >
      <ol
        className={clsx("breadcrumb", {
          [customClassname]: customClassname,
        })}
      >
        {dataList.map((pathObj: dataType) => (
          <React.Fragment key={pathObj?.name}>
            {(pathObj?.optional === undefined || pathObj?.optional) && (
              <li
                key={pathObj.path}
                className={clsx({
                  "breadcrumb-item": true,
                })}
                aria-current="page"
                onClick={pathObj?.clickHandler && pathObj?.clickHandler}
              >
                <Link
                  className={clsx({
                    link: true,
                    "link-active": pathObj.active,
                  })}
                  href={pathObj.path}
                  {...rest}
                >
                  {pathObj.name}
                </Link>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export default GenericBreadcrumb;
