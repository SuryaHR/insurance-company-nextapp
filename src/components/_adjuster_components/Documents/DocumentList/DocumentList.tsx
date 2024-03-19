import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { MdAddCircle } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import document from "../documents.module.scss";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { IconContext } from "react-icons";
import styles from "../documents.module.scss";
import { convertToCurrentTimezone } from "@/utils/helper";
import excelImg from "@/assets/images/excel-img.png";
import pdfImg from "@/assets/images/pdf-img.png";
import docImg from "@/assets/images/word-img.png";
import unKnownImg from "@/assets/images/unknown.png";
import Modal from "@/components/common/ModalPopups";
import DeleteAttachment from "../DeleteAttachments/DeleteAttachments";
import { CgDanger } from "react-icons/cg";
import GenericButton from "@/components/common/GenericButton";
import { uploadDocuments } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import Image from "next/image";
import ImagePreviewModal from "@/components/common/PreviewMedia/ImagePreviewModal";
import AttachementPreview from "@/components/common/PreviewMedia/AttachementPreview";
import { unknownObjectType } from "@/constants/customTypes";

interface DocumentListProps {
  docData: any;
  removeLoader: () => void;
  addLoader: () => void;
  init: () => void;
  filePurpose: any;
  noDocMessage?: any;
  titleHead: any;
  allowOnlyDocType?: any;
  translate?: any;
}

