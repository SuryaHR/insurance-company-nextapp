import React, { useState } from "react";
import Modal from "@/components/common/ModalPopups";
import { RootState } from "@/store/store";
import { capitalize } from "@/utils/helper";
import AddNewMsgModalComponent from "@/components/common/AddNewMessageModalComponent";
import {
  getclaimContents,
  updateUnderReview,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { claimContentList } from "@/services/_adjuster_services/ClaimContentListService";
import { PAGINATION_LIMIT_10 } from "@/constants/constants";
import { connect } from "react-redux";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import selectCRN from "@/reducers/Session/Selectors/selectCRN";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import { addMessageList } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import {
  addMessage,
  getClaimDetailMessageList,
} from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import style from "./supervisorModaStyle.module.scss";
import CustomLoader from "../CustomLoader";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addContents } from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";

function SupervisorReviewModal(props: any) {
  const { isOpen, onClose, claimId, isNotUnderReviewSelected, reviewType } = props;

  const dispatch = useAppDispatch();

  const userId = props?.policyInfo?.insuraceAccountDetails?.adjuster?.userId;

  const [showLoader, setShowLoader] = useState(false);

  const handleLoader = () => {
    setShowLoader((prevState) => !prevState);
  };

  const participantsList =
    props.participants &&
    props.participants.length > 0 &&
    props.participants
      .filter((item: any) => item.id != userId)
      .map((item: any) => {
        const companyName = item?.companyDTO?.companyName || "";
        return {
          label: `${item?.firstName} ${item?.lastName} (${companyName}${capitalize(
            item?.role
          )})`,
          value: JSON.stringify({ item }),
        };
      });

  const preSelectedParticipant =
    participantsList &&
    participantsList.filter((item: any) => {
      const value = JSON.parse(item.value);
      return value?.item?.role === "CLAIM SUPERVISOR";
    });

  const fecthMessageList = async () => {
    const payloadData = {
      pageNo: 1,
      recordPerPage: PAGINATION_LIMIT_10,
      claimId,
    };
    const claimDetailMessageListRes = await getClaimDetailMessageList(payloadData, true);
    if (claimDetailMessageListRes?.data !== null) {
      props.addMessageList(claimDetailMessageListRes?.data?.messages);
    } else {
      props.addMessageList([]);
    }
  };

  const constructFormData = (data: any) => {
    const participantsdetails = data?.participants.map((participant: any) => {
      const prsedObj = JSON.parse(participant?.value);
      return {
        participantId: prsedObj?.item?.participantId,
        email: prsedObj?.item?.emailId,
        participantType: { ...prsedObj?.item?.participantType },
      };
    });

    const payload = {
      claimId: claimId,
      claimNumber: props?.claimDetail?.claimNumber,
      sender: props.CRN,
      itemUID: null,
      serviceRequestNumber: null,
      isPublicNote: false,
      message: data?.message,
      isInternal: true,
      registrationNumber: null,
      groupDetails: {
        groupId: null,
        groupTitle: "Supervisor Review",
        participants: participantsdetails,
      },
    };
    const formData = new FormData();
    let mediaFileDetailsArray: any = [];
    if (data?.files.length > 0) {
      data?.files?.map((fileObj: any) => {
        const newObj = {
          fileName: fileObj?.name,
          fileType: fileObj?.type,
          extension: fileObj?.name.substr(fileObj?.name.lastIndexOf(".")),
          filePurpose: "Note",
          latitude: null,
          longitude: null,
        };
        mediaFileDetailsArray.push(newObj);
        formData.append("file", fileObj);
      });
    } else {
      formData.append("file", "null");
      mediaFileDetailsArray = null;
    }
    formData.append("mediaFilesDetail", JSON.stringify(mediaFileDetailsArray));
    formData.append("noteDetail", JSON.stringify(payload));

    return formData;
  };

  const handleMessageSubmit = async (data: any) => {
    onClose();
    handleLoader();
    const formData = constructFormData(data);
    const addMessageResp = await addMessage(formData);
    await fecthMessageList();
    if (addMessageResp?.status === 200) {
      const items =
        (reviewType === "ITEMS" &&
          isNotUnderReviewSelected &&
          isNotUnderReviewSelected.map((item: any) => {
            return { itemId: item.id };
          })) ||
        [];

      const payload = {
        claimNumber: props?.claimDetail?.claimNumber,
        items: reviewType && reviewType === "ITEMS" && items.length ? items : null,
      };
      const res = await updateUnderReview(payload);
      handleLoader();
      if (res?.status === 200) {
        const claimContentRes = await getclaimContents({ claimId }, true);

        if (claimContentRes?.status === 200) dispatch(addContents(claimContentRes?.data));

        const claimContentListRes = await claimContentList({ claimId }, true);
        if (claimContentListRes) {
          props.addClaimContentListData({
            claimContentData: claimContentListRes,
            claimId,
          });
          props.addNotification({
            message: res.message,
            id: "add_message_success",
            status: "success",
          });
        }
      } else {
        props.addNotification({
          message: res.message ?? "Something went wrong.",
          id: "add_message_failure",
          status: "error",
        });
      }
    }
  };

  return (
    <>
      {showLoader && <CustomLoader />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        headingName="Add new message"
        childComp={
          <AddNewMsgModalComponent
            handleOpenModal={onClose}
            claimId={claimId}
            participants={participantsList}
            handleMessageSubmit={handleMessageSubmit}
            defaultValue={preSelectedParticipant}
          />
        }
        modalWidthClassName={style.modalContent}
      />
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  claimDetail: state?.claimDetail && state?.claimDetail?.contents,
  participants: state?.commonData?.participants,
  CRN: selectCRN(state),
  policyInfo: state?.claimDetail && state?.claimDetail?.policyInfo,
});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
  addMessageList,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(SupervisorReviewModal);
