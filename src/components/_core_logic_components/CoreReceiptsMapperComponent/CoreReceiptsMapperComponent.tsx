"use client";
import React, { useEffect } from "react";
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
import { getCategories } from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/store/store";
import selectSessionClaimNumber from "@/reducers/Session/Selectors/selectSessionClaimNumber";
import selectClaimNumberEncrypted from "@/reducers/Session/Selectors/selectClaimNumberEncrypted";

type propTypes = {
  claimId: string;
};
const CoreReceiptsMapperComponent: React.FC<connectorType & propTypes> = ({
  token,
  claimNumber,
  claimNumberEncrypted,
}) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const categoryListRes: any = getCategories(token);

    if (Array.isArray(categoryListRes?.data)) {
      dispatch(addCategories(categoryListRes?.data));
    }
  }, [dispatch, token]);

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
      name: claimNumber,
      path: `/core-logic/core-adjuster-property-claim-details/${claimNumberEncrypted}`,
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

const mapStateToProps = (state: RootState) => ({
  token: selectAccessToken(state),
  claimNumber: selectSessionClaimNumber(state),
  claimNumberEncrypted: selectClaimNumberEncrypted(state),
});
const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;

export default connector(CoreReceiptsMapperComponent);
