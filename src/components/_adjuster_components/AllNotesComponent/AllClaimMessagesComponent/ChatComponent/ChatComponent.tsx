import React from "react";
import { useState } from "react";
import styles from "./ChatComponent.module.scss";
import { FaExpandAlt } from "react-icons/fa";
import { FaCompressAlt } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { IoClose, IoSendSharp } from "react-icons/io5";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import MessageView from "../../MessageView/MessageView";
import { addMessage } from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import CustomLoader from "@/components/common/CustomLoader";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import excelImg from "@/assets/images/excel-img.png";
import pdfImg from "@/assets/images/pdf-img.png";
import docImg from "@/assets/images/word-img.png";
import unKnownImg from "@/assets/images/unknown.png";
import ImagePreviewModal from "@/components/common/PreviewMedia/ImagePreviewModal";
import AttachementPreview from "@/components/common/PreviewMedia/AttachementPreview";
import { unknownObjectType } from "@/constants/customTypes";
interface ChatComponentProps {
  divEnlarge: any;
  iconChange: boolean;
  data: any;
  init: () => void;
}

const ChatComponent: React.FC<ChatComponentProps & connectorType> = ({
  divEnlarge,
  iconChange,
  data,
  CRN,
  init,
}) => {
  const [newMessage, setNewMessage] = useState<any>("");
  const [filesPicked, setFilesPicked] = useState<any>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<unknownObjectType | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const dispatch = useAppDispatch();

  const viewDoc = (file: unknownObjectType) => {
    setPreviewFile(file);
    setShowFilePreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowFilePreviewModal(false);
    setPreviewFile(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 5);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel - 5);
  };

  const handleZoomMid = () => {
    setZoomLevel(100);
  };

  const MessageSubmit = async () => {
    if (filesPicked?.length <= 0 && newMessage.trim() == "") {
      return;
    }
    try {
      setIsLoader(true);

      const registrationNumber = data?.participants?.find(
        (participant: any) => participant.crn !== null
      )?.crn;

      const formData = new FormData();
      const mediaFilesDetail: any[] = [];
      if (filesPicked) {
        filesPicked?.forEach((element: any) => {
          formData.append("file", element?.file);
          mediaFilesDetail.push({
            fileName: element.name,
            fileType: element.type,
            extension: element.extension,
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
          isPublicNote: data?.isPublicNote,
          registrationNumber: registrationNumber,
          sender: CRN,
          itemUID: data?.itemUID || null,
          serviceRequestNumber: null,
          isInternal: !!(registrationNumber && registrationNumber !== ""),
          claimNumber: sessionStorage.getItem("claimNumber"),
          message: newMessage,
          groupDetails: {
            groupId: data?.groupId,
            groupNumber: data?.groupNumber,
          },
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
      setFilesPicked([]);
      setNewMessage("");
    }
  };

  const onChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  const pickAttachment = (e: any) => {
    const fileList: any = e.target.files;
    const updatedUploadDocs = Array.from(fileList).map((element: any) => {
      const ext: any = element?.name.substr(element?.name.lastIndexOf("."));
      let placeHolderImg: any = "";
      switch (true) {
        case ext.includes("xlsx") || ext.includes("xls"):
          placeHolderImg = excelImg.src;
          break;
        case ext.includes("pdf"):
          placeHolderImg = pdfImg.src;
          break;
        case ext.includes("doc") || ext.includes("docx"):
          placeHolderImg = docImg.src;
          break;
        case ext.includes("jpg") || ext.includes("jpeg") || ext.includes("png"):
          placeHolderImg = URL.createObjectURL(element);
          break;
        default:
          placeHolderImg = unKnownImg.src;
          break;
      }

      return {
        url: placeHolderImg,
        name: element?.name,
        lastModified: element?.lastModified,
        lastModifiedDate: element?.lastModifiedDate,
        size: element?.size,
        type: element?.type,
        webkitRelativePath: element?.webkitRelativePath,
        file: element,
        extension: element?.name.substr(element?.name.lastIndexOf(".")),
        description: "",
      };
    });

    setFilesPicked((prev: any) => [...prev, ...updatedUploadDocs]);
  };

  const handleDeleteImage = (indexToDelete: any) => {
    setFilesPicked((prevCollection: any) => {
      return prevCollection.filter((_: any, index: any) => index !== indexToDelete);
    });
  };

  return (
    <div className={styles.container}>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <ImagePreviewModal
        isOpen={showFilePreviewModal}
        onClose={closePreviewModal}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleZoomMid={handleZoomMid}
        headingName={previewFile?.name}
        prevSelected={previewFile}
        showDelete={false}
        childComp={
          <AttachementPreview prevSelected={previewFile} zoomLevel={zoomLevel} />
        }
        modalClassName={true}
      ></ImagePreviewModal>
      <div className={styles.heading}>
        {iconChange ? (
          <span className={styles.expandIcon}>
            <FaCompressAlt onClick={divEnlarge} />
          </span>
        ) : (
          <span className={styles.expandIcon}>
            <FaExpandAlt onClick={divEnlarge} />
          </span>
        )}
        <span>
          {data?.participants[0]?.firstName +
            " " +
            data?.participants[0]?.lastName +
            (data?.participants?.length > 1
              ? " + " + (data?.participants?.length - 1) + " Others"
              : "")}
        </span>
      </div>
      <div className={styles.chatContainer}>
        <MessageView init={init} message={data?.messages} />
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.inputBox}>
          <textarea
            id="conversationText"
            className={styles.textAreaStyle}
            placeholder="Type Message"
            onChange={onChange}
            value={newMessage}
          />
        </div>
        <div className={styles.attachmentIcon}>
          <GrAttachment
            onClick={() => fileInputRef?.current && fileInputRef?.current?.click()}
            size={"25px"}
          />
          <input
            type="file"
            id="inp"
            multiple
            ref={fileInputRef}
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={pickAttachment}
            className={styles.fileInputStyle}
          ></input>
        </div>
        <div onClick={MessageSubmit} className={styles.sendIcon}>
          <IoSendSharp size={"25px"} />
        </div>
      </div>
      {filesPicked?.length > 0 && (
        <div className={`row ${styles.filePickedCont}`}>
          <div className="col-md-2">Attachment(s)</div>
          <div className="col-md-10 row">
            {Object.keys(filesPicked).map((ele: any, index) => (
              <div key={index} className={`col-md-4 ${styles.inlineItemsContainer}`}>
                <a onClick={() => viewDoc(filesPicked[ele])}>{filesPicked[ele]?.name}</a>
                <IoClose
                  className={`${styles.iconColor}`}
                  onClick={() => handleDeleteImage(index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  notesParticipants: state.allNotes.notesParticipants,
  notes: state.allNotes.notes,
  CRN: state.session.CRN,
});

const connector = connect(mapStateToProps, {});
type connectorType = ConnectedProps<typeof connector>;
export default connector(ChatComponent);
