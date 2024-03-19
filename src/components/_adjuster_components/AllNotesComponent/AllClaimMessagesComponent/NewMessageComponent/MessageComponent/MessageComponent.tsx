"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import MessageComponentStyle from "./MessageComponent.module.scss";
import { convertToCurrentTimezone } from "@/utils/helper";

interface messageComponentProp {
  data: any;
}

const MessageComponent: React.FC<messageComponentProp> = ({ data }) => {
  const [messageData, setMessageData] = useState(data);

  useEffect(() => {
    setMessageData(data);
  }, [data]);

  const color = [
    "#C9F1FD",
    "#FFEBCD",
    "#3BB9FF",
    "#f7bec5",
    "#bdb9f7",
    "#85f7cb",
    "#f4d28d",
    "#f78a74",
    "#abef97",
    "#f9f17a",
  ];

  const participantLength = messageData?.participants?.length;

  function truncateText(text: any, maxLength: any = 80) {
    if (!text || text?.length <= 0) {
      return "null";
    }
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength - 3) + "...";
    }
  }

  return (
    <div className={MessageComponentStyle.container}>
      <div className={MessageComponentStyle.innerContainer}>
        <div className="col-4">
          {messageData?.participants?.map((elem: any, index: number) => (
            <div
              key={index}
              className={`mx-4 mt-2 ${MessageComponentStyle.circle}`}
              style={{
                backgroundColor: `${color[participantLength - 1 - index]}`,
                left: `${(participantLength - 1 - index) * 10}px`,
              }}
            >
              {index === participantLength - 1 && (
                <span
                  title={elem.firstName + " " + elem.lastName}
                  className={MessageComponentStyle.innerText}
                >
                  {" "}
                  {elem.firstName.charAt(0).toUpperCase() +
                    " " +
                    elem.lastName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="col-8">
          <div className={`${MessageComponentStyle.nameStyle} m-2`}>
            {messageData?.participants[0]?.firstName &&
            messageData?.participants[0]?.lastName
              ? messageData.participants.length > 1
                ? `${messageData.participants[0].firstName} ${
                    messageData.participants[0].lastName
                  } + ${messageData.participants.length - 1} Others`
                : `${messageData.participants[0].firstName} ${messageData.participants[0].lastName}`
              : null}
          </div>
          <div className={`${MessageComponentStyle.messageStyle} mx-4`}>
            {truncateText(
              messageData?.messages[messageData?.messages?.length - 1]?.message
            )}
          </div>
        </div>
      </div>
      <div className={`mx-4 ${MessageComponentStyle.messageStyle}`}>
        {messageData?.participants?.length} People
      </div>
      <div className={`col-12 px-2 mt-1 ${MessageComponentStyle.dateTime}`}>
        {convertToCurrentTimezone(
          messageData?.messages[messageData?.messages?.length - 1]?.createDate,
          "DD MMM YY, hh:mm A"
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
