"use-client";
import React from "react";
import { useState } from "react";
import modalStyle from "./AddNewMessageForAllNotesPopup.module.scss";
import GenericSelect from "@/components/common/GenericSelect";
import GenericButton from "@/components/common/GenericButton";
import { IoClose } from "react-icons/io5";
import useCustomForm from "@/hooks/useCustomForm";
import GenericTextArea from "@/components/common/GenericTextArea";
import { object, string, minLength, Output, array, number } from "valibot";
import { Controller } from "react-hook-form";
import CustomLoader from "@/components/common/CustomLoader";

interface AddNewMessageForAllNotesPopupProps {
  handleOpenModal: () => void;
  handleMessageSubmit: (data: any) => void;
  claimId: string | null;
  participants: { label: string; value: string }[];
  defaultValue?: { label: string; value: string }[];
}
const AddNewMessageForAllNotesPopup: React.FC<AddNewMessageForAllNotesPopupProps> = (
  props: any
) => {
  const { handleOpenModal, participants, defaultValue } = props;
  const [disableAddMsgBtn, setDisableAddMsgBtn] = useState<boolean>(true);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const schema = object({
    participants: array(
      object({
        label: string(),
        value: number(),
      }),
      "Select valid participant"
    ),
    message: string([minLength(1, "Enter Valid Message")]),
  });

  const { register, handleSubmit, formState, control } = useCustomForm(schema);

  const { errors } = formState;
  const handleAnchorTagClick = () => {
    document.getElementById("inp")?.click();
  };
  const handleUpload = (event: any) => {
    const filesList = event.target.files;
    if (filesList && filesList.length > 0) {
      const selectedImageArr: File[] = [];
      for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i];
        const nameExists = files.some((item: any) => item.name.includes(file.name));
        !nameExists && selectedImageArr.push(file);
      }

      setFiles((prev: any) => [...prev, ...selectedImageArr]);
    }
    event.target.value = null;
  };
  const handleDeleteImage = (index: number) => {
    const docArray = files.filter((elem, ind) => {
      if (ind !== index) {
        return elem;
      }
    });
    setFiles([...docArray]);
  };
  const handleMessageSubmit = async (data: Output<typeof schema>) => {
    setIsLoader(true);
    props.handleMessageSubmit({ ...data, files });
  };

  return (
    <div>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <form onSubmit={handleSubmit(handleMessageSubmit)}>
        <div className={`${modalStyle.upperContainer} p-2`}>
          <div className="row col-12 m-2">
            <div className={`${modalStyle.inputBoxAlign} col-2`}>
              <label className={modalStyle.labelStyle}>To</label>
            </div>
            <div className="col-10">
              <Controller
                control={control}
                name="participants"
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                  <GenericSelect
                    options={participants}
                    placeholder="Select Participants"
                    isMulti={true}
                    showError={errors["participants"]}
                    errorMsg={errors?.participants?.message}
                    onChange={(e: any) => {
                      if (e.length > 0) {
                        setDisableAddMsgBtn(false);
                      } else {
                        setDisableAddMsgBtn(true);
                      }
                      fieldOnChange(e);
                    }}
                    defaultValue={defaultValue}
                    isModalPopUp={true}
                    {...rest}
                  />
                )}
              />
            </div>
          </div>

          <div className="row col-12 m-2">
            <div className={`${modalStyle.inputBoxAlign} col-2`}>
              <label className={modalStyle.labelStyle}>Message</label>
            </div>
            <div className="col-10">
              <GenericTextArea
                showError={errors["message"]}
                errorMsg={errors?.message?.message}
                id="message"
                placeholder="Message"
                {...register("message")}
              />
            </div>
          </div>

          <div className="row col-12 m-2">
            <div className={`${modalStyle.inputBoxAlign} col-2`}>
              <label className={modalStyle.labelStyle}>Attachment</label>
            </div>
            <div className="col-10">
              <span>
                <a onClick={handleAnchorTagClick}>Click to add attachment</a>
              </span>
              <input
                type="file"
                id="inp"
                className={`${modalStyle.fileInputStyle}`}
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleUpload}
              ></input>
            </div>
          </div>
          <div className="col-12 row my-2">
            {files.map((elem: any, index: number) => (
              <div className="row col-6" key={index}>
                <div className={`${modalStyle.clipped} col`}>{elem.name}</div>
                <div className="col p-0">
                  <IoClose
                    className={`${modalStyle.iconColor}`}
                    onClick={() => handleDeleteImage(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${modalStyle.alignRight} row col-12 mt-2`}>
          <div className="row col-7">
            <div className={`row col-6 ${modalStyle.centerAlign}`}>
              <GenericButton label="Cancel" size="medium" onClick={handleOpenModal} />
            </div>
            <div className="row col-6">
              <GenericButton
                label="Add Message"
                disabled={disableAddMsgBtn}
                type="submit"
                size="medium"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddNewMessageForAllNotesPopup;
