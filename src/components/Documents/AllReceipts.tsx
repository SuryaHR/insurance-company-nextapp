import React, { useState, useRef } from "react";
import clsx from "clsx";
import { MdAddCircle } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import ImagePreviewModal from "../AddItemModal/ImagePreviewModal/index";
import { IoClose } from "react-icons/io5";
import AttachementPreview from "../AddItemModal/AttachementPreview/index";
import document from "./documents.module.scss";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { IconContext } from "react-icons";
import useTranslation from "@/hooks/useTranslation";
import { claimDocumentsTranslateType } from "@/translations/claimDocumentsTranslate/en";
import ConfirmModal from "../common/ConfirmModal/ConfirmModal";
import GenericButton from "../common/GenericButton/index";

interface MyObject {
  imgType: string;
  url: string;
}
export default function AllReceipts() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imagePreviewType, setImagePreviewType] = useState("");
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [docs, setDocs] = useState<string[]>([]);

  const [zoomLevel, setZoomLevel] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    translate,
    loading,
  }: { translate: claimDocumentsTranslateType | undefined; loading: boolean } =
    useTranslation("claimDocumentsTranslate");
  console.log("transalte", translate);
  if (loading) {
    return null;
  }
  const handleUpload = (event: any) => {
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    let selectedImageArr: any[];
    if (event.target.files[0].type == "application/pdf") {
      const newObj: MyObject = {
        imgType: "pdf",
        url: imageUrl,
      };
      selectedImageArr = [newObj];
    } else {
      const newObj: MyObject = {
        imgType: "jpg",
        url: imageUrl,
      };
      selectedImageArr = [newObj];
    }
    setDocs((prev: any) => [...prev, ...selectedImageArr]);
    event.target.value = null;
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDeleteImage = (index: number) => {
    const docArray = docs.filter((elem, ind) => {
      if (ind !== index) {
        return elem;
      }
    });
    setDocs([...docArray]);
    setShow(false);
  };
  const handleDeleteImages = () => {
    setShowModal(true);
  };

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 5);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel - 5);
  };

  const handleZoomMid = () => {
    setZoomLevel(100);
  };

  const openModal = (url: string, imageType: string) => {
    setImagePreviewType(imageType);
    setImagePreviewUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    setShow(true);
    setShowModal(false);

    dispatch(
      addNotification({
        message: "Document(s) uploaded successfully",
        id: "save_image",
        status: "success",
      })
    );
  };
  console.log("hii", show);
  const handleGetData = (index: number) => {
    const docArray = docs.filter((elem, ind) => {
      if (ind !== index) {
        return elem;
      }
    });
    setDocs([...docArray]);
    setShow(false);
    dispatch(
      addNotification({
        message: "Attachment is successfully deleted",
        id: "delet_image",
        status: "success",
      })
    );
  };

  return (
    <div className={document.mainDiv}>
      <div className="col-md-12 col-xs-12 mt-3 p-1">
        <div
          className={clsx("col-xs-12 caption font-gray-sharp", document.SubHeadingDiv)}
        >
          <span> {translate?.allReceipts ?? ""}</span>
        </div>
        <div className="row">
          <div className="col-lg-10">
            <button className={document.button}>
              <label
                onClick={() => fileInputRef?.current && fileInputRef?.current?.click()}
              >
                <MdAddCircle className={document.circleButton} />
                <span className={document.newDocument}>
                  {translate?.addNewDocument ?? ""}
                </span>{" "}
              </label>

              <input
                type="file"
                id="inp"
                multiple
                ref={fileInputRef}
                className={document.inputFile}
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleUpload}
              ></input>
            </button>
            <div className="row">
              {/* <div className="col-lg-3" /> */}

              {docs?.length === 0 && (
                <div className={clsx(document.contentCenter, "row p-3")}></div>
              )}
              {docs?.map((elem: any, index: number) =>
                elem.imgType == "pdf" ? (
                  <>
                    <div className="col-2 m-2" key={index}>
                      <div
                        className={document.frame}
                        onClick={() => handleDeleteImage(index)}
                      >
                        {" "}
                        <IconContext.Provider value={{ className: document.closeButton }}>
                          <IoClose />
                        </IconContext.Provider>
                        {/* <IoClose className={document.closeButton} /> */}
                      </div>
                      <div>
                        <iframe
                          key={index} // Add a unique key for each element
                          src={elem.url}
                          className={document.image}
                        />
                      </div>

                      <div>
                        <a
                          className={document.textEllipsis}
                          onClick={() => openModal(elem.url, elem.imgType)}
                          key={index}
                        >
                          {elem.url}
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {show ? (
                      <>
                        <div key={index}>
                          <button
                            className={document.closeIcons}
                            onClick={() => handleDeleteImages()}
                          >
                            {" "}
                            <IconContext.Provider value={{ className: document.ioClose }}>
                              <IoClose />
                            </IconContext.Provider>
                          </button>
                          <div>
                            <div>
                              <img
                                key={index} // Add a unique key for each element
                                src={elem.url}
                                alt={`Image ${index}`} // Add alt text for accessibility
                                className={document.image}
                              />
                            </div>
                            {showModal ? (
                              <div>
                                <ConfirmModal
                                  showConfirmation={true}
                                  closeHandler={handleClose}
                                  submitBtnText={translate?.yes ?? ""}
                                  closeBtnText={translate?.no ?? ""}
                                  childComp={translate?.deleteMessage ?? ""}
                                  // descText="This policyholder email already exists! Do you want to prepopulate the data? Please Confirm!"
                                  modalHeading={translate?.delete ?? ""}
                                  submitHandler={() => handleGetData(index)}
                                />
                              </div>
                            ) : (
                              ""
                            )}
                            <div>
                              <a
                                className={clsx("col", document.textEllipsis1)}
                                onClick={() => openModal(elem.url, elem.imgType)}
                                key={index}
                              >
                                {elem.url}
                              </a>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={clsx("col-lg-8", document.attachmentBox)}
                          key={index}
                        >
                          <button
                            className={document.closeIcon}
                            onClick={() => handleDeleteImage(index)}
                          >
                            {" "}
                            <IconContext.Provider value={{ className: document.ioClose }}>
                              <IoClose />
                            </IconContext.Provider>{" "}
                          </button>
                          <div className="row">
                            <div className="col-lg-2">
                              <img
                                key={index} // Add a unique key for each element
                                src={elem.url}
                                alt={`Image ${index}`} // Add alt text for accessibility
                                className={document.image}
                              />
                            </div>
                            <div className={clsx("col-lg-8", document.text)}>
                              <a
                                className={clsx("col", document.textEllipsis)}
                                onClick={() => openModal(elem.url, elem.imgType)}
                                key={index}
                              >
                                {elem.url}
                              </a>
                              <textarea
                                placeholder="Add a Note"
                                className={document.textArea}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={clsx("col-lg-4 ", document.uploadNewDocument)}>
                          <span className={document.uploadText}>
                            {translate?.uploadNewDocuments ?? ""}
                          </span>
                          <div className="row">
                            <div className="col-lg-2">
                              <GenericButton
                                // className={document.save}
                                onClick={() => handleSave()}
                                label={translate?.save ?? ""}
                                theme="linkBtn"
                              />
                            </div>
                            <div className="col-lg-2">
                              <GenericButton
                                // className={document.cancel}
                                onClick={() => handleDeleteImage(index)}
                                label={translate?.cancel ?? ""}
                                theme="linkBtn"
                              ></GenericButton>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )
              )}
            </div>
            <div>
              <ImagePreviewModal
                isOpen={isModalOpen}
                onClose={closeModal}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleZoomMid={handleZoomMid}
                childComp={
                  <AttachementPreview
                    url={imagePreviewUrl}
                    imgType={imagePreviewType}
                    zoomLevel={zoomLevel}
                  />
                }
                modalClassName={true}
                headingName={"Image preview model"}
              ></ImagePreviewModal>
            </div>
          </div>
          {show ? (
            ""
          ) : (
            <div className={clsx("col-lg-2", document.noAvailable)}>
              <div className={document.noDocumentText}>
                <CgDanger className={document.danger} />
                <span className={document.documentAavailable}>
                  {translate?.noDocumentAvailable ?? ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
