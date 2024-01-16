"use client";
import { useState } from "react";
import Cards from "@/components/common/Cards";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import Link from "next/link";
import MessageCardStyle from "./MessagesCrad.module.scss";
import Modal from "@/components/common/ModalPopups";
import NewMsgListComponent from "./NewMsgListComponent";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import selectNonLoggedInParticipants from "@/reducers/ClaimDetail/Selectors/selectNonLoggedInParticipants";
import selectClaimNumber from "@/reducers/ClaimDetail/Selectors/selectClaimNumber";
import selectCRN from "@/reducers/Session/Selectors/selectCRN";
import { addMessage } from "@/services/AdjusterPropertyClaimDetailServices/ClaimDetailsMessageService";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import CustomLoader from "@/components/common/CustomLoader";
import AddNewMsgModalComponent from "@/components/common/AddNewMessageModalComponent";
import { getClaimDetailMessageList } from "@/services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { PAGINATION_LIMIT_10 } from "@/constants/constants";
import { addMessageList } from "@/reducers/ClaimDetail/ClaimDetailSlice";
import { capitalize } from "@/utils/helper";
import { claimDetailsTranslateType } from "@/translations/claimDetailsTranslate/en";
import useTranslation from "@/hooks/useTranslation";

type messagesComponentType = {
  participants: [];
  messageList: [];
  claimId: string;
  claimNumber: string;
  CRN: string;
};

const MessagesComponent: React.FC<connectorType & messagesComponentType> = (
  props: any
) => {
  const { participants, messageList, claimId, claimNumber, CRN } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const { translate }: { translate: claimDetailsTranslateType | undefined } =
    useTranslation("claimDetailsTranslate");

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };
  const dispatch = useAppDispatch();

  const optionsArray: any = [];

  participants.map((participant: any) => {
    const companyName = participant?.companyDTO?.companyName
      ? `${participant?.companyDTO?.companyName} - `
      : "";
    optionsArray.push({
      label: `${participant?.firstName} ${participant?.lastName} (${companyName}${capitalize(
        participant?.role
      )})`,
      value: JSON.stringify({ participant }),
    });
  });

  const constructFormData = (data: any) => {
    const participantsArray: any = [];
    let internal = true;
    let registration = null;
    data?.participants.map((participant: { value: string }) => {
      const prsedObj = JSON.parse(participant?.value);
      if (
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "EXTERNAL" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "EXISTING VENDOR" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "NEW VENDOR" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "CLAIM ASSOCIATE" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "CLAIM REPRESENTATIVE" ||
        prsedObj?.participant?.participantType?.participantType.toUpperCase() ==
          "GEMLAB ASSOCIATE"
      ) {
        internal = false;
        registration = prsedObj.vendorRegistration;
        participantsArray.push({
          participantId: prsedObj?.participant?.participantId,
          email: prsedObj?.participant?.emailId,
          vendorRegistration: prsedObj ? prsedObj?.participant?.vendorRegistration : null,
          participantType: { ...prsedObj?.participant?.participantType },
        });
      } else {
        participantsArray.push({
          participantId: prsedObj?.participant?.participantId,
          email: prsedObj?.participant?.emailId,
          participantType: { ...prsedObj?.participant?.participantType },
        });
      }
    });
    const payload = {
      claimId: claimId,
      claimNumber: claimNumber,
      sender: CRN,
      itemUID: null,
      serviceRequestNumber: null,
      isPublicNote: false,
      message: data?.message,
      isInternal: internal,
      registrationNumber: registration,
      gropuDetails: {
        groupId: null,
        groupTitle: null,
        participants: participantsArray,
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

  const fecthMessageList = async () => {
    const claimDetailMessageListRes: any = await getClaimDetailMessageList(
      {
        pageNo: 1,
        recordPerPage: PAGINATION_LIMIT_10,
        claimId,
      },
      true
    );
    if (claimDetailMessageListRes?.data !== null) {
      dispatch(addMessageList(claimDetailMessageListRes?.data?.messages));
    } else {
      dispatch(addMessageList([]));
    }
  };

  const handleMessageSubmit = async (data: any) => {
    setShowLoader(true);
    handleOpenModal();
    const formData = constructFormData(data);
    const addMessageResp = await addMessage(formData);
    if (addMessageResp?.status === 200) {
      fecthMessageList();
      setShowLoader(false);
      dispatch(
        addNotification({
          message: addMessageResp.message,
          id: "add_message_success",
          status: "success",
        })
      );
    } else {
      setShowLoader(false);
      dispatch(
        addNotification({
          message: addMessageResp.message ?? "Something went wrong.",
          id: "add_message_failure",
          status: "error",
        })
      );
    }
  };

  return (
    <>
      {showLoader && <CustomLoader />}
      <Modal
        isOpen={isOpen}
        onClose={handleOpenModal}
        headingName={translate?.addMessageCard?.addNewMessage}
        childComp={
          <AddNewMsgModalComponent
            handleOpenModal={handleOpenModal}
            claimId={props.claimId}
            participants={optionsArray}
            handleMessageSubmit={handleMessageSubmit}
          />
        }
        overlayClassName={MessageCardStyle.modalContainer}
        modalWidthClassName={MessageCardStyle.modalContent}
      />

      <Cards className={MessageCardStyle.messageCradContainer}>
        <GenericComponentHeading title={translate?.addMessageCard?.messages}>
          <div className="text-right">
            <Link href="#" onClick={handleOpenModal}>
              Add New Messages
            </Link>
          </div>
        </GenericComponentHeading>
        <div className={MessageCardStyle.messageListContainer}>
          {messageList?.length > 0 ? (
            messageList
              ?.slice(0, 5)
              ?.map((message: any, index: any) => (
                <NewMsgListComponent message={message} key={index} />
              ))
          ) : (
            <NoRecordComponent message={translate?.addMessageCard?.noNewMessage} />
          )}
        </div>
        <div className="text-right">
          <Link href="/all-notes">{translate?.addMessageCard?.viewAllMessges}</Link>
        </div>
      </Cards>
    </>
  );
};
const mapStateToProps = (state: RootState) => ({
  messageList: state.claimDetail.messageList,
  participants: selectNonLoggedInParticipants(state),
  claimNumber: selectClaimNumber(state),
  CRN: selectCRN(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(MessagesComponent);
