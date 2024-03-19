"use client";
import React, { useState } from "react";
import TabsButtonStyle from "./TabsButtonComponent.module.scss";
import clsx from "clsx";

type Tab = {
  name: string | any;
  content: React.ReactNode;
  className?: string;
  [key: string]: any;
};

type TabsProps = {
  tabData: Tab[];
  showBorders?: boolean;
  clickable?: boolean;
};

const TabsButtonComponent = ({
  tabData,
  showBorders = true,
  clickable = false,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className={TabsButtonStyle.tabContainer}>
      <div className="col-md-12 col-sm-12 col-12">
        <div
          className={clsx(
            TabsButtonStyle.tabList,
            { [TabsButtonStyle.withBorders]: showBorders },
            { [TabsButtonStyle.withoutBorders]: !showBorders }
          )}
        >
          {tabData.map((tab, index) => (
            <div
              key={index}
              className={clsx(
                TabsButtonStyle.tab,
                { [TabsButtonStyle.active]: activeTab === index },
                tab?.className
              )}
              id={tab?.name?.replace(/\s/g, "").toLowerCase()}
              onClick={() => {
                if (clickable) {
                  handleTabClick(index);
                  tab.clickHandler(index + 1);
                } else {
                  handleTabClick(index);
                }
              }}
            >
              {tab.name}
            </div>
          ))}
        </div>
        <div className={TabsButtonStyle.tabContent}>{tabData[activeTab].content}</div>
      </div>
    </div>
  );
};

export default TabsButtonComponent;
