"use client";
import React, { useContext, useState } from "react";
import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import CliamsGlobalSearchTab from "./CliamsGlobalSearchTab";
import { RiSearch2Line } from "react-icons/ri";
import styles from "./GlobalSearchStyle.module.scss";
import DocumentsGlobalSearchTab from "./DocumentsGlobalSearchTab";
import { adjusterGlobalSearchTranslatePropsType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-global-search/page";

import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import selectGlobalSearchCount from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectGlobalSearchCount";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectSearchText from "@/reducers/_adjuster_reducers/GlobalSearch/selectors/selectSearchText";
import InvoicesGlobalSearchTab from "./InvoicesGlobalSearchTab";
import VendorGlobalSearchTab from "./VendorGlobalSearchTab";
import PeopleGlobalSearchTab from "./PeopleGlobalSearchTab";

const GlobalSearchTabsComponent = () => {
  const searchCount = useAppSelector(selectGlobalSearchCount);

  const searchText = useAppSelector(selectSearchText);

  const [localSearch, setLocalSearch] = useState("");
  const { translate } =
    useContext<TranslateContextData<adjusterGlobalSearchTranslatePropsType>>(
      TranslateContext
    );

  const tabsArray = [
    {
      name: `${translate?.adjusterGlobalSearchTranslate?.claims?.tabName} (${searchCount?.claims})`,
      content: (
        <CliamsGlobalSearchTab searchText={searchText} localSearch={localSearch} />
      ),
    },
    {
      name: `${translate?.adjusterGlobalSearchTranslate?.people?.tabName} (${searchCount.persons})`,
      content: (
        <PeopleGlobalSearchTab searchText={searchText} localSearch={localSearch} />
      ),
    },
    {
      name: `${translate?.adjusterGlobalSearchTranslate?.documents?.tabName} (${searchCount.documents})`,
      content: (
        <DocumentsGlobalSearchTab searchText={searchText} localSearch={localSearch} />
      ),
    },
    {
      name: `${translate?.adjusterGlobalSearchTranslate?.invoice?.tabName} (${searchCount.invoices})`,
      content: (
        <InvoicesGlobalSearchTab searchText={searchText} localSearch={localSearch} />
      ),
    },
    {
      name: `${translate?.adjusterGlobalSearchTranslate?.suppliers?.tabName} (${searchCount.vendors})`,
      content: (
        <VendorGlobalSearchTab searchText={searchText} localSearch={localSearch} />
      ),
    },
  ];

  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-4">
          <div className={styles.searchBox}>
            <RiSearch2Line className={styles.searchIcon} />
            <input
              type="text"
              placeholder={translate?.adjusterGlobalSearchTranslate?.search ?? ""}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <TabsButtonComponent tabData={tabsArray} />
    </div>
  );
};
export default GlobalSearchTabsComponent;
