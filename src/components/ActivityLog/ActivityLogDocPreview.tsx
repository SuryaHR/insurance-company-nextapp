"use-client";
import React, { useEffect, useState, useRef } from "react";
import modalStyle from "./ActivityLogDocPreview.module.scss";
import GenericButton from "@/components/common/GenericButton";
import Image from "next/image";

interface ActivityLogDocPreviewProps {
  handleOpenModal: () => void;
  data: any;
  translate: any;
}

const ActivityLogDocPreview: React.FC<ActivityLogDocPreviewProps> = ({
  handleOpenModal,
  data,
  translate,
}) => {
  // 0 - unsuported
  // 1 - image
  // 2 - pdf
  const [fileType, setfileType] = useState<number>(0);
  const [filePath, setfilePath] = useState<any>("");
  const [imageSize, setimageSize] = useState<number>(150);
  const [fileName, setfileName] = useState<string>("");
  const prevProps = useRef();

  useEffect(() => {
    if (prevProps.current !== data) {
      const attachment = data.attachments ? data.attachments[0] : null;
      if (attachment) {
        const fileExtension = attachment.url.substr(attachment.url.lastIndexOf("."));
        if (
          fileExtension.includes("xlsx") ||
          fileExtension.includes("xls") ||
          fileExtension.includes("doc") ||
          fileExtension.includes("docx")
        ) {
          setfileType(0);
          setfilePath(attachment.url);
          setfileName(attachment.name);
          instDownloadDoc(attachment.url, attachment.name);
        } else if (
          fileExtension.includes("jpg") ||
          fileExtension.includes("png") ||
          fileExtension.includes("jpeg")
        ) {
          setfileType(1);
          setfilePath(attachment.url);
          setfileName(attachment.name);
        } else if (fileExtension.includes("pdf")) {
          setfileType(2);
          setfilePath(attachment.url);
          setfileName(attachment.name);
        } else {
          setfileType(0);
        }
      }
    }
  }, [data]);

  const instDownloadDoc = (filePath: any, fileName: any) => {
    fetch(filePath).then(function (t) {
      return t.blob().then((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", fileName);
        a.click();
      });
    });
  };

  const downloadDoc = () => {
    fetch(filePath).then(function (t) {
      return t.blob().then((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", fileName);
        a.click();
      });
    });
  };

  const handleZoomOut = () => {
    setimageSize(imageSize - 10);
  };

  const handleZoomIn = () => {
    setimageSize(imageSize + 10);
  };

  return (
    <div className={modalStyle.modalCont}>
      <hr className={modalStyle.hrStyle}></hr>
      <GenericButton
        className={modalStyle.buttonStyle}
        label={translate?.activityLogView?.docPreview?.downloadText}
        size="medium"
        onClick={downloadDoc}
      />
      <GenericButton
        className={modalStyle.buttonStyle}
        label={translate?.activityLogView?.docPreview?.closeText}
        size="medium"
        onClick={handleOpenModal}
      />
      <GenericButton
        style={{
          display: fileType == 1 ? "inline-block" : "none",
        }}
        className={modalStyle.buttonStyle}
        label="+"
        size="medium"
        onClick={handleZoomIn}
      />
      <GenericButton
        style={{
          display: fileType == 1 ? "inline-block" : "none",
        }}
        className={modalStyle.buttonStyle}
        label="-"
        size="medium"
        onClick={handleZoomOut}
      />
      <div
        style={{
          display: fileType == 0 ? "block" : "none",
        }}
        className={modalStyle.unSupportedTextCont}
      >
        <span className={modalStyle.unSupportedText}>
          {translate?.activityLogView?.docPreview?.fileTypeNotSupported}
        </span>
      </div>
      <div
        style={{
          display: fileType == 1 ? "block" : "none",
        }}
        className={modalStyle.imageViewCont}
      >
        <Image
          src={filePath}
          alt="image"
          className={modalStyle.viewImage}
          width={imageSize}
          height={imageSize}
        />
      </div>
      <div
        style={{
          display: fileType == 2 ? "block" : "none",
        }}
        className={modalStyle.pdfViewCont}
      >
        <embed src={filePath} type="application/pdf" width="100%" height="600px" />
      </div>
    </div>
  );
};

export default ActivityLogDocPreview;
