"use client";
import React, { useCallback, useEffect, useState } from "react";
import GenericBreadcrumb from "../../common/GenericBreadcrumb";
import GenericComponentHeading from "../../common/GenericComponentHeading";
import styles from "./AllNotes.module.scss";
import AllClaimMessagesComponent from "./AllClaimMessagesComponent";
import {
  getNoteDetails,
  getNotesParticipants,
} from "@/services/_adjuster_services/AllNotesService";
import CustomLoader from "@/components/common/CustomLoader";
import GenericButton from "@/components/common/GenericButton";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import {
  addNotes,
  addNotesParticipants,
  addNotesFull,
  addSearchKey,
} from "@/reducers/_adjuster_reducers/AllNotes/AllNotesSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import Modal from "@/components/common/ModalPopups";
import AddNewMessageForAllNotesPopup from "./AddNewMessageForAllNotesPopup/AddNewMessageForAllNotesPopup";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { addMessage } from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import { allNotesTranslatePropType } from "@/app/[lang]/(adjuster)/all-notes/[claimId]/page";
interface propsTypes {
  claimId: string;
}

const AllNotesComponent: React.FC<propsTypes & connectorType> = ({
  claimId,
  notes,
  notesParticipants,
  CRN,
  searchKey,
  notesFull,
}) => {
  const dispatch = useAppDispatch();
  const prevProps = React.useRef();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const noteId: any = sessionStorage.getItem("noteId")
    ? sessionStorage.getItem("noteId")
    : null;

  const { translate } =
    useContext<TranslateContextData<allNotesTranslatePropType>>(TranslateContext);

  const claimNumber: any = sessionStorage.getItem("claimNumber" || "");
  const [isOpen, setIsOpen] = useState(false);
  const pathList = [
    {
      name: translate?.breadCrumbTranslate.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: `${claimNumber}`,
      path: `/adjuster-property-claim-details/${claimId}`,
    },
    {
      name: translate?.breadCrumbTranslate.breadCrumbsHeading?.message,
      path: "",
      active: true,
    },
  ];

  const init = useCallback(async () => {
    setIsLoader(true);
    try {
      const [notesData, notesParticipantsData] = await Promise.all([
        getNoteDetails({ claimId }),
        getNotesParticipants({ claimNumber }),
      ]);
      const updatedData: any[] = [];
      notesParticipantsData?.data?.forEach((ele: any) => {
        let label: any = "";
        if (ele?.firstName) {
          label += ele?.firstName + " " + ele?.lastName;
        }
        if (ele?.companyDTO?.companyName && ele?.designation?.name) {
          label +=
            " ( " + ele?.companyDTO?.companyName + " - " + ele?.designation?.name + " )";
        } else if (ele?.role) {
          label += " ( " + ele?.role + " )";
        }

        updatedData.push({
          label: label,
          value: ele.id,
        });

        ele.label = label;
        ele.value = ele.id;
      });
      dispatch(addNotesFull({ notesFull: notesData?.data }));
      dispatch(addNotes({ notes: notesData?.data }));
      dispatch(addNotesParticipants({ notesParticipants: notesParticipantsData?.data }));
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setIsLoader(false);
      dispatch(addSearchKey({ searchKey: "" }));
    }
  }, [dispatch, claimId, claimNumber]);

  useEffect(() => {
    init();
  }, [init]);

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const getCRNByParticipantValue = (participantValue: any) => {
    const matchedParticipant: any = notesParticipants.find(
      (participant: any) => participant.id === participantValue
    );
    return matchedParticipant ? matchedParticipant.crn : null;
  };

  const handleMessageSubmit = async (data: any) => {
    let internal: any = true;
    // let registration: any;
    const messageReceipient: any[] = [];
    data?.participants?.forEach((participant: any) => {
      notesParticipants.forEach((item: any) => {
        if (participant?.value === item.id) {
          if (
            item.participantType.participantType.toUpperCase() === "EXTERNAL" ||
            item.participantType.participantType.toUpperCase() === "EXISTING VENDOR" ||
            item.participantType.participantType.toUpperCase() === "NEW VENDOR" ||
            item.participantType.participantType.toUpperCase() === "CLAIM ASSOCIATE" ||
            item.participantType.participantType.toUpperCase() ===
              "CLAIM REPRESENTATIVE" ||
            item.participantType.participantType.toUpperCase() === "GEMLAB ASSOCIATE"
          ) {
            internal = false;
            // registration = item.vendorRegistration;
            messageReceipient.push({
              participantId: participant.value,
              email: item.emailId,
              participantType: {
                id: item.participantType.id,
                participantType: item.participantType.participantType,
              },
              vendorRegistration: item ? item.vendorRegistration : null,
            });
          } else {
            messageReceipient.push({
              participantId: participant.value,
              email: item.emailId,
              participantType: {
                id: item.participantType.id,
                participantType: item.participantType.participantType,
              },
            });
          }
        }
      });
    });

    try {
      setIsLoader(true);

      const registrationNumber = data?.participants?.find((participant: any) =>
        getCRNByParticipantValue(participant?.value)
      );

      const formData = new FormData();
      const mediaFilesDetail: any[] = [];
      if (data?.files) {
        data?.files?.forEach((element: any) => {
          formData.append("file", element);
          mediaFilesDetail.push({
            fileName: element.name,
            fileType: element.type,
            extension: element?.name.substr(element?.name.lastIndexOf(".")),
            filePurpose: "NOTE",
            latitude: null,
            longitude: null,
          });
        });
      }

      formData.append("mediaFilesDetail", JSON.stringify(mediaFilesDetail));
      formData.append(
        "noteDetail",
        JSON.stringify({
          claimId: sessionStorage.getItem("claimId"),
          claimNumber: sessionStorage.getItem("claimNumber"),
          sender: CRN,
          itemUID: null,
          serviceRequestNumber: null,
          isPublicNote: false,
          message: data?.message,
          isInternal: internal,
          groupDetails: {
            groupId: null,
            groupTitle: null,
            participants: messageReceipient,
          },
          assignmentNumber: null,
          registrationNumber: registrationNumber,
        })
      );

      const res = await addMessage(formData);

      dispatch(
        addNotification({
          message: res?.message,
          id: res?.status === 200 ? "add_message_success" : "add_message_error",
          status: res?.status === 200 ? "success" : "error",
        })
      );
    } catch (error) {
      console.error("Error in MessageSubmit: ", error);
      dispatch(
        addNotification({
          message: "An error occurred while submitting the message.",
          id: "add_message_error",
          status: "error",
        })
      );
    } finally {
      setIsLoader(false);
      init();
      handleOpenModal();
    }
  };

  useEffect(() => {
    if (prevProps.current !== searchKey && notesFull) {
      dispatch(
        addNotes({
          notes: notesFull?.filter((item: any) =>
            item.messages.some((msg: any) => msg.message.includes(searchKey))
          ),
        })
      );
    }
  }, [dispatch, notesFull, searchKey]);

  return (
    <div className="row">
      {isLoader && <CustomLoader loaderType="spinner1" />}

      <Modal
        isOpen={isOpen}
        onClose={handleOpenModal}
        headingName={"Add new message"}
        overlayClassName={styles.modalContainer}
        modalWidthClassName={styles.modalContent}
        childComp={
          <AddNewMessageForAllNotesPopup
            handleOpenModal={handleOpenModal}
            claimId={claimId}
            participants={notesParticipants}
            handleMessageSubmit={handleMessageSubmit}
          />
        }
      />

      <div className={styles.stickyContainer}>
        <GenericBreadcrumb dataList={pathList} />
        <GenericComponentHeading
          customHeadingClassname={styles.headingContainer}
          customTitleClassname={styles.headingTxt}
          title={translate?.breadCrumbTranslate.breadCrumbsHeading?.allClaimMessages}
        />
        {!notes && (
          <>
            <div>
              <GenericButton
                className={styles.buttonCss}
                label={"Add Message"}
                onClick={handleOpenModal}
                size="medium"
              />
            </div>
            <div className={styles.noMessCont}>
              <span>
                {translate?.breadCrumbTranslate.breadCrumbsHeading?.noMessageAvailabale}
              </span>
            </div>
          </>
        )}
        {notes && (
          <AllClaimMessagesComponent
            init={init}
            handleOpenModal={handleOpenModal}
            claimId={claimId}
            noteId={noteId}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  notesParticipants: state.allNotes.notesParticipants,
  notes: state.allNotes.notes,
  notesFull: state.allNotes.notesFull,
  CRN: state.session.CRN,
  searchKey: state.allNotes.searchKey,
});

const mapDispatchToProps = {
  addNotesParticipants,
  addNotes,
  addNotesFull,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AllNotesComponent);
