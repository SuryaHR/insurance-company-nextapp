import React from "react";
import "@/scss/custom/custom_breadcrumb.scss";
import Link from "next/link";
import clsx from "clsx";

interface dataType {
  name: string;
  active?: boolean;
  path: string;
}

type breadcrumbPropType = {
  dataList: dataType[] | any;
  customClassname?: string;
  customNavClassname?: string;
};

function GenericBreadcrumb({
  dataList = [],
  customClassname = "",
  customNavClassname = "",
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
        {dataList.map((path: any) => (
          <li
            key={path.name}
            className={clsx({
              "breadcrumb-item": true,
            })}
            aria-current="page"
          >
            <Link
              className={clsx({
                link: true,
                "link-active": path.active,
              })}
              href={path.path}
            >
              {path.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default GenericBreadcrumb;
