import React, { useState } from "react";
import styles from "./AssignmentActivityLog.module.scss";
import clsx from "clsx";
import { HiOutlineChevronDoubleDown } from "react-icons/hi";
import { HiOutlineChevronDoubleUp } from "react-icons/hi";
import profileImage from "@/assets/images/user-profile.png";
import Image from "next/image";
import excelImg from "@/assets/images/excel-img.png";
import pdfImg from "@/assets/images/pdf-img.png";
import docImg from "@/assets/images/word-img.png";
import unKnownImg from "@/assets/images/unknown.png";
import ImagePreviewModal from "@/components/common/PreviewMedia/ImagePreviewModal";
import AttachementPreview from "@/components/common/PreviewMedia/AttachementPreview";
import { unknownObjectType } from "@/constants/customTypes";

interface AssignmentActivityLogProps {
  groupedObjData: any;
  translate: any;
}
interface ExpandableTextProps {
  text: any;
  translate: any;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, translate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const limit: number = 200;
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  if (!text) return "Empty Message!";

  const displayedText = isExpanded
    ? text
    : `${text?.slice(0, limit)}${text?.length > limit ? "..." : ""}`;

  return (
    <div>
      <p>
        {displayedText}{" "}
        {text.length > limit && (
          <button className={styles.showMoreLessBtn} onClick={toggleExpansion}>
            {isExpanded
              ? translate?.adjusterPropertyClaimActivityLog?.activitylog?.activityLogView
                  ?.lessText
              : translate?.adjusterPropertyClaimActivityLog?.activitylog?.activityLogView
                  ?.moreText}
          </button>
        )}
      </p>
    </div>
  );
};

const AssignmentActivityLog: React.FC<AssignmentActivityLogProps> = ({
  groupedObjData,
  translate,
}) => {
  const options: any = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const [showMe, setshowMe] = useState<boolean>(true);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<unknownObjectType | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const toggle = () => {
    setshowMe(!showMe);
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

  const openModal = (file: unknownObjectType) => {
    console.log("openModal===>", file);
    setPreviewFile(file);
    setShowFilePreviewModal(true);
  };

  const ActivityView = groupedObjData[1].map(
    (obj: any, i: React.Key | null | undefined) => {
      const date = new Date(obj.logCreatedDate);
      if (obj.activityType == "action") {
        return (
          <div key={i} className={styles.d_block}>
            <h6 className={styles.dateCont}>
              {"" + date.toLocaleString("en-US", options) + ""}
            </h6>
            <h6 className={styles.itemDetailCont}>{obj.message}</h6>
          </div>
        );
      } else if (obj.activityType == "message") {
        if (obj.messageType == "outgoing") {
          if (obj.attachments != null) {
            const DocListView = obj.attachments.map((attachment: any, i: any) => {
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
                placeHolderImg = obj.attachments[0]?.url;
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
                    onClick={() => openModal(obj?.attachments[0])}
                    className={styles.attTitle}
                  >
                    {obj.attachments[0]?.name}
                  </a>
                </div>
              );
            });

            return (
              <div className={clsx(styles.itemDetailMsgCont)} key={i}>
                <div style={{ padding: "0px" }}>
                  <h6
                    className={
                      obj.activityEventName != null
                        ? styles.itemDetailMsg
                        : styles.itemDetailMsgSent
                    }
                  >
                    <ExpandableText translate={translate} text={obj.message} />
                  </h6>
                  <div className={clsx("", styles.itemDetailProfile)}>
                    <Image
                      src={profileImage}
                      alt="image"
                      className={styles.profileIcon}
                      width={42}
                      height={42}
                    />
                    <label className={styles.updateUserName}>
                      {obj.updatedByUserName}
                    </label>
                  </div>
                </div>
                <div className={styles.attCont}>{DocListView}</div>
              </div>
            );
          } else {
            return (
              <div className={clsx("row", styles.itemDetailMsgCont)} key={i}>
                <div style={{ padding: "0px" }}>
                  <h6
                    className={
                      obj.activityEventName != null
                        ? styles.itemDetailMsg
                        : styles.itemDetailMsgSent
                    }
                  >
                    <ExpandableText translate={translate} text={obj.message} />
                  </h6>
                  <div className={clsx("", styles.itemDetailProfile)}>
                    <Image
                      src={profileImage}
                      alt="image"
                      className={styles.profileIcon}
                      width={42}
                      height={42}
                    />
                    <label className={styles.updateUserName}>
                      {obj.updatedByUserName}
                    </label>
                  </div>
                </div>
              </div>
            );
          }
        } else if (obj.messageType == "incoming") {
          if (obj.attachments != null) {
            const DocListView = obj.attachments.map((attachment: any, i: any) => {
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
                placeHolderImg = obj.attachments[0]?.url;
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
                  <a onClick={() => openModal(obj)} className={styles.attTitle}>
                    {obj.attachments[0]?.name}
                  </a>
                </div>
              );
            });
            return (
              <div className={clsx("row", styles.itemDetailMsgCont)} key={i}>
                <div style={{ padding: "0px" }}>
                  <h6
                    className={
                      obj.activityEventName != null
                        ? styles.itemDetailMsg
                        : styles.itemDetailMsgReceived
                    }
                  >
                    <ExpandableText translate={translate} text={obj.message} />
                  </h6>
                  <div className={clsx("", styles.itemDetailProfile)}>
                    <Image
                      src={profileImage}
                      alt="image"
                      className={styles.profileIcon}
                      width={42}
                      height={42}
                    />
                    <label className={styles.updateUserName}>
                      {obj.updatedByUserName}
                    </label>
                  </div>
                </div>
                <div className={styles.attCont}>{DocListView}</div>
              </div>
            );
          } else {
            return (
              <div className={clsx("row", styles.itemDetailMsgCont)} key={i}>
                <div style={{ padding: "0px" }}>
                  <h6
                    className={
                      obj.activityEventName != null
                        ? styles.itemDetailMsg
                        : styles.itemDetailMsgReceived
                    }
                  >
                    <ExpandableText translate={translate} text={obj.message} />
                  </h6>
                  <div className={clsx("", styles.itemDetailProfile)}>
                    <Image
                      src={profileImage}
                      alt="image"
                      className={styles.profileIcon}
                      width={42}
                      height={42}
                    />
                    <label className={styles.updateUserName}>
                      {obj.updatedByUserName}
                    </label>
                  </div>
                </div>
              </div>
            );
          }
        }
      }
    }
  );

  return (
    <div className={clsx(styles.container, "p-2 row")}>
      <div className="row">
        <h6 className={styles.headerCont} onClick={toggle}>
          <span>{groupedObjData && groupedObjData[0]}</span>
          <span className={styles.headArrowActionBtn}>
            <HiOutlineChevronDoubleUp
              style={{
                display: !showMe ? "block" : "none",
              }}
            />
            <HiOutlineChevronDoubleDown
              style={{
                display: showMe ? "block" : "none",
              }}
            />
          </span>
        </h6>
        <div
          style={{
            display: showMe ? "block" : "none",
          }}
        >
          {ActivityView}
        </div>
      </div>
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
    </div>
  );
};

export default AssignmentActivityLog;
