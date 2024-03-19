"use client";
import GenericBreadcrumb from "../../common/GenericBreadcrumb";
import claimDetailStyle from "./adjuster-property-claim-detail.module.scss";
import GenericComponentHeading from "../../common/GenericComponentHeading";
import ClaimDetailTabsComponent from "./ClaimDetailTabsComponent";
import {
  addCompanyDetails,
  addContents,
  addPolicyInfo,
  addRoomType,
} from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { ConnectedProps, connect, useDispatch } from "react-redux";
import selectClaimNumber from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectClaimNumber";
import { RootState } from "@/store/store";
import selectPolicyHolderFirstName from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectPolicyHolderFirstName";
import selectPolicyHolderLastName from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectPolicyHolderLastName";
import Loading from "@/app/[lang]/loading";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectCompanyId from "@/reducers/Session/Selectors/selectCompanyId";
import {
  getClaimPolicyInfo,
  getClaimRoomTypeData,
  getClaimSettlement,
  getCompanyDetails,
  getclaimContents,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { claimContentList } from "@/services/_adjuster_services/ClaimContentListService";
import { serviceRequestList } from "@/services/_adjuster_services/ClaimServiceRequestListService";
import {
  getCategories,
  getClaimDetailMessageList,
  getClaimItemCondition,
  getClaimItemRetailers,
  getClaimItemRoom,
  getClaimParticipantsList,
  getPendingTaskList,
  getSubCategories,
} from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import { PAGINATION_LIMIT_10 } from "@/constants/constants";
import {
  addCategories,
  addCondition,
  addMessageList,
  addParticipants,
  addPendingTasks,
  addRetailer,
  addRoom,
  addSubcategories,
} from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { addserviceRequestData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimServiceRequestSlice";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import CustomLoader from "../../common/CustomLoader";
import selectReferer from "@/reducers/Session/Selectors/selectReferer";

type propsTypes = {
  claimId: string;
};

const AdjusterPropertyClaimDetailComponent: React.FC<connectorType & propsTypes> = ({
  claimId,
  claimNumber,
  firstName,
  lastName,
  referer,
}) => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const companyId = useAppSelector(selectCompanyId);
  useEffect(() => {
    const payload = {
      claimId: claimId,
    };
    sessionStorage.setItem("redirectToNewClaimPage", "false");
    const init = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getClaimSettlement(claimId, true),
          getCompanyDetails(companyId).then((companyDetailsRes) => {
            if (companyDetailsRes?.data) {
              dispatch(addCompanyDetails(companyDetailsRes));
            }
          }),
          getCategories(true).then((categoryListRes) => {
            if (Array.isArray(categoryListRes?.data)) {
              dispatch(addCategories(categoryListRes?.data));
            }
          }),
          getSubCategories({ categoryId: null }, true).then((subcategoryListRes) => {
            if (Array.isArray(subcategoryListRes?.data)) {
              dispatch(addSubcategories(subcategoryListRes?.data));
            }
          }),
          getPendingTaskList(payload, true).then((pendingTaskListRes) => {
            if (Array.isArray(pendingTaskListRes?.data)) {
              dispatch(addPendingTasks(pendingTaskListRes?.data));
            } else {
              dispatch(addPendingTasks([]));
            }
          }),
          serviceRequestList(payload, true).then((serviceRequestListRes) => {
            dispatch(
              addserviceRequestData({ claimServiceRequestList: serviceRequestListRes })
            );
          }),
          claimContentList(payload, true).then((claimContentListRes) => {
            dispatch(
              addClaimContentListData({
                claimContentData: claimContentListRes,
                claimId,
              })
            );
          }),
          getClaimParticipantsList(payload, true).then((claimParticipantsRes) => {
            if (Array.isArray(claimParticipantsRes?.data)) {
              dispatch(addParticipants(claimParticipantsRes?.data));
            } else {
              dispatch(addParticipants([]));
            }
          }),
          getclaimContents(payload, true).then((claimContentsRes) => {
            if (claimContentsRes?.data) {
              dispatch(addContents(claimContentsRes?.data));
            }
          }),
          getClaimPolicyInfo(payload, true).then((policyInfoRes) => {
            if (policyInfoRes?.data) {
              dispatch(addPolicyInfo(policyInfoRes?.data));
            }
          }),
          getClaimDetailMessageList(
            {
              pageNo: 1,
              recordPerPage: PAGINATION_LIMIT_10,
              claimId,
            },
            true
          ).then((claimDetailMessageListRes) => {
            if (Array.isArray(claimDetailMessageListRes?.data?.messages)) {
              dispatch(addMessageList(claimDetailMessageListRes?.data?.messages));
            } else {
              dispatch(addMessageList([]));
            }
          }),
          getClaimItemCondition(true).then((claimContitionRes) => {
            dispatch(addCondition(claimContitionRes?.data));
          }),
          getClaimItemRetailers(true).then((claimRetailerRes) => {
            dispatch(addRetailer(claimRetailerRes?.data?.retailers));
          }),
          getClaimItemRoom(claimId, true).then((claimRoomRes) => {
            dispatch(addRoom(claimRoomRes?.data));
          }),
          getClaimRoomTypeData(true).then((claimRoomTypeRes) => {
            dispatch(addRoomType(claimRoomTypeRes));
          }),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [claimId, companyId, dispatch]);

  const pathList = useMemo(() => {
    const _path = [];
    _path.push({
      name: translate?.breadCrumbTranslate?.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
    });
    if (referer === "search") {
      _path.push({
        name: "Search Results",
        path: "/adjuster-global-search",
      });
    }
    _path.push({
      name: `${claimNumber}`,
      path: "",
      active: true,
    });
    return _path;
  }, [referer, translate?.breadCrumbTranslate, claimNumber]);

  if (!isLoading) {
    return (
      <div className="row">
        <Suspense fallback={<Loading />}>
          <div className={claimDetailStyle.stickyContainer}>
            <GenericBreadcrumb dataList={pathList} />
            <GenericComponentHeading
              customHeadingClassname={claimDetailStyle.headingContainer}
              customTitleClassname={claimDetailStyle.headingTxt}
              title={`${translate?.breadCrumbTranslate?.breadCrumbsHeading?.claim} ${claimNumber} - ${lastName}, ${firstName}`}
            />
          </div>
        </Suspense>
        <div>
          <ClaimDetailTabsComponent claimId={claimId} />
        </div>
      </div>
    );
  }
  return <CustomLoader />;
};

const mapStateToProps = (state: RootState) => ({
  claimNumber: selectClaimNumber(state),
  firstName: selectPolicyHolderFirstName(state),
  lastName: selectPolicyHolderLastName(state),
  referer: selectReferer(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AdjusterPropertyClaimDetailComponent);
