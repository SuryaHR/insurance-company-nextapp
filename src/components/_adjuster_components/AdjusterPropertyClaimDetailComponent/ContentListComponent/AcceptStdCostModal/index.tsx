import React from "react";
import Modal from "@/components/common/ModalPopups";
import ContentListComponentStyle from "../ContentListComponent.module.scss";
import { RootState } from "@/store/store";
import { connect } from "react-redux";
import selectCRN from "@/reducers/Session/Selectors/selectCRN";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import GenericButton from "@/components/common/GenericButton";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { ITEM_STATUS } from "@/constants/constants";
import {
  getClaimSettlement,
  getclaimContents,
  updateCliamStatus,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { claimContentList } from "@/services/_adjuster_services/ClaimContentListService";
import { addMessageList } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addContents } from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";

function AcceptStdCostModal(props: any) {
  const {
    isOpen,
    onClose,
    handleLoader,
    msgAcceptStandardCost,
    acceptStandardCostItem,
    claimId,
  } = props;

  const dispatch = useAppDispatch();

  const changeStatus = async (itemStatus: any) => {
    onClose();
    handleLoader();
    const param = {
      claimItems: acceptStandardCostItem,
      itemStatus: itemStatus,
    };
    const resResult = await updateCliamStatus(param);
    handleLoader();
    if (resResult?.status === 200) {
      await getClaimSettlement(claimId, true);
      const claimContentsRes = await getclaimContents({ claimId }, true);

      if (claimContentsRes?.status === 200) {
        dispatch(addContents(claimContentsRes?.data));
      }
      const claimContentListRes = await claimContentList({ claimId }, true);
      if (claimContentListRes) {
        props.addClaimContentListData({ claimContentData: claimContentListRes, claimId });
        props.addNotification({
          message: resResult.message,
          id: "mark_status_change_success",
          status: "success",
        });
      }
    } else {
      props.addNotification({
        message: resResult.errorMessage,
        id: "mark_status_change_failure",
        status: "error",
      });
    }
  };

  const FooterCompAcceptStdCost = () => {
    return (
      <div className={ContentListComponentStyle.modalWidth}>
        <div className="d-flex justify-content-end align-items-center">
          <GenericButton
            label="No"
            size="small"
            theme="linkBtn"
            btnClassname={`${ContentListComponentStyle.footBtn} me-3 `}
            onClick={onClose}
          />
          <GenericButton
            label="Yes"
            type="submit"
            size="small"
            btnClassname={ContentListComponentStyle.footBtn}
            onClick={() => {
              changeStatus(ITEM_STATUS.valued);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      headingName="Accept Standard Costs"
      isOpen={isOpen}
      onClose={() => onClose()}
      modalWidthClassName={ContentListComponentStyle.modalContent}
      childComp={
        <div className={ContentListComponentStyle.addItemContainer}>
          <div className={ContentListComponentStyle.modalLabel}>
            {msgAcceptStandardCost}
          </div>
        </div>
      }
      footerContent={<FooterCompAcceptStdCost />}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  claimDetail: state?.claimDetail && state?.claimDetail?.contents,
  category: state?.commonData?.category || [],
  subCategory: state?.commonData?.subCategory || [],
  participants: state?.claimDetail?.participants || [],
  CRN: selectCRN(state),
});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
  addMessageList,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AcceptStdCostModal);
