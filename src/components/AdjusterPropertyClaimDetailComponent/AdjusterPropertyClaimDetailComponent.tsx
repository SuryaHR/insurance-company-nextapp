"use client";
import CustomLoader from "../common/CustomLoader/index";
import GenericBreadcrumb from "../common/GenericBreadcrumb";
import claimDetailStyle from "./adjuster-property-claim-detail.module.scss";
import GenericComponentHeading from "../common/GenericComponentHeading";
import ClaimDetailTabsComponent from "./ClaimDetailTabsComponent";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import {
  addCategories,
  addMessageList,
  addPendingTasks,
  addSubcategories,
  addCondition,
  addRetailer,
  addRoom,
  addRoomType,
  addParticipants,
  addContents,
  addPolicyInfo,
  addCompanyDetails,
} from "@/reducers/ClaimDetail/ClaimDetailSlice";
import { Suspense, useEffect } from "react";
import selectCompanyId from "@/reducers/Session/Selectors/selectCompanyId";
import { getCompanyDetails } from "@/services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { ConnectedProps, connect } from "react-redux";
import selectClaimNumber from "@/reducers/ClaimDetail/Selectors/selectClaimNumber";
import { RootState } from "@/store/store";
import selectPolicyHolderFirstName from "@/reducers/ClaimDetail/Selectors/selectPolicyHolderFirstName";
import selectPolicyHolderLastName from "@/reducers/ClaimDetail/Selectors/selectPolicyHolderLastName";
import Loading from "@/app/[lang]/loading";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import useTranslation from "@/hooks/useTranslation";

type propsTypes = {
  claimId: string;
  claimContentListRes: any;
  serviceRequestListRes: any;
  categoryListRes: any;
  subcategoryListRes: any;
  pendingTaskListRes: any;
  claimDetailMessageListRes: any;
  claimContitionRes: any;
  claimRetailerRes: any;
  claimRoomRes: any;
  claimRoomTypeRes: any;
  claimParticipantsRes: any;
  claimContentsRes: any;
  policyInfoRes: any;
};

const AdjusterPropertyClaimDetailComponent: React.FC<connectorType & propsTypes> = ({
  claimId,
  claimContentListRes,
  serviceRequestListRes,
  categoryListRes,
  subcategoryListRes,
  pendingTaskListRes,
  claimDetailMessageListRes,
  claimContitionRes,
  claimRetailerRes,
  claimRoomRes,
  claimRoomTypeRes,
  claimParticipantsRes,
  claimContentsRes,
  policyInfoRes,
  claimNumber,
  firstName,
  lastName,
}) => {
  const dispatch = useAppDispatch();
  const companyId = useAppSelector(selectCompanyId);
  if (Array.isArray(categoryListRes?.data)) {
    dispatch(addCategories(categoryListRes?.data));
  }
  if (Array.isArray(subcategoryListRes?.data)) {
    dispatch(addSubcategories(subcategoryListRes?.data));
  }
  if (Array.isArray(pendingTaskListRes?.data)) {
    dispatch(addPendingTasks(pendingTaskListRes?.data));
  } else {
    dispatch(addPendingTasks([]));
  }
  if (Array.isArray(claimDetailMessageListRes?.data?.messages)) {
    dispatch(addMessageList(claimDetailMessageListRes?.data?.messages));
  } else {
    dispatch(addMessageList([]));
  }
  if (Array.isArray(claimParticipantsRes?.data)) {
    dispatch(addParticipants(claimParticipantsRes?.data));
  } else {
    dispatch(addParticipants([]));
  }
  if (claimContentsRes?.data) {
    dispatch(addContents(claimContentsRes?.data));
  }
  if (policyInfoRes?.data) {
    dispatch(addPolicyInfo(policyInfoRes?.data));
  }
  dispatch(addCondition(claimContitionRes?.data));
  dispatch(addRetailer(claimRetailerRes?.data?.retailers));
  dispatch(addRoom(claimRoomRes?.data));
  dispatch(addRoomType(claimRoomTypeRes));

  const { translate }: { translate: claimDetailsTabTranslateType | undefined } =
    useTranslation("claimDetailsTabTranslate");

  const pathList = [
    {
      name: translate?.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: `${claimNumber}`,
      path: "/adjuster-property-claim-details",
      active: true,
    },
  ];

  useEffect(() => {
    sessionStorage.setItem("redirectToNewClaimPage", "false");
    const getCompanyDetailInit = async () => {
      if (companyId) {
        const companyDetailsRes: any = await getCompanyDetails(companyId);
        if (companyDetailsRes?.data) {
          dispatch(addCompanyDetails(companyDetailsRes));
        }
      }
    };
    getCompanyDetailInit();
  }, [companyId, dispatch]);

  if (claimContentListRes?.status === 200 && serviceRequestListRes?.status === 200) {
    return (
      <div className="row">
        <Suspense fallback={<Loading />}>
          <div className={claimDetailStyle.stickyContainer}>
            <GenericBreadcrumb dataList={pathList} />
            <GenericComponentHeading
              customHeadingClassname={claimDetailStyle.headingContainer}
              customTitleClassname={claimDetailStyle.headingTxt}
              title={`${translate?.breadCrumbsHeading?.claim} ${claimNumber} - ${lastName}, ${firstName}`}
            />
          </div>
        </Suspense>
        <div>
          <ClaimDetailTabsComponent
            serviceRequestListRes={serviceRequestListRes}
            claimContentListRes={claimContentListRes}
            claimId={claimId}
          />
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
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AdjusterPropertyClaimDetailComponent);
