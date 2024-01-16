"use client";
import React, { useEffect, useRef } from "react";
import PaginationButtons from "@/components/AdjusterLineItemComponent/PaginationButtons";
import lineItemComponentStyle from "./adjusterLineItemComponent.module.scss";
import GenericComponentHeading from "../common/GenericComponentHeading";
import TabsButtonComponent from "../common/TabsButtonComponent";
import LineItemDetailComponent from "./LineItemDetailComponent";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/app/[lang]/loading";
import GenericBreadcrumb from "../common/GenericBreadcrumb";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchCondition,
  fetchLineItemCatergory,
  fetchLineItemDetail,
  fetchRetailersDetails,
} from "@/reducers/LineItemDetail/LineItemThunkService";
import clsx from "clsx";
import { fetchClaimContentAction } from "@/reducers/ClaimData/ClaimContentSlice";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { useInView } from "react-intersection-observer";
import RapidItemSection from "./RapidItemSection";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import useTranslation from "@/hooks/useTranslation";
import selectClaimContentItemIdList from "@/reducers/ClaimData/Selectors/selectClaimContentItemIdList";

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
  } = props;
  const router = useRouter();
  const { itemId, claimId } = useParams();
  const { ref, inView } = useInView({
    threshold: 0,
    // rootMargin: "200px",
  });

  const { translate }: { translate: claimDetailsTabTranslateType | undefined } =
    useTranslation("claimDetailsTabTranslate");

  const tabData = [
    {
      name: "Item Details",
      content: <LineItemDetailComponent rapidDivRef={ref} />,
    },
  ];
  const pathList = [
    {
      name: translate?.breadCrumbsHeading?.home,
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

  // const [currentPage, setCurrentPage] = useState(lineItem?.itemNumber);

  const isInit = useRef(false);

  useEffect(() => {
    if (!isInit.current) {
      fetchLineItemDetail({ itemId: +itemId });
      if (!pageDetail.length) {
        fetchClaimContentAction({ claimId: claimId.toString() });
      }
      fetchLineItemCatergory();
      fetchCondition();
      fetchRetailersDetails();
      isInit.current = true;
    }

    // return () => {
    //   resetLineItemDetail();
    // };
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
      {isFetching && <Loading />}
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
                router.replace(`/adjuster-line-item-detail/${claimId}/${itemId}`);
              }}
              showArrowBtn={!inView && isInit.current}
            />
          </div>
        )}
        <GenericComponentHeading
          customTitleClassname={lineItemComponentStyle.headingTitle}
          title="Item# 6 - Smith, Gracie"
          customHeadingClassname={clsx(lineItemComponentStyle.heading, {
            [lineItemComponentStyle.noPageHeading]: claimData.length < 2,
          })}
        />
        {!inView && isInit.current && <RapidItemSection />}
      </div>
      <div>
        <TabsButtonComponent showBorders={true} tabData={tabData} />
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
});

const mapDispatchToProps = {
  fetchLineItemDetail,
  fetchClaimContentAction,
  fetchLineItemCatergory,
  fetchCondition,
  fetchRetailersDetails,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AdjusterLineItemComponent);
