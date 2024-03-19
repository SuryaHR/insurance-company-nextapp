"use client";
import GenericButton from "@/components/common/GenericButton";
import topButtonStyle from "./top-button.module.scss";
import ClaimDetailsCardsComponent from "../ClaimDetailsCardsComponent";
import ContentListComponent from "../ContentListComponent";
import Modal from "@/components/common/ModalPopups";
import { useContext, useState } from "react";
import AdjusterListByCompany from "./AdjusterListByCompany";
import SupervisorReviewModal from "@/components/common/SupervisorReviewModal";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { updateReassignAdjusterRdcr } from "@/reducers/_adjuster_reducers/ClaimData/ClaimDetailsBtnSlice";
import CloseClaimModal from "./CloseClaimModal";
import DeleteClaimConfirmModal from "@/components/common/ConfirmModal";
import selectClaimNumber from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectClaimNumber";
import CustomLoader from "@/components/common/CustomLoader";
import { useRouter } from "next/navigation";
import { hardDelteClaim } from "@/services/_adjuster_services/ClaimService";
import selectClaimContentStatusValued from "@/reducers/_adjuster_reducers/ClaimData/Selectors/selectClaimContentStatusValued";
import selectPolicyInfo from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectPolicyInfo";
import selectCategories from "@/reducers/_adjuster_reducers/CommonData/Selectors/selectCategories";
import selectSubCategories from "@/reducers/_adjuster_reducers/CommonData/Selectors/selectSubCategories";
import { CalculateRCV, setItemLimitDetailsFromHOPolicyType } from "@/utils/calculateRCV";
import {
  getClaimSettlement,
  getclaimContents,
  updateCliamStatus,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import { addContents } from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";
import selectClaimStatus from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectClaimStatus";
import { CLAIM_STATUS } from "@/constants/constants";

type propTypes = {
  claimSnapShotData?: any;
  claimId: string;
  updateReassignAdjusterRdcr: any;
  claimNumber: any;
};

const ClaimDetailContentTopButtonsComponent: React.FC<connectorType & propTypes> = (
  props: propTypes & connectorType
) => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { claimId, valuedContentItem, policyInfo, categories, subCategories } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenSuperVisor, setIsModalOpenSuperVisor] = useState<boolean>(false);
  const [adjusterRowData, setAdjusterRowData] = useState<any>();
  const [isModalCloseClaim, setIsModalCloseClaim] = useState<boolean>(false);
  const [isModalConfirm, setIsModalConfirm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSupervisorModal = () => {
    setIsModalOpenSuperVisor((prevState) => !prevState);
  };

  const handleLoader = () => setShowLoader((prevState) => !prevState);
  const handleModalDeleleClaim = () => setIsModalConfirm((prevState) => !prevState);

  const handleReassignClaim = () => {
    openModal();
  };

  const handleSupervisorReview = () => {
    handleSupervisorModal();
  };
  const submitAdjusterModal = async () => {
    if (adjusterRowData) {
      const claimId = sessionStorage.getItem("claimId") || "";
      const apiRes = await props.updateReassignAdjusterRdcr({
        assignedUserId: adjusterRowData?.userId,
        claimId: claimId,
      });
      if (apiRes && apiRes.payload.status == 200) {
        dispatch(
          addNotification({
            message: apiRes?.payload?.message,
            id: "good",
            status: "success",
          })
        );
        closeModal();
      } else {
        dispatch(
          addNotification({
            message: apiRes?.payload?.errorMessage,
            id: "error",
            status: "error",
          })
        );
        closeModal();
      }
    }
  };
  const closeConfirmModal = () => setIsModalCloseClaim((prevState: any) => !prevState);

  const handleCloseClaim = () => {
    closeConfirmModal();
  };

  const handleDeleteClaim = () => {
    handleModalDeleleClaim();
  };

  const ModalFooter = () => {
    return (
      <div className={topButtonStyle?.modalBtnStyle}>
        <GenericButton label="Cancel" theme="linkBtn" onClickHandler={closeModal} />
        <GenericButton
          label="Submit"
          size="small"
          onClickHandler={submitAdjusterModal}
          disabled={!adjusterRowData}
        />
      </div>
    );
  };

  const calculateSettlementHandler = async () => {
    // console.log("valuedContentItem11", valuedContentItem);
    try {
      handleLoader();
      if (valuedContentItem?.length > 0) {
        const ItemDetilsArray = valuedContentItem?.map((item: any) => {
          const ItemDetails = { ...item };
          if (!item?.category?.name) {
            const othersCategory = categories?.find(
              (catItem: any) => catItem?.categoryName === "Others"
            );
            ItemDetails.category = {
              id: othersCategory.categoryId,
              name: othersCategory.categoryName,
            };
            if (!item?.subCategory?.name) {
              const othersSubCategory = subCategories?.find(
                (subItem: any) => subItem?.name === "Others"
              );
              ItemDetails.subCategory = othersSubCategory;
            }
          }
          setItemLimitDetailsFromHOPolicyType(ItemDetails, policyInfo);
          CalculateRCV(ItemDetails, subCategories);
          return ItemDetails;
        });
        const updateClaimStausPayload = {
          claimItems: ItemDetilsArray,
          reqForReCalculation: true,
        };
        const claimStatusRes = await updateCliamStatus(updateClaimStausPayload);
        const settlementRes = await getClaimSettlement(claimId, true);
        // console.log("settlementRes", settlementRes);

        const claimContentsRes = await getclaimContents({ claimId }, true);
        if (claimStatusRes?.status === 200) {
          if (settlementRes?.status === 200) {
            console.log("claimContentsRes", settlementRes);

            dispatch(
              addClaimContentListData({
                claimContentData: settlementRes,
                claimId,
              })
            );
            dispatch(
              addNotification({
                message: settlementRes?.message,
                id: "settlement_success",
                status: "success",
              })
            );
          } else {
            dispatch(
              addNotification({
                message: settlementRes?.message,
                id: "settlement_error",
                status: "error",
              })
            );
          }
          if (claimContentsRes?.status === 200) {
            if (claimContentsRes?.data) {
              dispatch(addContents(claimContentsRes?.data));
            }
          } else {
            dispatch(
              addNotification({
                message: claimContentsRes?.message,
                id: "claim_contents_error",
                status: "error",
              })
            );
          }
        } else {
          dispatch(
            addNotification({
              message: claimStatusRes?.message,
              id: "claim_status_error",
              status: "error",
            })
          );
        }
      } else {
        dispatch(
          addNotification({
            message: "There is no valued items for the calculate settlement",
            id: "no_valued_item",
            status: "warning",
          })
        );
      }
    } catch (err) {
      console.error("err", err);
    } finally {
      handleLoader();
    }
  };

  const buttonsArray = [
    {
      label: translate?.claimDetailsTabTranslate?.topOptionButtons?.calculateSettlement,
      clickHandler: calculateSettlementHandler,
    },
    {
      label: translate?.claimDetailsTabTranslate?.topOptionButtons?.reAssignClaim,
      clickHandler: handleReassignClaim,
    },
    {
      label: translate?.claimDetailsTabTranslate?.topOptionButtons?.supervisorReview,
      clickHandler: handleSupervisorReview,
      disabled: props.claimStatus?.id === CLAIM_STATUS[4]?.id,
    },
    {
      label: translate?.claimDetailsTabTranslate?.topOptionButtons?.closeClaim,
      clickHandler: handleCloseClaim,
      disabled: props.claimStatus?.id === CLAIM_STATUS[7]?.id,
    },
    {
      label: translate?.claimDetailsTabTranslate?.topOptionButtons?.deleteClaim,
      clickHandler: handleDeleteClaim,
    },
  ];
  const buttons =
    buttonsArray &&
    buttonsArray.map((buttonObj, i) => {
      return (
        <div key={i}>
          <GenericButton
            label={buttonObj.label}
            onClickHandler={buttonObj && buttonObj?.clickHandler}
            size="small"
            disabled={buttonObj?.disabled}
          />
        </div>
      );
    });

  const submitConfirmModalDeleteClaim = async () => {
    handleLoader();
    handleModalDeleleClaim();
    const param = { claimNumber: props?.claimNumber };
    const response = await hardDelteClaim(param);
    handleLoader();
    if (response?.status === 200) {
      dispatch(
        addNotification({
          message: response.message,
          id: "claim_delete_success",
          status: "success",
        })
      );
      router.push("/adjuster-dashboard");
    } else if (response?.status === 400) {
      dispatch(
        addNotification({
          message: response?.message,
          id: "claim_delete_error",
          status: "warning",
        })
      );
    } else {
      dispatch(
        addNotification({
          message: response?.errorMessage,
          id: "claim_delete_error",
          status: "error",
        })
      );
    }
  };

  return (
    <div>
      {showLoader && <CustomLoader />}

      <div className={topButtonStyle.buttonRowContainer}>{buttons}</div>
      <div className="row">
        <ClaimDetailsCardsComponent claimId={props.claimId} />
      </div>
      {/* {process.env.NEXT_PUBLIC_SERVICE_REQUESTS === "true" && (
        <div className="row">
          <div className="col-lg-12 col-md-12 col-12">
            <ServiceRequestsComponent />
          </div>
        </div>
      )} */}
      <div className="row">
        <div className="col-lg-12 col-md-12 col-12">
          <ContentListComponent claimId={props.claimId} />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        childComp={
          <div className={topButtonStyle.modalTableStyle}>
            <AdjusterListByCompany
              setAdjusterRowData={setAdjusterRowData}
              adjusterRowData={adjusterRowData}
              ModalFooter={ModalFooter}
            />
          </div>
        }
        headingName={"Select the Adjuster"}
        modalWidthClassName={topButtonStyle.modalWidth}
        animate
        positionTop
        roundedBorder
      ></Modal>
      <SupervisorReviewModal
        isOpen={isModalOpenSuperVisor}
        onClose={handleSupervisorModal}
        claimId={props.claimId}
      />
      <CloseClaimModal
        showConfirmation={isModalCloseClaim}
        closeConfirmModal={closeConfirmModal}
        claimId={props.claimId}
      />
      <DeleteClaimConfirmModal
        showConfirmation={isModalConfirm}
        closeHandler={handleModalDeleleClaim}
        submitBtnText="Yes"
        closeBtnText="No"
        childComp={`Are you sure want to delete claim# ${props?.claimNumber} ? `}
        modalHeading="Delete Claim"
        submitHandler={submitConfirmModalDeleteClaim}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  claimSnapShotData: state?.claimDetail?.contents,
  claimNumber: selectClaimNumber(state),
  valuedContentItem: selectClaimContentStatusValued(state),
  policyInfo: selectPolicyInfo(state),
  categories: selectCategories(state),
  subCategories: selectSubCategories(state),
  claimStatus: selectClaimStatus(state),
});

const mapDispatchToProps = {
  updateReassignAdjusterRdcr,
  addNotification,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ClaimDetailContentTopButtonsComponent);
