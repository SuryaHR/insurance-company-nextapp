import React, { ReactNode, useState } from "react";
import styles from "./imagePreviewModal.module.scss";
import { IoClose } from "react-icons/io5";
import GenericButton from "@/components/common/GenericButton";
import clsx from "clsx";
import { deleteMediafiles } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { connect } from "react-redux";
import CustomLoader from "../CustomLoader";
import { useAppDispatch } from "@/hooks/reduxCustomHook";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomMid: () => void;
  childComp: ReactNode;
  footerContent?: ReactNode | null;
  headingName: string;
  overlayClassName?: string;
  modalClassName?: boolean;
  prevSelected?: any;
  showDelete?: boolean;
  deleteActionHandle?: (res: any) => void;
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
  prevSelected,
  showDelete,
  deleteActionHandle,
}) => {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const handleLoader = () => {
    setShowLoader((prevState) => !prevState);
  };

  const downloadMedia = () => {
    fetch(prevSelected?.url).then(function (t) {
      return t.blob().then((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", prevSelected.name);
        a.click();
      });
    });
  };

  const deleteMedia = async () => {
    const param = [{ id: prevSelected?.imageId }];
    handleLoader();
    const res = await deleteMediafiles(param);
    handleLoader();
    try {
      deleteActionHandle && deleteActionHandle(res);
    } catch (e) {
      console.error(e);
    }
    if (res?.status !== 200) {
      dispatch(
        addNotification({
          message: res.errorMessage || "Failed to delete",
          id: "file_upload_success",
          status: "error",
        })
      );
    }
  };

  return (
    <>
      {showLoader && <CustomLoader />}

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
          <div className={`${styles.actionBtn} m-2`}>
            <div className={styles.actionBtnContainer}>
              <div className="pe-0">
                <GenericButton
                  label="Download"
                  size="small"
                  onClick={downloadMedia}
                ></GenericButton>
              </div>
              {showDelete && (
                <div className="pe-0">
                  <GenericButton
                    label="Delete"
                    size="small"
                    onClick={deleteMedia}
                  ></GenericButton>
                </div>
              )}
              <div className="pe-0">
                <GenericButton
                  label="Close Preview"
                  size="small"
                  onClick={onClose}
                ></GenericButton>
              </div>
            </div>

            <div className={styles.rightActionBtn}>
              <div className="p-0">
                <GenericButton
                  label="+"
                  size="small"
                  onClick={handleZoomIn}
                ></GenericButton>
              </div>
              <div className="p-0">
                <GenericButton
                  label="100%"
                  size="small"
                  onClick={handleZoomMid}
                ></GenericButton>
              </div>
              <div className="p-0">
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
    </>
  );
};

const mapDispatchToProps = {
  addNotification,
};

export default connect(null, mapDispatchToProps)(ImagePreviewModal);
