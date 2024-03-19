import React, { ReactNode } from "react";
import Modal from "@/components/common/ModalPopups";
import GenericButton from "@/components/common/GenericButton";
import confirmModalStyle from "./confirmModal.module.scss";

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
            <div className="mx-1">
              <GenericButton
                label={closeBtnText}
                theme="linkBtn"
                onClick={() => closeHandler && closeHandler()}
              ></GenericButton>
            </div>
            <GenericButton
              label={submitBtnText}
              size="small"
              onClickHandler={() => submitHandler && submitHandler()}
            />
          </div>
        }
        overlayClassName={confirmModalStyle.overlay}
        modalClassName={confirmModalStyle.modal}
      />
    </>
  );
}

export default ConfirmModal;
