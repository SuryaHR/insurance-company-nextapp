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
import ActivityLogDocPreview from "./ActivityLogDocPreview";
import ModalWithoutHeaderPopups from "@/components/common/ModalWithoutHeaderPopups";

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

  const displayedText = isExpanded
    ? text
    : text.slice(0, limit) + (text.length > limit ? "..." : "");

  return (
    <div>
      <p>
        {displayedText}{" "}
        {text.length > limit && (
          <button className={styles.showMoreLessBtn} onClick={toggleExpansion}>
            {isExpanded
              ? translate?.activityLogView?.lessText
              : translate?.activityLogView?.moreText}
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [AttData, setAttData] = useState({});
  const toggle = () => {
    setshowMe(!showMe);
  };

  const openModal = (data: any) => {
    setAttData(data);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
    setIsModalOpen(false);
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
                  <img
                    className={styles.attDoc}
                    src={placeHolderImg}
                    alt="Preview"
                    style={{ maxWidth: "100%", width: "80px" }}
                  />
                  <a onClick={() => openModal(obj)} className={styles.attTitle}>
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
                      style={{ height: "42px", width: "42px" }}
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
                      style={{ height: "42px", width: "42px" }}
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
                  <img
                    className={styles.attDoc}
                    src={placeHolderImg}
                    alt="Preview"
                    style={{ maxWidth: "100%", width: "80px" }}
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
                      style={{ height: "42px", width: "42px" }}
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
                      style={{ height: "42px", width: "42px" }}
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
      <ModalWithoutHeaderPopups
        isOpen={isModalOpen}
        childComp={
          <ActivityLogDocPreview
            translate={translate}
            handleOpenModal={handleOpenModal}
            data={AttData}
          />
        }
        modalWidthClassName={styles.modalWidth}
      ></ModalWithoutHeaderPopups>
    </div>
  );
};

export default AssignmentActivityLog;
