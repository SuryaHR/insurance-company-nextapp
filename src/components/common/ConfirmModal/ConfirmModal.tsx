import React, { ReactNode } from "react";
import Modal from "@/components/common/ModalPopups";
import GenericButton from "@/components/common/GenericButton";
import confirmModalStyle from "./confirmModal.module.scss";
import Link from "next/link";

type props = {
  showConfirmation: boolean;
  closeHandler?: () => void;
  submitHandler?: () => void;
  closeBtnText?: string;
  submitBtnText: string;
  descText?: string;
  headingText?: string;
  modalHeading: string;
  childComp?: ReactNode;
};
function ConfirmModal({
  showConfirmation = false,
  closeHandler,
  submitHandler,
  closeBtnText = "",
  submitBtnText = "",
  // descText = "",
  // headingText = "",
  modalHeading = "",
  childComp = null,
}: props) {
  return (
    <>
      <Modal
        isOpen={showConfirmation}
        headingName={modalHeading}
        childComp={<div className={confirmModalStyle.modalBody}>{childComp}</div>}
        onClose={() => closeHandler && closeHandler()}
        footerContent={
          <div className={confirmModalStyle.modalFooter}>
            {/* <GenericButton
              label={closeBtnText}
              size="small"
              theme="deleteBtn"
              onClickHandler={() => closeHandler && closeHandler()}
            /> */}
            <div className="mx-1">
              <Link href="" onClick={() => closeHandler && closeHandler()}>
                {closeBtnText}
              </Link>
            </div>
            <GenericButton
              label={submitBtnText}
              // theme="lightBlue"
              size="small"
              onClickHandler={() => submitHandler && submitHandler()}
            />
          </div>
        }
        overlayClassName={confirmModalStyle.overlay}
        modalClassName={confirmModalStyle.modal}
      />
      {/* <div className={confirmModalStyle.modalBody}>
        {headingText && <h3 className={confirmModalStyle.heading}>{headingText}</h3>}
        {descText && <p className={confirmModalStyle.desc}>{descText}</p>}
      </div> */}
    </>
  );
}

export default ConfirmModal;
