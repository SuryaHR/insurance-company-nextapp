import React from "react";
import Modal from "@/components/common/ModalPopups";
import TaskDetails from "./TaskDetails";
import style from "./policyHolderTask.module.scss";

const PolicyHolderTaskDetailsModal = (props: any) => {
  const { isOpen, onClose, taskViewData } = props;
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        headingName={
          `${
            taskViewData?.sno ? "#" + taskViewData?.sno : ""
          } ${taskViewData?.taskName}` || "NA"
        }
        childComp={<TaskDetails onClose={onClose} taskViewData={taskViewData} />}
        overlayClassName={style.modalContainer}
        modalWidthClassName={style.modalContent}
      />
    </div>
  );
};

export default PolicyHolderTaskDetailsModal;
