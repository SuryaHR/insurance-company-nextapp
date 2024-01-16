import React from "react";
import { useState } from "react";
import ConversationModalStyle from "./ConversationModal.module.scss";
import clsx from "clsx";
import { GrAttachment } from "react-icons/gr";
import { IoSendSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const ConversationModal = () => {
  const [docs, setDocs] = useState<string[]>([]);

  const handleUpload = (event: any) => {
    const selectedImageArr: any[] = [];
    const imageUrl = event.target.files[0]?.name;
    selectedImageArr.push(imageUrl);
    setDocs((prev: any) => [...prev, ...selectedImageArr]);
    event.target.value = null;
  };

  const handleDeleteImage = (index: number) => {
    const docArray = docs.filter((elem, ind) => {
      if (ind !== index) {
        return elem;
      }
    });
    setDocs([...docArray]);
  };

  const handleAnchorTagClick = () => {
    document.getElementById("inp")?.click();
  };

  return (
    <div>
      <div className={clsx(ConversationModalStyle.chatContainer)}></div>
      <form>
        <div className={clsx(ConversationModalStyle.inputContainer)}>
          <div className={clsx(ConversationModalStyle.inputBox)}>
            <textarea
              id="conversationText"
              className={clsx(ConversationModalStyle.textAreaStyle)}
              placeholder="your messages here..."
            />
          </div>
          <div className={clsx(ConversationModalStyle.attachmentIcon)}>
            <GrAttachment size={"25px"} onClick={handleAnchorTagClick} />
            <input
              type="file"
              id="inp"
              className={clsx(ConversationModalStyle.fileInputStyle)}
              multiple
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleUpload}
            ></input>
          </div>
          <div className={clsx(ConversationModalStyle.sendIcon)}>
            <IoSendSharp size={"25px"} />
          </div>
        </div>
        <div className={clsx("col-12 row pb-2")}>
          {docs.length > 0 && (
            <div className={clsx(ConversationModalStyle.inputBoxAlign, "col-2")}>
              <label className={ConversationModalStyle.labelStyle}>Attachments</label>
            </div>
          )}
          {docs.map((elem: any, index: number) => (
            <div className="row col-4" key={index}>
              <div className={clsx(ConversationModalStyle.clipped, "col")}>{elem}</div>
              <div className="col p-0">
                <IoClose
                  className={clsx(ConversationModalStyle.iconColor)}
                  onClick={() => handleDeleteImage(index)}
                />
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};
//comment
export default ConversationModal;
