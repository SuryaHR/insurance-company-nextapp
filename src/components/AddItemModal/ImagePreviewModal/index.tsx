import React, { ReactNode } from "react";
import styles from "./imagePreviewModal.module.scss";
import { IoClose } from "react-icons/io5";
import GenericButton from "@/components/common/GenericButton";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomMid: () => void;
  // onSubmit: () => void;
  childComp: ReactNode;
  footerContent?: ReactNode | null;
  headingName: string;
  overlayClassName?: string;
  modalClassName?: boolean;
  // btnName1: string;
  // btnName2: string;
  // showSubmitBtn: boolean;
  // showCancelBtn: boolean;
}

const ImagePreviewModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  handleZoomIn,
  handleZoomOut,
  handleZoomMid,
  childComp,
  footerContent = null,
  headingName,
  overlayClassName = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={clsx(styles.modal_overlay, {
        [overlayClassName]: overlayClassName,
      })}
    >
      <div className={styles.modal}>
        <div className={styles.modal_header}>
          {headingName && <div className={styles.modal_title}>{headingName}</div>}
          <IoClose className={styles.cross_icon} onClick={onClose} />
        </div>
        <div className="col-8 row m-2">
          <div className="col-4 pr-0">
            <GenericButton
              label="Close Preview"
              size="small"
              onClick={onClose}
            ></GenericButton>
          </div>

          <div className="col-4 row p-0" style={{ justifyContent: "space-between" }}>
            <div className="col-2 p-0" style={{ marginRight: "-16px" }}>
              <GenericButton
                label="+"
                size="small"
                onClick={handleZoomIn}
              ></GenericButton>
            </div>

            <div className="col-3 p-0">
              <GenericButton
                label="100%"
                size="small"
                onClick={handleZoomMid}
              ></GenericButton>
            </div>

            <div className="col-2 p-0">
              <GenericButton
                label="-"
                size="small"
                onClick={handleZoomOut}
              ></GenericButton>
            </div>
          </div>
        </div>
        <div className={clsx(styles.modal_body, "m-2")}>{childComp}</div>
        {footerContent && <div className={styles.modalFooter}>{footerContent}</div>}
      </div>
    </div>
  );
};

export default ImagePreviewModal;