const DocumentList: React.FC<DocumentListProps> = ({
  docData,
  titleHead,
  noDocMessage,
  filePurpose,
  addLoader,
  removeLoader,
  init,
  allowOnlyDocType,
  translate,
}) => {
  const dispatch = useAppDispatch();
  const [isConfirmShow, setIsConfirmShow] = useState(false);
  const [docDataToDelete, setDocDataToDelete] = useState("");
  const [docs, setDocs] = useState<string[]>(docData?.attachments);
  const [uploadDocs, setUploadDocs] = useState<any>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevProps = useRef();
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<unknownObjectType | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    if (prevProps.current !== docData) {
      setDocs(docData?.attachments);
    }
  }, [docData]);

  const openConfirmModal = () => {
    setIsConfirmShow(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmShow(false);
  };

  const closePreviewModal = () => {
    setShowFilePreviewModal(false);
    setPreviewFile(null);
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

  const openModal = (file: unknownObjectType) => {
    setPreviewFile(file);
    setShowFilePreviewModal(true);
  };

  const handleUpload = (event: any) => {
    const fileList: any = event.target.files;
    const updatedUploadDocs = Array.from(fileList).map((element: any) => {
      const ext: any = element?.name.substr(element?.name.lastIndexOf("."));
      let placeHolderImg: any = "";
      switch (true) {
        case ext.includes("xlsx") || ext.includes("xls"):
          placeHolderImg = excelImg.src;
          break;
        case ext.includes("pdf"):
          placeHolderImg = pdfImg.src;
          break;
        case ext.includes("doc") || ext.includes("docx"):
          placeHolderImg = docImg.src;
          break;
        case ext.includes("jpg") || ext.includes("jpeg") || ext.includes("png"):
          placeHolderImg = URL.createObjectURL(element);
          break;
        default:
          placeHolderImg = unKnownImg.src;
          break;
      }
      return {
        url: placeHolderImg,
        name: element?.name,
        fileName: element?.name,
        lastModified: element?.lastModified,
        lastModifiedDate: element?.lastModifiedDate,
        size: element?.size,
        type: element?.type,
        webkitRelativePath: element?.webkitRelativePath,
        file: element,
        extension: element?.name.substr(element?.name.lastIndexOf(".")),
        description: "",
      };
    });

    setUploadDocs((prev: any) => [...prev, ...updatedUploadDocs]);
  };

  const handleDeleteImages = (data: any) => {
    setIsConfirmShow(true);
    setDocDataToDelete(data);
  };

  const handleSave = async () => {
    addLoader();
    const formData = new FormData();
    const fileDetails: any = [];
    formData.append(
      "claimDetail",
      JSON.stringify({ claimNumber: sessionStorage.getItem("claimNumber") })
    );

    try {
      await Promise.all(
        uploadDocs.map(async (ele: any) => {
          const { name, type, extension, file, description } = ele;
          fileDetails.push({
            fileName: name,
            fileType: type,
            extension: extension,
            filePurpose: filePurpose,
            latitude: null,
            longitude: null,
            description: description,
          });
          formData.append("file", file);
        })
      );

      formData.append("filesDetails", JSON.stringify(fileDetails));

      const res = await uploadDocuments(formData);

      if (res.status === 200) {
        dispatch(
          addNotification({
            message: res.message,
            id: "upload_image_success",
            status: "success",
          })
        );
        init();
        setUploadDocs([]);
      } else {
        dispatch(
          addNotification({
            message: res.message,
            id: "upload_image_error",
            status: "error",
          })
        );
      }
    } catch (error) {
      console.error("Error occurred:", error);
      dispatch(
        addNotification({
          message: "An error occurred while uploading documents.",
          id: "upload_image_error",
          status: "error",
        })
      );
    } finally {
      removeLoader();
    }
  };

  const onchangeNote = (e: any) => {
    const updatedUploadDocs: any = uploadDocs;
    updatedUploadDocs[e.target.id].description = e.target.value;
    setUploadDocs(updatedUploadDocs);
  };

  const cancelUploadingAtt = () => {
    setUploadDocs([]);
  };

  const handleRemoveUploadImage = (indexToRemove: any) => {
    const updatedArray = uploadDocs.filter(
      (_: any, index: any) => index !== indexToRemove
    );
    setUploadDocs(updatedArray);
  };

  return (
    <>
      <div>
        <ImagePreviewModal
          isOpen={showFilePreviewModal}
          onClose={closePreviewModal}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleZoomMid={handleZoomMid}
          headingName={previewFile?.name}
          prevSelected={previewFile}
          showDelete={false}
          childComp={
            <AttachementPreview prevSelected={previewFile} zoomLevel={zoomLevel} />
          }
          modalClassName={true}
        ></ImagePreviewModal>
      </div>
      <div className={document.mainDiv}>
        <div className="col-md-12 col-12 mt-3 p-1">
          <div className={clsx("col-12 caption font-gray-sharp", document.SubHeadingDiv)}>
            <span>{`${titleHead} (${docs?.length})`}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">
            <button className={document.button}>
              <label
                onClick={() => fileInputRef?.current && fileInputRef?.current?.click()}
              >
                <MdAddCircle className={document.circleButton} />
                <span className={document.newDocument}>
                  {translate?.claimDocumentsTranslate?.document?.addNewDocument ?? ""}
                </span>{" "}
              </label>

              <input
                type="file"
                id="inp"
                multiple
                ref={fileInputRef}
                accept={allowOnlyDocType || ".png,.jpg,.jpeg,.pdf"}
                onChange={handleUpload}
                className={document.inputFile}
              ></input>
            </button>
          </div>
          <div className="col-md-10 row">
            <div className="col-md-12 row">
              <div className={`col-md-9 row ${styles.uploadAttCont}`}>
                {uploadDocs &&
                  Array.from(uploadDocs).map((elem: any, index: any) => {
                    return (
                      <div key={index} className="col-md-6">
                        <div className={clsx("col-lg-8", document.attachmentBox)}>
                          <button
                            className={document.closeIcon}
                            onClick={() => handleRemoveUploadImage(index)}
                          >
                            {" "}
                            <IconContext.Provider value={{ className: document.ioClose }}>
                              <IoClose />
                            </IconContext.Provider>{" "}
                          </button>
                          <div className="row">
                            <div className="col-lg-3">
                              <Image
                                key={index}
                                src={elem.url}
                                alt={`Image ${index}`}
                                className={`${document.image} ${document.imageMargin}`}
                                width={90}
                                height={90}
                              />
                            </div>
                            <div className={clsx("col-lg-9", document.text)}>
                              <a
                                className={clsx("col", document.textEllipsis)}
                                onClick={() => openModal(elem)}
                                key={index}
                              >
                                {elem.name}
                              </a>
                              <textarea
                                placeholder="Add a Note"
                                rows={7}
                                id={index}
                                onChange={onchangeNote}
                                className={document.textArea}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {Array.from(uploadDocs)?.length !== 0 && (
                <div className={clsx("col-md-3", document.uploadNewDocument)}>
                  <div className={document.udc}>
                    <span className={document.uploadText}>
                      {translate?.claimDocumentsTranslate?.document?.upload +
                        `${Array.from(uploadDocs)?.length}` +
                        translate?.claimDocumentsTranslate?.document?.NewDocuments}
                    </span>
                    <div className={`${document.uploadAction}`}>
                      <GenericButton
                        className={document.save}
                        onClick={() => handleSave()}
                        label={translate?.claimDocumentsTranslate?.document?.save}
                        theme="linkBtn"
                      />
                      <GenericButton
                        className={document.cancel}
                        onClick={() => cancelUploadingAtt()}
                        label={translate?.claimDocumentsTranslate?.document?.cancel}
                        theme="linkBtn"
                      ></GenericButton>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {docs?.length === 0 && (
              <div className={clsx(document.contentCenter, "row p-3")}>
                <div className={clsx("col-lg-4", document.noAvailable)}>
                  <div className={document.noDocumentText}>
                    <CgDanger className={document.danger} />
                    <span className={document.documentAavailable}>
                      {noDocMessage ||
                        translate?.claimDocumentsTranslate?.document?.noDocumentAvailable}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {docs?.map((elem: any, index: number) => {
              const fileExtension = elem.url.substr(elem.url.lastIndexOf("."));
              let placeHolderImg: any = "";
              switch (true) {
                case fileExtension.includes("xlsx") || fileExtension.includes("xls"):
                  placeHolderImg = excelImg.src;
                  break;
                case fileExtension.includes("pdf"):
                  placeHolderImg = pdfImg.src;
                  break;
                case fileExtension.includes("doc") || fileExtension.includes("docx"):
                  placeHolderImg = docImg.src;
                  break;
                case fileExtension.includes("jpg") ||
                  fileExtension.includes("jpeg") ||
                  fileExtension.includes("png"):
                  placeHolderImg = elem.url;
                  break;
                default:
                  placeHolderImg = unKnownImg.src;
                  break;
              }
              return (
                <div className={styles.docListViewCont} key={index}>
                  <button
                    onClick={() => handleDeleteImages(elem)}
                    className={document.closeIcons}
                  >
                    {" "}
                    <IconContext.Provider value={{ className: document.ioClose }}>
                      <IoClose />
                    </IconContext.Provider>
                  </button>
                  <div>
                    <div>
                      <Image
                        key={index}
                        src={placeHolderImg}
                        alt={`Image ${index}`}
                        className={`${document.image} ${document.showImgCls}`}
                        width={90}
                        height={90}
                      />
                    </div>

                    <div>
                      <Modal
                        isOpen={isConfirmShow}
                        onClose={closeConfirmModal}
                        childComp={
                          <DeleteAttachment
                            attachmentData={docDataToDelete}
                            closeConfirmModal={closeConfirmModal}
                            openConfirmModal={openConfirmModal}
                            addLoader={addLoader}
                            removeLoader={removeLoader}
                            init={init}
                            filePurpose={filePurpose}
                          />
                        }
                        headingName={"Delete"}
                        modalWidthClassName={styles.modalWidthForDelete}
                        overlayClassName={styles.overlayClassName}
                      ></Modal>
                    </div>

                    <div>
                      <span className={document.descCont} title={elem.description}>
                        {elem.description}
                      </span>
                      <a
                        title={elem.name}
                        className={clsx("col", document.textEllipsis1)}
                        onClick={() => openModal({ ...elem, fileName: elem.name })}
                        key={index}
                      >
                        {elem.name}
                      </a>
                      <span className={styles.docTimeDate}>
                        {convertToCurrentTimezone(elem.uploadDate, "MMM DD, YYYY h:mm A")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentList;
