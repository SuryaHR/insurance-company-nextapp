import React from "react";
import Modal from "@/components/common/ModalPopups";
import NewTaskDetails from "./NewTaskDetails";
import style from "./NewTaskDetails.module.scss";

const NewTaskModal = (props: any) => {
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
        childComp={<NewTaskDetails onClose={onClose} taskViewData={taskViewData} />}
        overlayClassName={style.modalContainer}
        modalWidthClassName={style.modalContent}
      />
    </div>
  );
};

export default NewTaskModal;
