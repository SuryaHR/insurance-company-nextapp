import React, { ReactNode } from "react";
import styles from "./modal.module.scss";
import { IoClose } from "react-icons/io5";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  childComp?: ReactNode;
  iconComp?: ReactNode;
  footerContent?: ReactNode | null;
  headingName: any;
  overlayClassName?: string;
  modalClassName?: string;
  modalWidthClassName?: string;
  animate?: boolean;
  positionTop?: boolean;
  roundedBorder?: boolean;
  modalHeaderClass?: string;
  titleStyle?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  // onSubmit,
  childComp = null,
  iconComp = null,

  footerContent = null,
  headingName,
  overlayClassName = "",
  modalWidthClassName = "",
  animate = false,
  positionTop = false,
  roundedBorder = false,
  modalHeaderClass,
  titleStyle = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={clsx(styles.modalOverlay, {
        [overlayClassName]: overlayClassName,
        [styles.animateOverlay]: animate,
        [styles.positionTop]: positionTop,
      })}
    >
      <div
        className={clsx(styles.modal, {
          [modalWidthClassName]: modalWidthClassName,
          [styles.roundedBorder]: roundedBorder,
        })}
      >
        <div className={modalHeaderClass || styles.modalHeader}>
          {headingName && (
            <div
              className={clsx({
                [titleStyle]: titleStyle,
                [styles.modalTitle]: true,
              })}
            >
              {iconComp && <span className={styles.spanStyle}>{iconComp}</span>}
              {headingName}
            </div>
          )}
          <IoClose className={styles.crossIcon} onClick={onClose} />
        </div>
        <div className={styles.modalBody}>{childComp}</div>
        {footerContent && <div className={styles.modalFooter}>{footerContent}</div>}
      </div>
    </div>
  );
};

export default Modal;
