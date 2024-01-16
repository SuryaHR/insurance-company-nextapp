"use client";
import clsx from "clsx";
import GenericInput from "@/components/common/GenericInput";
import addClaimFormStyle from "./addClaimForm.module.scss";
import GenericSelect from "@/components/common/GenericSelect";
import Tooltip from "@/components/common/ToolTip";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { ImCross } from "react-icons/im";
// import { OptionTypedList } from "@/hooks/useSelectOption";
import { Controller } from "react-hook-form";
import AttachementPreview from "./AttachementPreview";
import ImagePreviewModal from "./ImagePreviewModal";
import { ConnectedProps, connect } from "react-redux";
import { addNewRoom } from "@/services/AddItemContentService";
import GenericTextArea from "../common/GenericTextArea/index";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { useParams } from "next/navigation";
import {
  getClaimItemRoom,
  getSubCategories,
} from "@/services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { addSubcategories } from "@/reducers/ClaimDetail/ClaimDetailSlice";
import { RiArrowLeftCircleFill } from "react-icons/ri";
import { RiArrowRightCircleFill } from "react-icons/ri";
import {
  getPreviousItem,
  getNextItem,
  updateContentItem,
} from "@/services/AddItemContentService";
import { addItemModalTranslateType } from "@/translations/addItemModalTranslate/en";
import useTranslation from "@/hooks/useTranslation";
interface typeProps {
  [key: string | number]: any;
}
const AddItemModalForm: React.FC<connectorType & typeProps> = (props: any) => {
  const {
    editItem,
    nextItem,
    previousItem,
    category,
    subCategory,
    condition,
    originallyPurchasedFrom,
    roomType,
    room,
    addNotification,
    addSubcategories,

    setSelectedFile,
    setDeletedFile,
    setapplyTaxState,
    SetScheduledItemState,
    docs,
    setDocs,
    register,
    control,
    setValue,
    errors,
    isScheduledItemState,
    applyTaxState,
    handleSubmit,
    editItemDetail,
    submitFormData,
  } = props;

  const { translate }: { translate: addItemModalTranslateType | undefined } =
    useTranslation("addItemModalTranslate");

  const { claimId }: { claimId: string } = useParams();
  const claimNumber = sessionStorage.getItem("claimNumber") ?? "";
  const [newRetailerInputField, setNewRetailerInputField] = useState(false);
  const [newRoomInputField, setNewRoomInputField] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imagePreviewType, setImagePreviewType] = useState("");
  const [showSubCat, setShowSubCategory] = useState(false);
  const [roomName, setRoomName] = useState<React.SetStateAction<string>>();
  const [roomTypeSelected, setRoomTypeSelected] = useState<React.SetStateAction<any>>();

  const [zoomLevel, setZoomLevel] = useState(100);

  const onTaxOptionChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setapplyTaxState(e.target.value);
  };

  const onScheduleItemChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    SetScheduledItemState(e.target.value);
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

  const closePreviewModal = () => {
    setIsModalOpen(false);
  };

  const addRoom = () => {
    setNewRoomInputField(!newRoomInputField);
    setRoomName("");
    setRoomTypeSelected(null);
  };

  const handleNewRoomCreation = async () => {
    const param = {
      claim: {
        claimNumber: claimNumber,
      },
      roomType: roomTypeSelected,
      roomName: roomName,
    };
    const res = await addNewRoom(param);
    if (res?.status === 200) {
      addNotification({
        message: "New Room Created",
        id: "room_created",
        status: "success",
      });
      await getClaimItemRoom(claimId, true);
    } else {
      addNotification({
        message: res.message ?? "Something went wrong.",
        id: "room_creation_failure",
        status: "error",
      });
    }
  };
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
            filePurpose: "ITEM",
            imgType: file.type === "application/pdf" ? "pdf" : "jpeg",
            url: imageUrl,
          };

          setDocs((prev: any) => [...prev, newObj]);
          selectedFiles.push(file);
        }
      }

      setSelectedFile((prev: any) => [...prev, ...selectedFiles]);
    }
    event.target.value = null;
  };

  const handleDeleteImage = (
    index: number,
    fileNameToDelete: string,
    id: number,
    imageUID: string
  ) => {
    if (id) {
      const payload = { id, imageUID };
      setDeletedFile((prev: any) => [...prev, payload]);
    }
    const docArray = docs.filter((elem: any, ind: number) => {
      if (ind !== index) {
        return elem;
      }
    });
    setDocs([...docArray]);
    setSelectedFile((prevFiles: any[]) => {
      const updatedFiles = prevFiles.filter((file) => file.name !== fileNameToDelete);
      return updatedFiles;
    });
  };
  const handleCategoryChange = async (val: any) => {
    const param = {
      categoryId: val?.categoryId ?? null,
    };
    const subcategoryListRes: any = await getSubCategories(param, true);

    addSubcategories(subcategoryListRes?.data);
    if (val) {
      setShowSubCategory(true);
    } else {
      setShowSubCategory(false);
    }
  };

  const openRetailerInputBox = () => {
    setValue("addRetailer", null);
    setNewRetailerInputField(!newRetailerInputField);
  };

  const handleUpdateAndNext = async (data: any) => {
    const formData = await submitFormData(data);
    const updateItemRes = await updateContentItem(formData);

    if (updateItemRes?.status === 200) {
      if (nextItem) {
        getNextItem(editItemDetail.itemId);
      }
      addNotification({
        message: "Item Updated Successfully",
        id: "update_content_item_success",
        status: "success",
      });
    } else {
      addNotification({
        message: updateItemRes.message ?? "Something went wrong.",
        id: "update_content_item_failure",
        status: "error",
      });
    }
  };
  const handleUpdateAndPrevious = async (data: any) => {
    const formData = await submitFormData(data);
    const updateItemRes = await updateContentItem(formData);

    if (updateItemRes?.status === 200) {
      if (previousItem) {
        getPreviousItem(editItemDetail.itemId);
      }
      addNotification({
        message: "Item Updated Successfully",
        id: "update_content_item_success",
        status: "success",
      });
    } else {
      addNotification({
        message: updateItemRes.message ?? "Something went wrong.",
        id: "update_content_item_failure",
        status: "error",
      });
    }
  };
  return (
    <div className={addClaimFormStyle.addItemContainer}>
      <form>
        <div className={addClaimFormStyle.containerScroll}>
          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <span style={{ color: "red" }}>*</span>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.inputFields?.ItemDescription?.label}
              </label>
            </div>
            <div className="col-8">
              <GenericTextArea
                showError={errors["description"]}
                errorMsg={errors?.description?.message}
                id="description"
                placeholder="Description"
                {...register("description")}
              />
            </div>
          </div>
          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {" "}
                {translate?.inputFields?.quantity?.label}
              </label>
            </div>
            <div className="row col-8 p-0">
              <div className="row col-4 p-0">
                <GenericInput
                  formControlClassname={addClaimFormStyle.inputBox}
                  showError={errors["quantity"]}
                  errorMsg={errors?.quantity?.message}
                  placeholder={translate?.inputFields?.quantity?.placeholder}
                  id="quantity"
                  autoComplete="off"
                  {...register("quantity")}
                  type={"number"}
                  inputFieldClassname="hideInputArrow"
                />
              </div>
              <div className={clsx("row col-4 p-0", addClaimFormStyle.inputBoxAlign)}>
                <label className={addClaimFormStyle.labelStyle}>
                  {translate?.inputFields?.price?.label}
                </label>
              </div>
              <div className="row col-4 p-0">
                <GenericInput
                  formControlClassname={addClaimFormStyle.inputBox}
                  showError={errors["insuredPrice"]}
                  errorMsg={errors?.insuredPrice?.message}
                  autoComplete="off"
                  placeholder={translate?.inputFields?.price?.placeholder}
                  id="insuredPrice"
                  {...register("insuredPrice")}
                  type={"number"}
                  inputFieldClassname="hideInputArrow"
                />
              </div>
            </div>
          </div>
          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.inputFields?.category?.label}
              </label>
            </div>
            <div className={clsx("row col-8 p-0", addClaimFormStyle.centerAlign)}>
              <div className={clsx("row col-4 p-0", addClaimFormStyle.centerAlign)}>
                <div className="col-10">
                  <Controller
                    control={control}
                    name="category"
                    render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                      <GenericSelect
                        options={category}
                        name="category"
                        getOptionLabel={(option: { categoryName: any }) =>
                          option.categoryName
                        }
                        getOptionValue={(option: { categoryId: any }) =>
                          option.categoryId
                        }
                        onChange={(e: any) => {
                          fieldOnChange(e);
                          handleCategoryChange(e);
                        }}
                        {...rest}
                      />
                    )}
                  />
                </div>
                <div className="col-2 p-0">
                  <Tooltip text="This is a tooltip!" />
                </div>
              </div>
              <div className={clsx("col-4", addClaimFormStyle.inputBoxAlign)}>
                <label className={addClaimFormStyle.labelStyle}>
                  {translate?.inputFields?.subCategory?.label}
                </label>
              </div>
              <div className={clsx("row col-4 p-0", addClaimFormStyle.centerAlign)}>
                <div className="col-10">
                  <Controller
                    control={control}
                    name={"subCategory"}
                    render={({ field: { ...rest } }: any) => (
                      <GenericSelect
                        placeholder={""}
                        options={showSubCat ? subCategory : []}
                        name={"subCategory"}
                        getOptionLabel={(option: { name: string }) => option.name}
                        getOptionValue={(option: { id: number }) => option.id}
                        showLabel={false}
                        {...rest}
                      />
                    )}
                  />
                </div>
                <div className="col-2">
                  <Tooltip text="tooltip!" />
                </div>
              </div>
            </div>
          </div>

          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.inputFields?.age?.label}
              </label>
            </div>
            <div className="row col-6">
              <div className="col-3 p-0">
                <GenericInput
                  formControlClassname={addClaimFormStyle.inputBox}
                  showError={errors["ageYears"]}
                  errorMsg={errors?.ageYears?.message}
                  placeholder={translate?.inputFields?.years?.placeholder}
                  id="ageYears"
                  type="number"
                  inputFieldClassname="hideInputArrow"
                  {...register("ageYears")}
                />
              </div>
              <div className="col-2">
                <span className={addClaimFormStyle.labelStyle}>
                  {translate?.inputFields?.years?.label}
                </span>
              </div>
              <div className="col-3 p-0">
                <GenericInput
                  formControlClassname={addClaimFormStyle.inputBox}
                  showError={errors["ageMonths"]}
                  errorMsg={errors?.ageMonths?.message}
                  placeholder={translate?.inputFields?.months?.placeholder}
                  id="ageMonths"
                  type="number"
                  inputFieldClassname="hideInputArrow"
                  {...register("ageMonths")}
                />
              </div>
              <div className="col-2">
                <span className={addClaimFormStyle.labelStyle}>
                  {translate?.inputFields?.months?.label}
                </span>
              </div>
            </div>
          </div>
          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.inputFields?.room?.label}
              </label>
            </div>
            <div className="row col-8 p-0">
              <div className="col-4">
                <Controller
                  control={control}
                  name={"room"}
                  rules={{ required: true }}
                  render={({ field: { ...rest } }: any) => (
                    <GenericSelect
                      placeholder={""}
                      options={room}
                      getOptionLabel={(option: { roomName: any }) => option.roomName}
                      getOptionValue={(option: { id: any }) => option.id}
                      name={"room"}
                      showLabel={false}
                      {...rest}
                    />
                  )}
                />
              </div>
              {newRoomInputField && (
                <div className="col-4">
                  <a onClick={addRoom}>{translate?.inputFields?.room?.newRoom}</a>
                </div>
              )}
              {!newRoomInputField && (
                <div className="col-4">
                  <div className={clsx(addClaimFormStyle.margin, "row")}>
                    <div className="col-10">
                      <GenericInput
                        formControlClassname={addClaimFormStyle.inputBox}
                        placeholder={translate?.inputFields?.room?.roomNameLabel}
                        id="roomName"
                        type="text"
                        value={roomName}
                        onChange={(e: {
                          target: { value: React.SetStateAction<string> };
                        }) => {
                          setRoomName(e.target.value);
                        }}
                      />
                    </div>
                    <div className={clsx("col-2")}>
                      <a className={addClaimFormStyle.cancelLink} onClick={addRoom}>
                        {translate?.inputFields?.room?.cancelBtn}
                      </a>
                    </div>
                  </div>
                  <div className={clsx(addClaimFormStyle.margin, "row")}>
                    <div className="col-10">
                      <Controller
                        control={control}
                        name={"room"}
                        render={({
                          field: { onChange: fieldOnChange, ...rest },
                        }: any) => (
                          <GenericSelect
                            placeholder={translate?.inputFields?.room?.roomTypeLabel}
                            options={roomType}
                            getOptionLabel={(option: { name: string }) => option.name}
                            getOptionValue={(option: { id: number }) => option.id}
                            name={"room"}
                            showLabel={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              fieldOnChange(e);
                              setRoomTypeSelected(e);
                            }}
                            {...rest}
                          />
                        )}
                      />
                    </div>
                    <div className="col-2">
                      <a
                        className={addClaimFormStyle.pointerCursor}
                        onClick={handleNewRoomCreation}
                      >
                        {translate?.inputFields?.room?.createBtn}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.inputFields?.applyTaxes?.label}
              </label>
            </div>
            <div className="row col-8">
              <div className={clsx(addClaimFormStyle.radioButtonWrapper, "col-4")}>
                <GenericInput
                  type="radio"
                  formControlClassname={addClaimFormStyle.formControl}
                  inputFieldWrapperClassName={addClaimFormStyle.wrapper}
                  inputFieldClassname={addClaimFormStyle.inputField}
                  value="yes"
                  label={translate?.inputFields?.applyTaxes?.yesBtn}
                  name="applyTax"
                  labelClassname={addClaimFormStyle.labelClassname}
                  checked={applyTaxState === "yes"}
                  onChange={onTaxOptionChange}
                />
                <GenericInput
                  type="radio"
                  formControlClassname={addClaimFormStyle.formControl1}
                  inputFieldWrapperClassName={addClaimFormStyle.wrapper1}
                  inputFieldClassname={addClaimFormStyle.inputField1}
                  value="no"
                  label={translate?.inputFields?.applyTaxes?.noBtn}
                  labelClassname={addClaimFormStyle.labelClassname}
                  checked={applyTaxState === "no"}
                  name="applyTax"
                  onChange={onTaxOptionChange}
                />
              </div>

              <div className={clsx("col-4", addClaimFormStyle.inputBoxAlign)}>
                <label className={addClaimFormStyle.labelStyle}>
                  {translate?.inputFields?.condition?.label}
                </label>
              </div>
              <div className="col-4">
                <Controller
                  control={control}
                  name={"condition"}
                  render={({ field: { ...rest } }: any) => (
                    <GenericSelect
                      placeholder={translate?.inputFields?.condition?.placeholder}
                      options={condition}
                      name={"condition"}
                      getOptionLabel={(option: { conditionName: any }) =>
                        option.conditionName
                      }
                      getOptionValue={(option: { conditionId: any }) =>
                        option.conditionId
                      }
                      showLabel={false}
                      {...rest}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.inputFields?.purchasedFrom?.label}
              </label>
            </div>
            <div className={clsx("row col-9", addClaimFormStyle.centerAlign)}>
              <div className="col-3 p-0">
                <Controller
                  control={control}
                  name={"originallyPurchasedFrom"}
                  render={({ field: { ...rest } }: any) => (
                    <GenericSelect
                      placeholder={""}
                      name={"originallyPurchasedFrom"}
                      options={originallyPurchasedFrom}
                      getOptionLabel={(option: { name: string }) => option.name}
                      getOptionValue={(option: { id: number }) => option.id}
                      showLabel={false}
                      isSearchable={true}
                      {...rest}
                    />
                  )}
                />
              </div>
              <div className="row col-6">
                {!newRetailerInputField && (
                  <a
                    className={addClaimFormStyle.pointerCursor}
                    onClick={openRetailerInputBox}
                  >
                    {translate?.inputFields?.purchasedFrom?.newRetailerLink}
                  </a>
                )}
                {newRetailerInputField && (
                  <div className="row col-10">
                    <div className="col-10 p-0">
                      <GenericInput
                        formControlClassname={addClaimFormStyle.inputBox}
                        placeholder={
                          translate?.inputFields?.purchasedFrom?.addRetailerPlaceholder
                        }
                        id="addRetailer"
                        {...register("addRetailer")}
                      />
                    </div>

                    <div
                      className={clsx(addClaimFormStyle.centerAlignCrossIcon, "col-2")}
                    >
                      <ImCross onClick={openRetailerInputBox} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.inputFields?.scheduledItem?.label}
              </label>
            </div>
            <div className={clsx(addClaimFormStyle.centerAlign, "row col-8")}>
              <div className={clsx(addClaimFormStyle.radioButtonWrapper, "col-4")}>
                <GenericInput
                  type="radio"
                  formControlClassname={addClaimFormStyle.formControl}
                  inputFieldWrapperClassName={addClaimFormStyle.wrapper}
                  inputFieldClassname={addClaimFormStyle.inputField}
                  value="yes"
                  name="isScheduledItem"
                  id="isScheduledItem-yes"
                  label={translate?.inputFields?.scheduledItem?.yesBtn}
                  labelClassname={addClaimFormStyle.labelClassname}
                  checked={isScheduledItemState === "yes"}
                  onChange={onScheduleItemChange}
                />
                <GenericInput
                  type="radio"
                  formControlClassname={addClaimFormStyle.formControl1}
                  inputFieldWrapperClassName={addClaimFormStyle.wrapper1}
                  inputFieldClassname={addClaimFormStyle.inputField1}
                  value="no"
                  name="isScheduledItem"
                  id="isScheduledItem-no"
                  label={translate?.inputFields?.scheduledItem?.noBtn}
                  labelClassname={addClaimFormStyle.labelClassname}
                  checked={isScheduledItemState === "no"}
                  onChange={onScheduleItemChange}
                />
              </div>

              {isScheduledItemState === "yes" && (
                <>
                  <div className={clsx("col-4 p-0", addClaimFormStyle.inputBoxAlign)}>
                    <span style={{ color: "red" }}>*</span>
                    <label className={addClaimFormStyle.labelStyle}>
                      {translate?.inputFields?.scheduledItem?.amount}
                    </label>
                  </div>

                  <div className="row col-4 p-0">
                    <GenericInput
                      formControlClassname={addClaimFormStyle.inputBox}
                      showError={errors["scheduleAmount"]}
                      errorMsg={errors?.scheduleAmount?.message}
                      autoComplete="off"
                      placeholder={
                        translate?.inputFields?.scheduledItem?.amountPlaceholder
                      }
                      id="scheduleAmount"
                      // label="Price"
                      {...register("scheduleAmount")}
                      type={"number"}
                      inputFieldClassname="hideInputArrow"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="row col-3 m-2"></div>
          <div
            className="row col-3 m-2"
            style={{ height: "25px", justifyContent: "right", alignItems: "center" }}
          >
            <label
              htmlFor="file"
              className={clsx(addClaimFormStyle.labelStyle, "row col-8")}
              style={{
                backgroundColor: "#dddddd",
                color: "#333",
                justifyContent: "right",
                borderRadius: "4px",
                paddingTop: "4px",
                paddingBottom: "4px",
                marginRight: "12px",
                width: "auto",
              }}
            >
              {translate?.inputFields?.addAttachmentBtn}
            </label>
            <input
              type="file"
              id="file"
              multiple
              style={{ display: "none" }}
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleUpload}
            ></input>
          </div>

          <div className={clsx(addClaimFormStyle.attachmentBox, "row")}>
            {docs?.length === 0 && (
              <div className={clsx(addClaimFormStyle.contentCenter, "row p-3")}>
                {translate?.inputFields?.saveAndAddAnotherItemLink}
              </div>
            )}
            {docs?.map((elem: any, index: number) =>
              elem.imgType == "pdf" ? (
                <div className="col-2 m-2" key={index}>
                  <div
                    style={{ position: "relative", left: "100px" }}
                    onClick={() =>
                      handleDeleteImage(index, docs.name, elem?.id, elem?.imageUID)
                    }
                  >
                    {" "}
                    <IoClose style={{ color: "#f20707" }} />
                  </div>
                  <div onClick={() => openModal(elem.url, elem.imgType)}>
                    <iframe
                      key={index}
                      src={elem.url}
                      style={{
                        display: "inline-block",
                        objectFit: "cover",
                        height: "100px",
                        aspectRatio: 400 / 400,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <div>
                    <a
                      className={addClaimFormStyle.textEllipsis}
                      onClick={() => openModal(elem.url, elem.imgType)}
                      key={index}
                    >
                      {elem.url}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="col-2 m-2" key={index}>
                  <div
                    style={{ position: "relative", left: "100px" }}
                    onClick={() =>
                      handleDeleteImage(index, docs.name, elem?.id, elem?.imageUID)
                    }
                  >
                    {" "}
                    <IoClose style={{ color: "#f20707" }} />
                  </div>
                  <div>
                    <img
                      onClick={() => openModal(elem.url, elem.imgType)}
                      key={index}
                      src={elem.url}
                      alt={`Image ${index}`}
                      style={{
                        display: "inline-block",
                        objectFit: "cover",
                        height: "100px",
                        aspectRatio: 400 / 400,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <a
                    className={addClaimFormStyle.textEllipsis}
                    onClick={() => openModal(elem.url, elem.imgType)}
                    key={index}
                  >
                    {elem.url}
                  </a>
                </div>
              )
            )}
          </div>
          <div className="col-8">
            <ImagePreviewModal
              isOpen={isModalOpen}
              onClose={closePreviewModal}
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
        {editItem && (
          <div className={addClaimFormStyle.arrowContainer}>
            <div
              className={clsx({
                [addClaimFormStyle.arrowLeft]: true,
                [addClaimFormStyle.leftDisable]: !previousItem,
              })}
              onClick={handleSubmit(handleUpdateAndPrevious)}
            >
              <RiArrowLeftCircleFill size="50px" fill={previousItem ? "black" : "grey"} />
            </div>
            <div
              className={clsx({
                [addClaimFormStyle.arrowRight]: true,
                [addClaimFormStyle.rightDisable]: !nextItem,
              })}
              onClick={handleSubmit(handleUpdateAndNext)}
            >
              {" "}
              <RiArrowRightCircleFill size="50px" fill={nextItem ? "black" : "grey"} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = ({ claimContentdata, claimDetail }: any) => ({
  category: claimDetail.category,
  subCategory: claimDetail.subCategory,
  condition: claimDetail.condition,
  originallyPurchasedFrom: claimDetail.retailer,
  room: claimDetail.room,
  roomType: claimDetail.roomType,
  previousItem: claimContentdata.previousItem,
  nextItem: claimContentdata.nextItem,
});
const mapDispatchToProps = {
  addNotification,
  addSubcategories,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AddItemModalForm);
