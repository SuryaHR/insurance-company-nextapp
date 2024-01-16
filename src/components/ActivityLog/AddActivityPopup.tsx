"use-client";
import clsx from "clsx";
import React from "react";
import { useState } from "react";
import modalStyle from "./AddActivityPopup.module.scss";
import GenericButton from "@/components/common/GenericButton";
import noImg from "@/assets/images/no-image.png";
import { FaTimesCircle } from "react-icons/fa";
import excelImg from "@/assets/images/excel-img.png";
import pdfImg from "@/assets/images/pdf-img.png";
import docImg from "@/assets/images/word-img.png";
import unKnownImg from "@/assets/images/unknown.png";
import { uploadActivityLogData } from "@/services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { connect } from "react-redux";

interface AddActivityPopupProps {
  handleOpenModal: () => void;
  addLoader: () => void;
  removeLoader: () => void;
  translate: any;
  participantsList: any;
}

const AddActivityPopup: React.FC<AddActivityPopupProps> = ({
  handleOpenModal,
  addLoader,
  removeLoader,
  translate,
  participantsList,
}) => {
  const [fileName, setFileName] = useState<string>("...");
  const [prevImg, setPrevImg] = useState<any>(noImg.src);
  const [showMe, setshowMe] = useState<boolean>(false);
  const [showError, setshowError] = useState<boolean>(false);
  const [description, setDescription] = useState<any>("");
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [file, setFile] = useState<any>(null);
  const dispatch = useAppDispatch();
  const handleAnchorTagClick = () => {
    document.getElementById("FileUpload")?.click();
  };

  const handleUpload = (event: any) => {
    setFileName(event.target.files[0]?.name);
    const file = event.target.files[0];
    setFile(file);

    const fileExtension = file.name.substr(file.name.lastIndexOf("."));
    const size = file.size;
    if (
      [".jpeg", ".png", ".jpg", ".xls", ".xlsx", ".pdf", ".doc", ".docx"].includes(
        fileExtension.toLowerCase()
      )
    ) {
      if (size <= 20000000) {
        if (fileExtension.includes("xls") || fileExtension.includes("xlsx")) {
          setPrevImg(excelImg.src);
        } else if (fileExtension.includes("docx") || fileExtension.includes("doc")) {
          setPrevImg(docImg.src);
        } else if (fileExtension.includes("pdf")) {
          setPrevImg(pdfImg.src);
        } else if (
          fileExtension.includes("jpeg") ||
          fileExtension.includes("png") ||
          fileExtension.includes("jpg")
        ) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPrevImg(reader.result);
            setshowMe(true);
          };
          reader.readAsDataURL(file);
        } else {
          setPrevImg(unKnownImg.src);
        }
      } else {
        dispatch(
          addNotification({
            message: translate?.addActivityPopup?.fileSizeError,
            id: "file_size_error",
            status: "error",
          })
        );
      }
    } else {
      dispatch(
        addNotification({
          message: translate?.addActivityPopup?.fileSupportError,
          id: "file_type_error",
          status: "error",
        })
      );
    }
  };

  const handleImageError = () => {
    setPrevImg(noImg.src);
  };

  const removeImage = () => {
    setshowMe(false);
    setPrevImg(noImg.src);
    setFileName("...");
  };

  const handleChange = (event: any) => {
    setDescription(event.target.value);
    if (!event.target.value || event.target.value.trim() === "") {
      setDisabledButton(true);
      setshowError(true);
      return;
    } else if (event.target.value) {
      setDisabledButton(false);
      setshowError(false);
    }
  };

  const handleBlur = () => {
    if (description && description.trim() != "") {
      setshowError(false);
    } else {
      setshowError(true);
    }
  };

  const publishActivity = async () => {
    addLoader();
    const messageReceipient: any = [];
    participantsList.forEach((item: any) => {
      if (
        item.participantType.participantType.toUpperCase() == "EXTERNAL" ||
        item.participantType.participantType.toUpperCase() == "EXISTING VENDOR" ||
        item.participantType.participantType.toUpperCase() == "NEW VENDOR"
      ) {
        messageReceipient.push({
          participantId: item.participantId,
          email: item.emailId,
          participantType: {
            id: item.participantType.id,
            participantType: item.participantType.participantType,
          },
          vendorRegistration: item ? item.vendorRegistration : null,
        });
      } else {
        messageReceipient.push({
          participantId: item.participantId,
          email: item.emailId,
          participantType: {
            id: item.participantType.id,
            participantType: item.participantType.participantType,
          },
        });
      }
    });

    const formData = new FormData();
    formData.append(
      "customActivity",
      JSON.stringify({
        id: null,
        description: description,
        claim: {
          claimId: sessionStorage.getItem("claimId"),
        },
        participants: messageReceipient,
        companyURL: localStorage.getItem("CRN"),
        activityEvent: 4,
      })
    );

    if (file) {
      const fileExtension = file.name.substr(file.name.lastIndexOf("."));
      const fileDetaills = [
        {
          extension: fileExtension,
          fileName: file.name,
          filePurpose: "CUSTOM_ACTIVITY_LOG",
          fileType: file.type,
        },
      ];
      formData.append("filesDetails", JSON.stringify(fileDetaills));
      formData.append("file", file);
    } else {
      formData.append("filesDetails", JSON.stringify([]));
      formData.append("file", JSON.stringify([]));
    }

    const result = await uploadActivityLogData(formData);
    if (result.status == 200) {
      removeLoader();
      dispatch(
        addNotification({
          message: result.message,
          id: "file_upload_success",
          status: "success",
        })
      );
      handleOpenModal();
    } else {
      removeLoader();
      dispatch(
        addNotification({
          message: result.message ?? translate?.addActivityPopup?.fileErrorUpload,
          id: "file_upload_error",
          status: "error",
        })
      );
    }
  };

  return (
    <div>
      <form>
        <div className={clsx(modalStyle.upperContainer, "p-2 row")}>
          <div className="col-4">
            <FaTimesCircle
              className={modalStyle.deleteImageSty}
              onClick={removeImage}
              style={{
                display: showMe ? "block" : "none",
              }}
            />
            <img
              className={modalStyle.noImg}
              src={prevImg}
              alt="Preview"
              style={{ maxWidth: "100%", width: "300px" }}
              onError={handleImageError}
            />
            <h6 className={modalStyle.fileNameSty}>{fileName}</h6>
            <input
              onChange={handleUpload}
              id="FileUpload"
              type="file"
              name="imageUpload"
              style={{ display: "none" }}
              accept="image/*|.pdf|.xls|.xlsx|.docx|.doc"
              placeholder="upload Image"
            />
            <a className={modalStyle.uploadAnchor} onClick={handleAnchorTagClick}>
              {translate?.addActivityPopup?.addAttachment}
            </a>
            &nbsp;
            <div className={modalStyle.infoTextbox}>
              <span>{translate?.addActivityPopup?.helpText}</span>
            </div>
          </div>
          <div className={clsx(modalStyle.descCont, "col-8")}>
            <label htmlFor="desc">
              <span>*</span>
              {translate?.addActivityPopup?.inputField?.title}
            </label>
            <textarea
              className={modalStyle.descField}
              rows={10}
              id="desc"
              value={description}
              onBlur={handleBlur}
              onChange={handleChange}
              cols={20}
              placeholder={translate?.addActivityPopup?.inputField?.placeholder}
            />
            <div style={{ height: "22px" }}>
              <span
                style={{
                  display: showError ? "block" : "none",
                  color: "red",
                  fontSize: "12px",
                }}
              >
                {translate?.addActivityPopup?.inputField?.error}
              </span>
            </div>
          </div>
        </div>

        <div className={clsx(modalStyle.alignRight, "row col-12 mt-2")}>
          <div className={modalStyle.buttonContStyle}>
            <GenericButton
              className={modalStyle.buttonStyle}
              label={translate?.addActivityPopup?.cancelBtn}
              size="medium"
              onClick={handleOpenModal}
            />
            <GenericButton
              disabled={disabledButton}
              className={modalStyle.buttonStyle}
              label={translate?.addActivityPopup?.submitBtn}
              size="medium"
              onClick={publishActivity}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = ({ claimDetail }: any) => ({
  participantsList: claimDetail.participants,
});
const connector = connect(mapStateToProps, {});

export default connector(AddActivityPopup);
