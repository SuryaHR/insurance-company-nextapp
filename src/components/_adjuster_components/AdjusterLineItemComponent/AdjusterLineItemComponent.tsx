"use client";
import React, { useContext, useEffect, useRef } from "react";
import PaginationButtons from "@/components/_adjuster_components/AdjusterLineItemComponent/PaginationButtons";
import lineItemComponentStyle from "./adjusterLineItemComponent.module.scss";
import GenericComponentHeading from "../../common/GenericComponentHeading";
import TabsButtonComponent from "../../common/TabsButtonComponent";
import LineItemDetailComponent from "./LineItemDetailComponent";
import { useParams } from "next/navigation";
import Loading from "@/app/[lang]/loading";
import GenericBreadcrumb from "../../common/GenericBreadcrumb";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchCondition,
  fetchLineItemCatergory,
  fetchLineItemDetail,
  fetchRetailersDetails,
  saveComparable,
  searchComparableAbortController,
} from "@/reducers/_adjuster_reducers/LineItemDetail/LineItemThunkService";
import clsx from "clsx";
import { fetchClaimContentAction } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import RapidItemSection from "./RapidItemSection";
import selectClaimContentItemIdList from "@/reducers/_adjuster_reducers/ClaimData/Selectors/selectClaimContentItemIdList";
import { LineItemContext } from "./LineItemContext";
import ConversationModal from "../../common/ConversationModal";
import Image from "next/image";
import pdfImg from "@/assets/images/msgIcon.png";
import { selectPolicyHolder } from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectPolicyHolder";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { lineItemTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-line-item-detail/[claimId]/[itemId]/page";

export interface saveInterface {
  acceptedStandardCost?: boolean;
}

const AdjusterLineItemComponent: React.FC<connectorType> = (props) => {
  const {
    isLoading,
    lineItem,
    claimData = [],
    fetchLineItemDetail,
    fetchClaimContentAction,
    fetchLineItemCatergory,
    fetchCondition,
    fetchRetailersDetails,
    isFetching = false,
    pageDetail,
    policyHolder,
  } = props;
  const { itemId, claimId } = useParams();
  const [coversationModelOpen, setCoversationModelOpen] = React.useState(false);

  const { inView, showLoader, handleDataSaveUpdate, handleItemReplace } =
    useContext(LineItemContext);

  const handleConversationModalClose = () => {
    setCoversationModelOpen(false);
  };

  const { translate } =
    useContext<TranslateContextData<lineItemTranslatePropType>>(TranslateContext);

  const tabData = [
    {
      name: "Item Details",
      content: <LineItemDetailComponent />,
    },
  ];
  const pathList = [
    {
      name: translate?.breadCrumbTranslate?.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: lineItem?.claimNumber,
      path: `/adjuster-property-claim-details/${lineItem?.claimId}`,
    },
    {
      name: lineItem?.itemNumber,
      active: true,
      path: "",
    },
  ];

  const isInit = useRef(false);

  useEffect(() => {
    if (!isInit.current) {
      fetchLineItemDetail({ itemId: +itemId, refresh: true });
      if (!pageDetail.length) {
        fetchClaimContentAction({ claimId: claimId.toString() });
      }
      fetchLineItemCatergory();
      fetchCondition();
      fetchRetailersDetails();
      isInit.current = true;
    }

    return () => {
      if (searchComparableAbortController) {
        searchComparableAbortController.abort();
      }
    };
  }, [
    isInit,
    fetchLineItemDetail,
    fetchClaimContentAction,
    itemId,
    claimId,
    fetchLineItemCatergory,
    fetchCondition,
    fetchRetailersDetails,
    pageDetail,
  ]);

  if (isLoading && !(claimData.length > 0)) {
    return <Loading />;
  }

  return (
    <div className={lineItemComponentStyle.root}>
      {(isFetching || showLoader) && <Loading />}
      <div className={lineItemComponentStyle.stickyContainer}>
        <GenericBreadcrumb
          dataList={pathList}
          customClassname={lineItemComponentStyle.breadcrumb}
          customNavClassname={lineItemComponentStyle.customNav}
        />
        {claimData?.length > 1 && (
          <div className={lineItemComponentStyle.paginationButtonsContainer}>
            <PaginationButtons
              pageId={lineItem?.id}
              totalPage={pageDetail}
              handlePageChange={(itemId: number) => {
                history.pushState(
                  "",
                  "",
                  `/adjuster-line-item-detail/${claimId}/${itemId}`
                );
                fetchLineItemDetail({
                  itemId: +itemId,
                  clbk: () => {
                    handleDataSaveUpdate && handleDataSaveUpdate();
                    handleItemReplace();
                  },
                });
                // router.push(`/adjuster-line-item-detail/${claimId}/${itemId}`);
              }}
              showArrowBtn={!inView && isInit.current}
            />
          </div>
        )}
        <GenericComponentHeading
          customTitleClassname={lineItemComponentStyle.headingTitle}
          title={`Item# ${lineItem?.itemNumber ?? ""}${
            policyHolder?.lastName ? `- ${policyHolder?.lastName}` : ""
          }${policyHolder?.firstName ? `, ${policyHolder?.firstName}` : ""}`}
          customHeadingClassname={clsx(lineItemComponentStyle.heading, {
            [lineItemComponentStyle.noPageHeading]: claimData.length < 2,
          })}
        />
        {!inView && isInit.current && <RapidItemSection />}
      </div>
      <div>
        <TabsButtonComponent showBorders={true} tabData={tabData} />
      </div>
      <div>
        {coversationModelOpen && lineItem && (
          <ConversationModal
            isOpen={coversationModelOpen}
            onClose={handleConversationModalClose}
            itemRowData={lineItem}
          />
        )}
        <div
          className={lineItemComponentStyle.stickyConversation}
          onClick={() => setCoversationModelOpen(true)}
        >
          <Image alt="convarsation" src={pdfImg} width={40} height={40} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isLoading: state[EnumStoreSlice.LINE_ITEM_DETAIL].isLoading,
  isFetching: state[EnumStoreSlice.LINE_ITEM_DETAIL]?.isFetching,
  lineItem: state[EnumStoreSlice.LINE_ITEM_DETAIL].lineItem,
  claimData: state.claimContentdata?.claimContentListData,
  pageDetail: selectClaimContentItemIdList(state),
  policyHolder: selectPolicyHolder(state),
});

const mapDispatchToProps = {
  fetchLineItemDetail,
  fetchClaimContentAction,
  fetchLineItemCatergory,
  fetchCondition,
  fetchRetailersDetails,
  saveComparable,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AdjusterLineItemComponent);
