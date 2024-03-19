import React from "react";
import GenericButton from "@/components/common/GenericButton/index";
import styles from "../documents.module.scss";
import { deleteAttachment } from "@/services/_adjuster_services/AdjusterMyClaimServices/LineItemDetailService";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";

interface DeleteAttachmentProps {
  attachmentData: any;
  closeConfirmModal: () => void;
  openConfirmModal?: () => void;
  removeLoader: () => void;
  addLoader: () => void;
  init: () => void;
  filePurpose: string;
}

const DeleteAttachment: React.FC<DeleteAttachmentProps> = ({
  attachmentData,
  init,
  addLoader,
  removeLoader,
  closeConfirmModal,
  filePurpose,
}) => {
  const dispatch = useAppDispatch();

  const deleteAttSubmit = async () => {
    addLoader();
    try {
      const res: any = await deleteAttachment({
        id: attachmentData?.id,
        purpose: filePurpose,
      });
      if (res.status == 200) {
        dispatch(
          addNotification({
            message: res.message,
            id: "attachment_delete_success",
            status: "success",
          })
        );
      } else {
        dispatch(
          addNotification({
            message: res.message,
            id: "attachment_delete_error",
            status: "error",
          })
        );
      }
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      closeConfirmModal();
      removeLoader();
      init();
    }
  };
  return (
    <div>
      <div className={styles.modalFooter}>
        <div>
          <span>
            Are you sure you want to delete ? <b>Please Confirm!</b>
          </span>
        </div>
        <div className={styles.actionBtn}>
          <div className="mx-1">
            <GenericButton
              label={"No"}
              theme="linkBtn"
              onClick={() => closeConfirmModal && closeConfirmModal()}
            ></GenericButton>
          </div>
          <GenericButton
            label={"Yes"}
            size="small"
            onClickHandler={() => deleteAttSubmit()}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteAttachment;
