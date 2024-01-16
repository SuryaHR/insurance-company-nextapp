"use-client";
import React, { useState } from "react";
import clsx from "clsx";
import NewMsgStyle from "./NewMsgListComponent.module.scss";
import Image from "next/image";
import profileImage from "@/assets/images/teamMemb.png";
import { convertToCurrentTimezone } from "@/utils/helper";

interface newMsgProps {
  message: any;
}

const NewMsgListComponent = ({ message }: newMsgProps) => {
  const [divVisible, setDivVisible] = useState(false);

  const { addedBy } = message;
  const changDisplay = () => {
    const stringLength = message.message.length;
    if (stringLength > 77) {
      setDivVisible(true);
    }
  };

  const changeReverted = () => {
    setDivVisible(false);
  };
  const dateFormate = "MMM DD, h:mm A";
  return (
    <>
      <div className={clsx(NewMsgStyle.container, "col-12 row")}>
        <div
          className={clsx(NewMsgStyle.imageContainer, "col-12 m-1 p-0")}
          style={{ height: "32px" }}
        >
          <div className={clsx(NewMsgStyle.alignItems, "p-0")}>
            <Image
              src={profileImage}
              alt="image"
              style={{ height: "32px", width: "32px" }}
            />
          </div>
          <div className={clsx(NewMsgStyle.title, "px-0 pt-1")}>
            {addedBy.firstName}, {addedBy.lastName}
          </div>
        </div>
        <div className="col-12 p-0">
          <div
            id="visibleDiv1"
            className={clsx(NewMsgStyle.textEllipsis, "col-12 px-1")}
            style={{ height: "20px" }}
            onMouseOver={changDisplay}
            onMouseOut={changeReverted}
          >
            {message.message}
          </div>
          {divVisible && (
            <div
              id="hiddenDiv"
              className={clsx(NewMsgStyle.popContainer, "col-12")}
              style={{ wordWrap: "break-word" }}
              onMouseOver={changDisplay}
              onMouseOut={changeReverted}
            >
              {message.message}
            </div>
          )}
        </div>
        <div className={clsx(NewMsgStyle.textRight, "col-12 p-2")}>
          {convertToCurrentTimezone(message.createDate, dateFormate)}
        </div>
      </div>
    </>
  );
};

export default NewMsgListComponent;
