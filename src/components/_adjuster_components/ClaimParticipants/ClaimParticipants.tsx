"use client";
import React, { useState, useEffect } from "react";
import Cards from "@/components/common/Cards";
import { FaUserCircle } from "react-icons/fa";
import GenericComponentHeading from "../../common/GenericComponentHeading/index";
import { SlEnvolope } from "react-icons/sl";
import Modal from "@/components/common/ModalPopups";
import styles from "./ClaimParticipants.module.scss";
import { IconContext } from "react-icons";
import AddNewMsgModalComponent from "../../common/AddNewMessageModalComponent/AddNewMessageModalComponent";
import selectClaimNumber from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectClaimNumber";
import selectCRN from "@/reducers/Session/Selectors/selectCRN";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import Loading from "@/app/[lang]/loading";
import { capitalize } from "@/utils/helper";
import { addClaimParticipants } from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";
import { getParticipantsDetails } from "@/services/_adjuster_services/ClaimService";
import selectPolicyNumber from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectPolicyNumber";
import {
  addMessage,
  getClaimDetailMessageList,
} from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import selectNonLoggedInParticipants from "@/reducers/_adjuster_reducers/CommonData/Selectors/selectNonLoggedInParticipants";
import { addMessageList } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { PAGINATION_LIMIT_10 } from "@/constants/constants";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import { phoneFormatHandler } from "@/utils/utitlity";

interface type {
  claimId: string;
  participants: [];
  messageList: [];
  claimNumber: string;
  CRN: string;
  PolicyNumber?: any;
}

const ClaimParticipants: React.FC<type & connectorType> = (props) => {
  const { participants, claimId, claimNumber, CRN, claimParticipantsData, policyNumber } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          claimNumber: claimNumber,
          PolicyNumber: policyNumber,
        };
        setTableLoader(true);
        const claimParticipantsRes = await getParticipantsDetails(payload);
        if (claimParticipantsRes.status === 200) {
          const participants = claimParticipantsRes.data.map(
            (participant: {
              companyDTO: { companyName: string };
              firstName: string;
              lastName: string;
              role: string;
              phoneNum: string;
            }) => ({
              firstName: participant.firstName,
              lastName: participant.lastName,
              companyName: participant.companyDTO?.companyName,
              role: participant.role,
              phoneNum: participant.phoneNum,
            })
          );
          dispatch(addClaimParticipants(participants));
          setTableLoader(false);
        } else {
          console.error(
            "Error fetching claim participants:",
            claimParticipantsRes.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching claim participants:", error);
      } finally {
        setTableLoader(false);
      }
    };

    fetchData();
  }, [claimNumber, dispatch, policyNumber]);

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

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
    setTableLoader(true);
    handleOpenModal();
    const formData = constructFormData(data);
    const addMessageResp = await addMessage(formData);
    if (addMessageResp?.status === 200) {
      fecthMessageList();
      setTableLoader(false);
      dispatch(
        addNotification({
          message: addMessageResp.message,
          id: "add_message_success",
          status: "success",
        })
      );
    } else {
      setTableLoader(false);
      dispatch(
        addNotification({
          message: addMessageResp.message ?? "Something went wrong.",
          id: "add_message_failure",
          status: "error",
        })
      );
    }
  };

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
      groupDetails: {
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
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  return (
    <div className={styles.claimParticipants}>
      <div className={styles.heading}>
        <GenericComponentHeading
          title={
            translate?.claimParticipantsTranslate?.claimParticipants
              ?.claimPraticipantsHeading
          }
        />
      </div>
      {tableLoader && <Loading />}
      <Modal
        isOpen={isOpen}
        onClose={handleOpenModal}
        childComp={
          <AddNewMsgModalComponent
            handleOpenModal={handleOpenModal}
            handleMessageSubmit={handleMessageSubmit}
            claimId={claimId}
            participants={optionsArray}
          />
        }
        headingName="Add new message"
        modalWidthClassName={styles.modalWidth}
      ></Modal>
      <div className="row">
        {claimParticipantsData.map(
          (
            participant: {
              firstName: any;
              lastName: any;
              companyName: any;
              role: any;
              phoneNum: any;
            },
            i: React.Key | null | undefined
          ) => (
            <div className={styles.claimCards} key={i}>
              <Cards className={styles.cardsParticipants}>
                <div className={styles.participantsCardContainer}>
                  <IconContext.Provider value={{ className: styles.useCircle }}>
                    <FaUserCircle />
                  </IconContext.Provider>
                  <div className={styles.name}>
                    {participant.lastName}, {participant.firstName}
                  </div>
                  {/* <div className={styles.companyName}>{participant.companyName}</div> */}
                  <div className={styles.companyName}>
                    {participant.companyName ? (
                      participant.companyName
                    ) : (
                      <div className="mt-3"></div>
                    )}
                  </div>
                  <div className={styles.role}>{participant.role}</div>
                  <div className={styles.contactDetails}>
                    <div className={styles.phone}>
                      {phoneFormatHandler(participant?.phoneNum).formattedInput}
                    </div>
                    <div className={styles.mail}>
                      <button className={styles.mail} onClick={handleOpenModal}>
                        <IconContext.Provider value={{ className: styles.ciMail }}>
                          <SlEnvolope />
                        </IconContext.Provider>
                      </button>
                    </div>
                  </div>
                </div>
              </Cards>
            </div>
          )
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state: RootState) => ({
  messageList: state.commonData.messageList,
  participants: selectNonLoggedInParticipants(state),
  claimNumber: selectClaimNumber(state),
  CRN: selectCRN(state),
  claimParticipantsData: state.claimDetail.claimParticipantsData,
  policyNumber: selectPolicyNumber(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ClaimParticipants);
