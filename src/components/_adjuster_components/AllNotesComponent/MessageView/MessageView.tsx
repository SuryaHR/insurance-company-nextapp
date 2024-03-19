"use client";
import React, { useEffect, useState } from "react";
import styles from "./MessageView.module.scss";
import { convertToCurrentTimezone, getRandomColor } from "@/utils/helper";
import Image from "next/image";
import excelImg from "@/assets/images/excel-img.png";
import pdfImg from "@/assets/images/pdf-img.png";
import docImg from "@/assets/images/word-img.png";
import unKnownImg from "@/assets/images/unknown.png";
import ImagePreviewModal from "@/components/common/PreviewMedia/ImagePreviewModal";
import AttachementPreview from "@/components/common/PreviewMedia/AttachementPreview";
import { unknownObjectType } from "@/constants/customTypes";

interface propsTypes {
  message: string;
  init: () => void;
}

const MessageView: React.FC<propsTypes> = ({ message, init }) => {
  const [messages, setMessages] = useState<any>(message);
  const currentUserId: any = localStorage.getItem("userId") || 0;
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<unknownObjectType | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  useEffect(() => {
    setMessages(message);
  }, [message]);

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

  const deleteMediafiles = (res: any) => {
    if (res.status == 200) {
      setShowFilePreviewModal(false);
      init();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const targetDiv = document.getElementById("messageBottom");
      if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  }, [message]);

  return (
    <>
      <ImagePreviewModal
        isOpen={showFilePreviewModal}
        onClose={closePreviewModal}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleZoomMid={handleZoomMid}
        headingName={previewFile?.name}
        prevSelected={previewFile}
        deleteActionHandle={deleteMediafiles}
        childComp={
          <AttachementPreview prevSelected={previewFile} zoomLevel={zoomLevel} />
        }
        modalClassName={true}
      />
      {messages?.map((element: any, index: number) => (
        <div key={index} className="row">
          {parseInt(currentUserId) === element?.addedBy?.id && (
            <div id={element?.noteId} className={`${styles.sentMessage} row`}>
              <div className={`col-md-12 ${styles.p_0} ${styles.messageCont}`}>
                {element?.message != null && element?.message != "" && (
                  <p className={styles.messageText}>{element?.message}</p>
                )}
                <span className={styles.messageByDate}>
                  {element?.addedBy?.firstName +
                    " " +
                    element?.addedBy?.lastName +
                    ", " +
                    convertToCurrentTimezone(element?.createDate, "DD MMM YY, hh:mm A")}
                </span>
              </div>
              {element?.attachments != null && (
                <div>
                  {element?.attachments.map((attachment: any, i: any) => {
                    const fileExtension = attachment.url.substr(
                      attachment.url.lastIndexOf(".")
                    );
                    let placeHolderImg: any = "";
                    if (fileExtension.includes("xlsx") || fileExtension.includes("xls")) {
                      placeHolderImg = excelImg.src;
                    } else if (fileExtension.includes("pdf")) {
                      placeHolderImg = pdfImg.src;
                    } else if (
                      fileExtension.includes("doc") ||
                      fileExtension.includes("docx")
                    ) {
                      placeHolderImg = docImg.src;
                    } else if (
                      fileExtension.includes("jpg") ||
                      fileExtension.includes("jpeg") ||
                      fileExtension.includes("png")
                    ) {
                      placeHolderImg = element?.attachments[i]?.url;
                    } else {
                      placeHolderImg = unKnownImg.src;
                    }
                    return (
                      <div className={`${styles.DocViewListSty} ${styles.f_r}`} key={i}>
                        <Image
                          className={styles.attDoc}
                          src={placeHolderImg}
                          alt="Preview"
                          style={{ height: "80px", width: "80px" }}
                          width={80}
                          height={80}
                        />
                        <a
                          title={element?.attachments[i]?.name}
                          onClick={() => viewDoc(element?.attachments[i])}
                          className={styles.attTitle}
                        >
                          {element?.attachments[i]?.name}
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {parseInt(currentUserId) !== element?.addedBy?.id && (
            <div id={element?.noteId} className={styles.recivedMessage}>
              <div className={`col-md-1 ${styles.p_0} ${styles.profileIconCont}`}>
                <span
                  style={{ backgroundColor: getRandomColor() }}
                  className={`${styles.profileIcon}`}
                >
                  {" "}
                  {element?.addedBy?.firstName.charAt(0).toUpperCase() +
                    " " +
                    element?.addedBy?.lastName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={`col-md-11 ${styles.p_0} ${styles.messageRecCont}`}>
                {element?.message != null && element?.message != "" && (
                  <p className={styles.messageTextRec}>{element?.message}</p>
                )}
                <span className={styles.messageByDateRec}>
                  {element?.addedBy?.firstName +
                    " " +
                    element?.addedBy?.lastName +
                    ", " +
                    convertToCurrentTimezone(element?.createDate, "DD MMM YY, hh:mm A")}
                </span>
              </div>
              {element?.attachments != null && (
                <div>
                  {element?.attachments.map((attachment: any, i: any) => {
                    const fileExtension = attachment.url.substr(
                      attachment.url.lastIndexOf(".")
                    );
                    let placeHolderImg: any = "";
                    if (fileExtension.includes("xlsx") || fileExtension.includes("xls")) {
                      placeHolderImg = excelImg.src;
                    } else if (fileExtension.includes("pdf")) {
                      placeHolderImg = pdfImg.src;
                    } else if (
                      fileExtension.includes("doc") ||
                      fileExtension.includes("docx")
                    ) {
                      placeHolderImg = docImg.src;
                    } else if (
                      fileExtension.includes("jpg") ||
                      fileExtension.includes("jpeg") ||
                      fileExtension.includes("png")
                    ) {
                      placeHolderImg = element?.attachments[i]?.url;
                    } else {
                      placeHolderImg = unKnownImg.src;
                    }
                    return (
                      <div className={styles.DocViewListSty} key={i}>
                        <Image
                          className={styles.attDoc}
                          src={placeHolderImg}
                          alt="Preview"
                          style={{ maxWidth: "100%", width: "80px" }}
                          width={80}
                          height={80}
                        />
                        <a
                          // onClick={() => openModal(obj)}
                          className={styles.attTitle}
                        >
                          {element?.attachments[i]?.name}
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <div id="messageBottom"></div>
    </>
  );
};

export default MessageView;
