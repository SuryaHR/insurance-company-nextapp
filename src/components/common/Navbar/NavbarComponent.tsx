"use client";
import React from "react";
import MenuBarStyle from "./navbarStyle.module.scss";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { FaAngleRight } from "react-icons/fa6";

type TypeMenuoption = {
  link: string;
  label: string;
  dropdown?: TypeMenuoption[];
};

export type TypedMenuObject = {
  label: string;
  dropdown?: TypeMenuoption[];
  link?: string;
  pathList?: string[];
};

type TypedProps = {
  menu: TypedMenuObject[];
};

const SubNavBar = ({
  item,
  isChild = false,
}: {
  item: TypeMenuoption[];
  isChild?: boolean;
}) => {
  const router = useRouter();
  return item.map((option, i) => (
    <div
      key={`option_${i}`}
      className={clsx({
        [MenuBarStyle.dropdownOption]: !isChild,
        [MenuBarStyle?.childNav]: isChild,
      })}
      onMouseOver={() => {
        if (option.dropdown) {
          const id = `#${option?.label?.replaceAll("'", "").split(" ").join("_")}_${i}`;
          const childNode = document.querySelector<HTMLElement>(id);
          if (childNode) childNode.style.display = "flex";
        }
      }}
      onMouseLeave={() => {
        if (option.dropdown) {
          const id = `#${option?.label?.replaceAll("'", "").split(" ").join("_")}_${i}`;
          const childNode = document.querySelector<HTMLElement>(id);
          if (childNode) childNode.style.display = "none";
        }
      }}
      onClick={() => {
        if (!isChild) {
          option?.link && router.push(option.link);
        }
      }}
    >
      {option.label}
      {option?.dropdown ? (
        <FaAngleRight size={16} className={MenuBarStyle.arrowBtn} />
      ) : (
        ""
      )}
      {option?.dropdown && (
        <div
          id={`${option?.label?.replaceAll("'", "").split(" ").join("_")}_${i}`}
          className={MenuBarStyle.subNavBarContainer}
        >
          <SubNavBar item={option.dropdown} isChild={true} />
        </div>
      )}
    </div>
  ));
};

export default function NavbarComponent(props: TypedProps) {
  const { menu } = props;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={MenuBarStyle.container}>
      {menu.map((item, i) => (
        <div
          key={`menu_${i}`}
          id={`menu_${i}`}
          className={clsx(MenuBarStyle.navItems, {
            [MenuBarStyle.selected]: item?.pathList?.includes(pathname?.split("/")[1]),
          })}
          data-name={`menu_${i}`}
          onMouseOver={(e: any) => {
            const hoverMenu = e.target.closest(`#menu_${i}`);
            if (hoverMenu) {
              hoverMenu.classList.add(MenuBarStyle.active);
              const dropDown = hoverMenu.querySelector("#drop");
              if (dropDown) {
                dropDown.classList.add(MenuBarStyle.showDropdown);
              }
            }
          }}
          onClick={() => {
            item?.link && router.push(item.link);
          }}
          onMouseLeave={(e: any) => {
            const hoverMenu = e.target.closest(`#menu_${i}`);
            if (hoverMenu) {
              hoverMenu.classList.remove(MenuBarStyle.active);
              const dropDown = hoverMenu.querySelector("#drop");
              if (dropDown) {
                dropDown.classList.remove(MenuBarStyle.showDropdown);
              }
            }
          }}
        >
          <button className={MenuBarStyle.navItem}>{item.label}</button>
          {item?.dropdown && (
            <div id="drop" className={MenuBarStyle.dropdownContent}>
              <SubNavBar item={item.dropdown} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
