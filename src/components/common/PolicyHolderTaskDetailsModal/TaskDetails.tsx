"use-client";
import React, { useState } from "react";
import modalStyle from "./policyHolderTask.module.scss";
import GenericButton from "@/components/common/GenericButton";
import Image from "next/image";
import { convertToCurrentTimezone } from "@/utils/helper";
import PreviewMedia from "@/components/common/PreviewMedia";

interface NewTaskModalProps {
  onClose: () => void;
  taskViewData: any;
}

const NewTaskDetails: React.FC<NewTaskModalProps> = ({ onClose, taskViewData }) => {
  const [isOpenModalMedia, setIsOpenModalMedia] = useState<boolean>(false);
  const handleModalMedia = () => {
    setIsOpenModalMedia((prev: any) => !prev);
  };
  const [prevSelected, setPrevSelected] = useState<any>();

  return (
    <div>
      <form>
        <div className={`${modalStyle.upperContainer} p-2`}>
          <div className={`${modalStyle.alignItems} row col-12 m-2`}>
            <div className={`${modalStyle.inputBoxAlign} col-2`}>
              <label className={modalStyle.labelStyle}>Status</label>
            </div>
            <div className={`${modalStyle.text} col-10`}>
              {taskViewData?.status?.status}
            </div>
          </div>

          <div className="row col-12 m-2">
            <div className={`${modalStyle.inputBoxAlign} col-2`}>
              <label className={modalStyle.labelStyle}>Description</label>
            </div>
            <div className={`${modalStyle.text} col-10`}>{taskViewData?.comment}</div>
          </div>

          <div className="row col-12 m-2 align-items-center">
            <div className={`${modalStyle.inputBoxAlign} col-2`}>
              <label className={modalStyle.labelStyle}>Created By</label>
            </div>
            <div className={`${modalStyle.text} col-3`}>{taskViewData?.createdBy}</div>

            <div className={`${modalStyle.inputBoxAlign} col-3`}>
              <label className={modalStyle.labelStyle}>Assigned Date</label>
            </div>
            <div className={`${modalStyle.text} col-4`}>
              {taskViewData?.assignedDate &&
                convertToCurrentTimezone(taskViewData?.assignedDate)}
            </div>
          </div>

          <div className={`${modalStyle.alignItems} row col-12 m-2`}>
            <div className={`${modalStyle.inputBoxAlign} col-2`}>
              <label className={modalStyle.labelStyle}>Completed Date</label>
            </div>
            <div className={`${modalStyle.text} col-10`}>
              {taskViewData?.completedDate &&
                convertToCurrentTimezone(taskViewData?.completedDate)}
            </div>
          </div>

          <div className={`${modalStyle.alignItems} row col-12 m-2`}>
            <div className={`${modalStyle.inputBoxAlign} col-2`}>
              <label className={modalStyle.labelStyle}>Response</label>
            </div>
            <div className={`${modalStyle.text} col-10`}>{taskViewData?.response}</div>
          </div>

          <div className={`${modalStyle.alignItems} row col-12 m-2`}>
            <div className="col-5">
              <label className={modalStyle.labelStyle}>Uploaded Documents</label>
            </div>
            <div className={`${modalStyle.text} d-flex`}>
              {taskViewData?.attachments &&
                taskViewData?.attachments.length > 0 &&
                taskViewData?.attachments.map((item: any) => {
                  return (
                    <div
                      key={item.id}
                      className="d-flex p-1"
                      onClick={() => {
                        setPrevSelected(item);
                        handleModalMedia();
                      }}
                    >
                      <div>
                        <Image
                          key={item.id}
                          src={item.url}
                          alt={item.name}
                          width={70}
                          height={80}
                        />
                        <div className={modalStyle.imageName}>{item.name}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <PreviewMedia
          isOpen={isOpenModalMedia}
          onClose={handleModalMedia}
          prevSelected={prevSelected}
        />

        <div className={`${modalStyle.alignRight} row col-12 mt-2`}>
          <div className="row col-3">
            <GenericButton label="Cancel" size="medium" onClick={onClose} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewTaskDetails;
