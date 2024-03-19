"use-client";
import clsx from "clsx";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import modalStyle from "./AddNewMessageModalComponent.module.scss";
import GenericSelect from "@/components/common/GenericSelect";
import GenericButton from "@/components/common/GenericButton";
import { IoClose } from "react-icons/io5";
import useCustomForm from "@/hooks/useCustomForm";
import GenericTextArea from "@/components/common/GenericTextArea";
import { object, string, minLength, Output, array } from "valibot";
import { Controller } from "react-hook-form";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

interface AddNewMsgModalComponentProps {
  handleOpenModal: () => void;
  handleMessageSubmit: (data: any) => void;
  claimId: string | null;
  participants: { label: string; value: string }[];
  defaultValue?: { label: string; value: string }[];
}
const AddNewMsgModalComponent: React.FC<AddNewMsgModalComponentProps> = (props: any) => {
  const { handleOpenModal, participants, defaultValue } = props;
  const [files, setFiles] = useState<any[]>([]);
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const schema = object({
    participants: array(
      object({
        label: string(),
        value: string(),
      }),
      translate?.claimDetailsTabTranslate?.addMessageCard?.addNewMessageModal
        ?.errorMessages?.receipentErr
    ),
    message: string([
      minLength(
        1,
        translate?.claimDetailsTabTranslate?.addMessageCard?.addNewMessageModal
          ?.errorMessages?.messageFieldsErr
      ),
    ]),
  });

  const { register, handleSubmit, formState, control, setValue } = useCustomForm(schema);

  useEffect(() => {
    if (defaultValue) setValue("participants", defaultValue);
  }, [defaultValue, setValue]);

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
        console.log("file", file);
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
    props.handleMessageSubmit({ ...data, files });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleMessageSubmit)}>
        <div className={clsx(modalStyle.upperContainer, "p-2")}>
          <div className="row col-12 m-2">
            <div className={clsx(modalStyle.inputBoxAlign, "col-2")}>
              <label className={modalStyle.labelStyle}>
                {
                  translate?.claimDetailsTabTranslate?.addMessageCard?.addNewMessageModal
                    ?.to?.label
                }
              </label>
            </div>
            <div className="col-10">
              <Controller
                control={control}
                name="participants"
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                  <GenericSelect
                    options={participants}
                    placeholder={
                      translate?.claimDetailsTabTranslate?.addMessageCard
                        ?.addNewMessageModal?.to?.placeholder
                    }
                    isMulti={true}
                    showError={errors["participants"]}
                    errorMsg={errors?.participants?.message}
                    onChange={(e: any) => {
                      e && e.length ? fieldOnChange(e) : fieldOnChange(null);
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
            <div className={clsx(modalStyle.inputBoxAlign, "col-2")}>
              <label className={modalStyle.labelStyle}>
                {
                  translate?.claimDetailsTabTranslate?.addMessageCard?.addNewMessageModal
                    ?.message?.label
                }
              </label>
            </div>
            <div className="col-10">
              <GenericTextArea
                showError={errors["message"]}
                errorMsg={errors?.message?.message}
                id="message"
                placeholder={
                  translate?.claimDetailsTabTranslate?.addMessageCard?.addNewMessageModal
                    ?.message?.placeholder
                }
                {...register("message")}
              />
            </div>
          </div>

          <div className="row col-12 m-2">
            <div className={clsx(modalStyle.inputBoxAlign, "col-2")}>
              <label className={modalStyle.labelStyle}>
                {
                  translate?.claimDetailsTabTranslate?.addMessageCard?.addNewMessageModal
                    ?.attachment?.label
                }
              </label>
            </div>
            <div className="col-10">
              <span>
                <a onClick={handleAnchorTagClick}>
                  {
                    translate?.claimDetailsTabTranslate?.addMessageCard
                      ?.addNewMessageModal?.attachment?.linkName
                  }
                </a>
              </span>
              <input
                type="file"
                id="inp"
                className={clsx(modalStyle.fileInputStyle)}
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleUpload}
              ></input>
            </div>
          </div>
          <div className="col-12 row my-2">
            {files.map((elem: any, index: number) => (
              <div className="row col-6" key={index}>
                <div className={clsx(modalStyle.clipped, "col")}>{elem.name}</div>
                <div className="col p-0">
                  <IoClose
                    className={clsx(modalStyle.iconColor)}
                    onClick={() => handleDeleteImage(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={clsx(modalStyle.alignRight, "row col-12 mt-2")}>
          <div className={"row col-7"}>
            <div className={clsx("row col-6", modalStyle.centerAlign)}>
              <GenericButton
                label={
                  translate?.claimDetailsTabTranslate?.addMessageCard?.addNewMessageModal
                    ?.cancelBtn
                }
                size="medium"
                onClick={handleOpenModal}
              />
            </div>
            <div className="row col-6">
              <GenericButton
                label={
                  translate?.claimDetailsTabTranslate?.addMessageCard?.addNewMessageModal
                    ?.addMsgBtn
                }
                type="submit"
                size="medium"
                disabled={!formState.isValid}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddNewMsgModalComponent;
