import React from "react";
import { useState } from "react";
import ConversationModalStyle from "./ConversationModal.module.scss";
import clsx from "clsx";
import { GrAttachment } from "react-icons/gr";
import { IoSendSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import useCustomForm from "@/hooks/useCustomForm";
import { Output, minLength, object, string } from "valibot";
import Image from "next/image";
import { DOC_IMAGE, EXCEL_IMAGE, NO_IMAGE, PDF_IMAGE } from "@/constants/constants";
import PreviewMedia from "../../common/PreviewMedia";
import GenericTextArea from "../GenericTextArea";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

const ConversationModalForm = (props: any) => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const { commentsList, handleConversarionSubmit, id, setSelectedFile } = props;
  const [docs, setDocs] = useState<string[]>([]);
  const [isOpenModalMedia, setIsOpenModalMedia] = useState<boolean>(false);
  const [prevSelected, setPrevSelected] = useState<any>();

  const handleModalMedia = () => setIsOpenModalMedia((prev: any) => !prev);

  function getFileExtension(filename: string) {
    const extension =
      filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
    return extension;
  }
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

  const handleUpload = (event: any) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const nameExists = docs.some((item: any) => item.fileName.includes(file.name));

        if (!nameExists) {
          const imageUrl = URL.createObjectURL(file);
          const newObj = {
            fileName: file.name,
            fileType: file.type,
            extension: getFileExtension(file.name),
            filePurpose: "NOTE",
            url: imageUrl,
            latitude: null,
            longitude: null,
          };
          setDocs((prev: any) => [...prev, newObj]);
          selectedFiles.push(file);
        }
      }
      setSelectedFile((prev: any) => [...prev, ...selectedFiles]);
    }
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

  const schema = object({
    comment: string([minLength(1, "Please Enter Check number")]),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useCustomForm(schema);

  const onSubmit = (data: Output<typeof schema>) => {
    handleConversarionSubmit({ ...data, docs });
    setDocs([]);
    setValue("comment", "");
  };

  const getFileUrl = (img: any) => {
    const fileName = img?.name;
    if (/\.(pdf|PDF)$/i.test(fileName)) {
      return PDF_IMAGE;
    } else if (/\.(docx|doc)$/i.test(fileName)) {
      return DOC_IMAGE;
    } else if (/\.(xls|xlsx)$/i.test(fileName)) {
      return EXCEL_IMAGE;
    } else if (/\.(jpe?g|png|gif|bmp)$/i.test(fileName)) {
      return img?.url;
    }
    return NO_IMAGE;
  };

  const ConverstionList = () => {
    return (
      <div className="row">
        {commentsList &&
          commentsList.map((item: any, index: any) => (
            <div
              key={item.id}
              className={clsx(
                "col-12  row p-0",
                {
                  "flex-row-reverse": parseInt(id) === parseInt(item.commentedBy.id),
                },
                ConversationModalStyle.dropDownInnerDiv
              )}
            >
              <div
                className={clsx(
                  "col-10  d-flex",
                  {
                    "flex-row-reverse": parseInt(id) === parseInt(item.commentedBy.id),
                  },
                  ConversationModalStyle.dropDownInnerDiv
                )}
              >
                <div>
                  <span
                    className={ConversationModalStyle.msg_avatars}
                    style={{ backgroundColor: color[index] }}
                  >
                    {item?.commentedBy.firstName.charAt(0).toUpperCase() +
                      " " +
                      item.commentedBy?.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={ConversationModalStyle.convartionText}>
                  <div
                    className={clsx({
                      [ConversationModalStyle.received_msg]:
                        parseInt(id) !== parseInt(item.commentedBy.id),
                      [ConversationModalStyle.sent_msg]:
                        parseInt(id) === parseInt(item.commentedBy.id),
                    })}
                  >
                    {item?.comment}
                  </div>
                  <span className={ConversationModalStyle.time_date}>
                    {item.commentedBy?.firstName.charAt(0).toUpperCase() +
                      item.commentedBy.firstName.substr(1).toLowerCase() +
                      " " +
                      item.commentedBy.lastName.charAt(0).toUpperCase() +
                      item.commentedBy?.lastName.substr(1).toLowerCase()}
                    {item?.commentedDate}
                  </span>
                  <div className="d-flex mb-2 flex-wrap justify-content-end">
                    {item?.images &&
                      item?.images.length > 0 &&
                      item?.images.map((imgItem: any) => {
                        return (
                          <div
                            key={imgItem?.id}
                            className={ConversationModalStyle.imgResponsive}
                            onClick={() => {
                              setPrevSelected(imgItem);
                              handleModalMedia();
                            }}
                          >
                            <Image
                              src={getFileUrl(imgItem)}
                              alt={`Image ${imgItem.name}`}
                              width={70}
                              height={70}
                            />
                            <div className={ConversationModalStyle.imageName}>
                              {imgItem.name}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={clsx(ConversationModalStyle.chatContainer)}>
        <ConverstionList />
      </div>
      <div className={clsx(ConversationModalStyle.inputContainer)}>
        <div className={clsx(ConversationModalStyle.inputBox)}>
          <GenericTextArea
            showError={errors["comment"]}
            errorMsg={errors?.comment?.message}
            id="description"
            placeholder={
              translate?.addItemModalTranslate?.conversationModal?.conversationPlaceholder
            }
            {...register("comment")}
            fieldClassname={ConversationModalStyle.textAreaStyle}
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
          />
        </div>
        <div
          onClick={() => handleSubmit(onSubmit)}
          className={clsx(ConversationModalStyle.sendIcon)}
        >
          <button className={ConversationModalStyle.iconBtn}>
            <IoSendSharp size={"25px"} />
          </button>
        </div>
      </div>
      <div className={clsx("col-12 row pb-2")}>
        {docs.length > 0 && (
          <div className={clsx(ConversationModalStyle.inputBoxAlign, "col-2")}>
            <label className={ConversationModalStyle.labelStyle}>
              {translate?.addItemModalTranslate?.conversationModal?.attachments}
            </label>
          </div>
        )}
        {docs &&
          docs.length > 0 &&
          docs.map((elem: any, index: number) => (
            <div className="row col-4" key={index}>
              <div className={clsx(ConversationModalStyle.clipped, "col")}>
                {elem.fileName}
              </div>
              <div className="col p-0">
                <IoClose
                  className={clsx(ConversationModalStyle.iconColor)}
                  onClick={() => handleDeleteImage(index)}
                />
              </div>
            </div>
          ))}
      </div>
      <PreviewMedia
        isOpen={isOpenModalMedia}
        onClose={handleModalMedia}
        prevSelected={prevSelected}
        showDelete
      />
    </form>
  );
};
//comment
export default ConversationModalForm;
