"use client";
import React, { useEffect, useState } from "react";
import receiptMapperStyle from "./receiptMapperComponent.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import ClaimedItemsComponent from "./ClaimedItemsComponent/ClaimedItemsComponent";
import SummaryComponent from "./SummaryComponent/SummaryComponent";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addCategories } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";

type propTypes = {
  claimId: string;
  categoryListRes: any;
};
const ReceiptsMapperComponent: React.FC<propTypes> = ({
  claimId,
  categoryListRes,
}: propTypes) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const [claimNumber, setClaimNumber] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Array.isArray(categoryListRes?.data)) {
      dispatch(addCategories(categoryListRes?.data));
    }
    try {
      setClaimNumber(sessionStorage.getItem("claimNumber") ?? "");
    } catch (error) {
      setClaimNumber("");
    }
  }, [categoryListRes?.data, dispatch]);

  const tabData = [
    {
      name: translate?.receiptMapperTranslate?.claimedItems?.claimedItemsHeading,
      content: <ClaimedItemsComponent />,
    },
    {
      name: translate?.receiptMapperTranslate?.summary?.summaryHeading,
      content: <SummaryComponent />,
    },
  ];
  const pathList = [
    {
      name: translate?.receiptMapperTranslate?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: claimNumber,
      path: `/adjuster-property-claim-details/${claimId}`,
    },
    {
      name: translate?.receiptMapperTranslate?.receiptMapper,
      active: true,
      path: "",
    },
  ];

  return (
    <div className="row">
      <div className={receiptMapperStyle.stickyContainer}>
        <GenericBreadcrumb
          dataList={pathList}
          customClassname={receiptMapperStyle.breadcrumb}
          customNavClassname={receiptMapperStyle.customNav}
        />

        <GenericComponentHeading
          customTitleClassname={receiptMapperStyle.headingTitle}
          title={translate?.receiptMapperTranslate?.receiptMapperHeading}
        />
      </div>
      <div className={receiptMapperStyle.tabComponentMargin}>
        <TabsButtonComponent tabData={tabData} showBorders={true} />
      </div>
    </div>
  );
};

export default ReceiptsMapperComponent;
