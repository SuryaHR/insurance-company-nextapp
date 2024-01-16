import React, { ReactNode } from "react";
import styles from "./ModalWithoutHeaderPopups.module.scss";
// import { IoClose } from "react-icons/io5";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  childComp?: ReactNode;
  iconComp?: ReactNode;
  footerContent?: ReactNode | null;
  overlayClassName?: string;
  modalClassName?: string;
  modalWidthClassName?: string;
}

const ModalWithoutHeaderPopups: React.FC<ModalProps> = ({
  isOpen,
  childComp = null,
  // iconComp = null,

  footerContent = null,
  overlayClassName = "",
  modalWidthClassName = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={clsx(styles.modalOverlay, {
        [overlayClassName]: overlayClassName,
      })}
    >
      <div
        className={clsx(styles.modal, {
          [modalWidthClassName]: modalWidthClassName,
        })}
      >
        <div className={styles.modalBody}>{childComp}</div>
        {footerContent && <div className={styles.modalFooter}>{footerContent}</div>}
      </div>
    </div>
  );
};

export default ModalWithoutHeaderPopups;
