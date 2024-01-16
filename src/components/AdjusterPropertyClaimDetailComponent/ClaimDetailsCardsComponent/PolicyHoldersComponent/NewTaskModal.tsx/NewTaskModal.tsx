"use-client";
import clsx from "clsx";
import React from "react";
import modalStyle from "./NewTaskModal.module.scss";
import GenericButton from "@/components/common/GenericButton";

interface NewTaskModalProps {
  handleOpenTaskModal: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ handleOpenTaskModal }) => {
  return (
    <div>
      <form>
        <div className={clsx(modalStyle.upperContainer, "p-2")}>
          <div className={clsx(modalStyle.alignItems, "row col-12 m-2")}>
            <div className={clsx(modalStyle.inputBoxAlign, "col-2")}>
              <label className={modalStyle.labelStyle}>Status</label>
            </div>
            <div className={clsx(modalStyle.text, "col-10")}>PENDING</div>
          </div>

          <div className="row col-12 m-2">
            <div className={clsx(modalStyle.inputBoxAlign, "col-2")}>
              <label className={modalStyle.labelStyle}>Description</label>
            </div>
            <div className={clsx("col-10")}></div>
          </div>

          <div className="row col-12 m-2">
            <div className={clsx(modalStyle.inputBoxAlign, "col-2")}>
              <label className={modalStyle.labelStyle}>Created By</label>
            </div>

            <div className={clsx(modalStyle.text, "col-3")}>Howell, Melissa</div>

            <div className={clsx(modalStyle.inputBoxAlign, "col-3")}>
              <label className={modalStyle.labelStyle}>Assigned Date</label>
            </div>

            <div className={clsx(modalStyle.text, "col-3")}>12-18-2023T10:36:10Z</div>
          </div>

          <div className={clsx(modalStyle.alignItems, "row col-12 m-2")}>
            <div className={clsx(modalStyle.inputBoxAlign, "col-2")}>
              <label className={modalStyle.labelStyle}>Completed Date</label>
            </div>
            <div className={clsx(modalStyle.text, "col-10")}></div>
          </div>

          <div className={clsx(modalStyle.alignItems, "row col-12 m-2")}>
            <div className={clsx(modalStyle.inputBoxAlign, "col-2")}>
              <label className={modalStyle.labelStyle}>Response</label>
            </div>
            <div className={clsx(modalStyle.text, "col-10")}></div>
          </div>

          <div className={clsx(modalStyle.alignItems, "row col-12 m-2")}>
            <div className={clsx("col-5")}>
              <label className={clsx(modalStyle.labelStyle)}>Uploaded Documents</label>
            </div>
            <div className={clsx(modalStyle.text, "col-8")}></div>
          </div>
        </div>

        <div className={clsx(modalStyle.alignRight, "row col-12 mt-2")}>
          <div className={clsx("row col-3")}>
            <GenericButton label="Cancel" size="medium" onClick={handleOpenTaskModal} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewTaskModal;
