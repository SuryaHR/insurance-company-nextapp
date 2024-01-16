"use client";
import React from "react";
import MenuBarStyle from "./navbarStyle.module.scss";
import clsx from "clsx";

type TypeMenuoption = {
  link: string;
  label: string;
  dropdown?: TypeMenuoption[];
};

export type TypedMenuObject = {
  label: string;
  active?: boolean;
  dropdown?: TypeMenuoption[];
};

type TypedProps = {
  menu: TypedMenuObject[];
};

export default function NavbarComponent(props: TypedProps) {
  const { menu } = props;
  return (
    <div className={MenuBarStyle.container}>
      {menu.map((item, i) => (
        <div
          key={`menu_${i}`}
          id={`menu_${i}`}
          className={clsx(MenuBarStyle.navItems, {
            [MenuBarStyle.selected]: item.active,
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
              {item?.dropdown.map((option, i) => (
                <div key={`option_${i}`} className={MenuBarStyle.dropdownOption}>
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
