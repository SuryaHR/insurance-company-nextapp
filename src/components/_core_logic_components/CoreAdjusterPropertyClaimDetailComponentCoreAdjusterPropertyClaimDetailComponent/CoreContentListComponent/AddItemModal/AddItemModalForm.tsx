"use client";
import clsx from "clsx";
import addClaimFormStyle from "./addClaimForm.module.scss";
import GenericSelect from "@/components/common/GenericSelect";
import Tooltip from "@/components/common/ToolTip";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { Controller } from "react-hook-form";
import { ConnectedProps, connect } from "react-redux";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { RiArrowLeftCircleFill } from "react-icons/ri";
import { RiArrowRightCircleFill } from "react-icons/ri";
import {
  addRoom,
  addSubcategories,
} from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { newClaimTransalateProp } from "@/app/[lang]/(adjuster)/new-claim/page";
import ImagePreviewModal from "@/components/common/PreviewMedia/ImagePreviewModal";
import AttachementPreview from "@/components/common/PreviewMedia/AttachementPreview";
import { unknownObjectType } from "@/constants/customTypes";
import excelImg from "@/assets/images/excel-img.png";
import pdfImg from "@/assets/images/pdf-img.png";
import docImg from "@/assets/images/word-img.png";
import unKnownImg from "@/assets/images/unknown.png";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";
import GenericCurrencyFormat from "@/components/common/GenericInput/GenericCurrencyFormat";
import {
  addNewRoom,
  fetchClaimContentItemDetails,
  getClaimItemRoom,
  getSubCategories,
  updateContentItem,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";
import { addEditItemDetail } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import CustomLoader from "@/components/common/CustomLoader";
import GenericTextArea from "@/components/common/GenericTextArea";
import Image from "next/image";

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
    contentData,
    addRoom,
    loaderAddItem,
    addEditItemDetail,
    token,
    claimNumber,
    claimId,
  } = props;

  const { translate } =
    useContext<TranslateContextData<newClaimTransalateProp>>(TranslateContext);

  const [newRetailerInputField, setNewRetailerInputField] = useState(false);
  const [newRoomInputField, setNewRoomInputField] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubCat, setShowSubCategory] = useState(false);
  const [roomName, setRoomName] = useState<React.SetStateAction<any>>();
  const [roomTypeSelected, setRoomTypeSelected] = useState<React.SetStateAction<any>>();
  const [previewFile, setPreviewFile] = useState<unknownObjectType | null>(null);

  const [zoomLevel, setZoomLevel] = useState(100);

  const onTaxOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setapplyTaxState(e.target.value);
  };

  const onScheduleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const openModal = (data: any) => {
    setPreviewFile(data);
    setIsModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
  };

  const addRoomHandler = () => {
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
    const res = await addNewRoom(param, token);
    if (res?.status === 200) {
      addNotification({
        message: "New Room Created",
        id: "room_created",
        status: "success",
      });
      const claimRoomRes: any = await getClaimItemRoom(claimId, token);
      addRoom(claimRoomRes?.data);
    } else {
      addNotification({
        message: res.message ?? "Something went wrong.",
        id: "room_creation_failure",
        status: "error",
      });
    }
    addRoomHandler();
  };
  const handleUpload = (event: any) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.substr(file.name.lastIndexOf("."));
        const nameExists = docs.some((item: any) => item.fileName.includes(file.name));

        if (!nameExists) {
          const imageUrl = URL.createObjectURL(file);

          const newObj = {
            fileName: file.name,
            extension: fileExtension,
            fileType: file.type,
            filePurpose: "ITEM",
            imgType: fileExtension,
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
    const subcategoryListRes: any = await getSubCategories(param, token);

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

  const getPreviousItem = async (itemId: number, contentData: any) => {
    const claimContentListData = contentData;

    const itemIndex = claimContentListData.findIndex((item: any) => {
      if (item.id === itemId) {
        return true;
      }
    });
    const currentItemId: {
      id: number;
    } = claimContentListData[itemIndex - 1];

    const payload = {
      forEdit: true,
      itemId: currentItemId.id,
    };

    const restult = await fetchClaimContentItemDetails(payload, contentData, token);
    addEditItemDetail(restult);
  };
  const getNextItem = async (itemId: number, contentData: any) => {
    const claimContentListData = contentData;

    const itemIndex = await claimContentListData.findIndex((item: any) => {
      if (item.id === itemId) {
        return true;
      }
    });
    const currentItemId: {
      id: number;
    } = claimContentListData[itemIndex + 1];

    const payload = {
      forEdit: true,
      itemId: currentItemId.id,
    };

    const restult = await fetchClaimContentItemDetails(payload, contentData, token);
    addEditItemDetail(restult);
  };
  const handleUpdateAndNext = async (data: any) => {
    const formData = await submitFormData(data);
    const updateItemRes = await updateContentItem(formData, token);

    if (updateItemRes?.status === 200) {
      if (nextItem) {
        getNextItem(editItemDetail.itemId, contentData);
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
        getPreviousItem(editItemDetail.itemId, contentData);
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
  const rooms =
    room.map((item: any) => {
      return { id: item.id, name: item?.roomName };
    }) || [];

  return (
    <div className={addClaimFormStyle.addItemContainer}>
      {loaderAddItem && <CustomLoader loaderType="spinner1" />}
      <form>
        <div className={addClaimFormStyle.containerScroll}>
          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <span style={{ color: "red" }}>*</span>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.addItemModalTranslate?.inputFields?.ItemDescription?.label}
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
                {translate?.addItemModalTranslate?.inputFields?.quantity?.label}
              </label>
            </div>
            <div className="row col-8 p-0">
              <div className="row col-4 p-0">
                <GenericUseFormInput
                  formControlClassname={addClaimFormStyle.inputBox}
                  showError={errors["quantity"]}
                  errorMsg={errors?.quantity?.message}
                  placeholder={
                    translate?.addItemModalTranslate?.inputFields?.quantity?.placeholder
                  }
                  id="quantity"
                  autoComplete="off"
                  {...register("quantity")}
                  type={"number"}
                  inputFieldClassname="hideInputArrow"
                />
              </div>
              <div className={clsx("row col-4 p-0", addClaimFormStyle.inputBoxAlign)}>
                <label className={addClaimFormStyle.labelStyle}>
                  {translate?.addItemModalTranslate?.inputFields?.price?.label}
                </label>
              </div>
              <div className="row col-4 p-0">
                <Controller
                  name="insuredPrice"
                  control={control}
                  render={({ field: { onChange: insuredPriceChange } }) => (
                    <GenericCurrencyFormat
                      handleChange={({ value }) => {
                        insuredPriceChange(value);
                      }}
                      id="insuredPrice"
                      errorMsg={errors?.insuredPrice?.message}
                      showError={errors["insuredPrice"]}
                      defaultValue={editItemDetail?.insuredPrice}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.addItemModalTranslate?.inputFields?.category?.label}
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
                        isModalPopUp={true}
                        {...rest}
                      />
                    )}
                  />
                </div>
                <div className="col-2 p-0">
                  <Tooltip
                    className={addClaimFormStyle.infoIconContainer}
                    text="Select a Category"
                  />
                </div>
              </div>
              <div className={clsx("col-4", addClaimFormStyle.inputBoxAlign)}>
                <label className={addClaimFormStyle.labelStyle}>
                  {translate?.addItemModalTranslate?.inputFields?.subCategory?.label}
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
                        isModalPopUp={true}
                        {...rest}
                      />
                    )}
                  />
                </div>
                <div className="col-2">
                  <Tooltip
                    className={addClaimFormStyle.infoIconContainer}
                    textClassName={addClaimFormStyle.textClassName}
                    text="Select a Sub Category"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.addItemModalTranslate?.inputFields?.age?.label}
              </label>
            </div>
            <div className="row col-6">
              <div className="col-3 p-0">
                <GenericUseFormInput
                  formControlClassname={addClaimFormStyle.inputBox}
                  showError={errors["ageYears"]}
                  errorMsg={errors?.ageYears?.message}
                  placeholder={
                    translate?.addItemModalTranslate?.inputFields?.years?.placeholder
                  }
                  id="ageYears"
                  type="number"
                  inputFieldClassname="hideInputArrow"
                  {...register("ageYears")}
                />
              </div>
              <div className="col-2">
                <span className={addClaimFormStyle.labelStyle}>
                  {translate?.addItemModalTranslate?.inputFields?.years?.label}
                </span>
              </div>
              <div className="col-3 p-0">
                <GenericUseFormInput
                  formControlClassname={addClaimFormStyle.inputBox}
                  showError={errors["ageMonths"]}
                  errorMsg={errors?.ageMonths?.message}
                  placeholder={
                    translate?.addItemModalTranslate?.inputFields?.months?.placeholder
                  }
                  id="ageMonths"
                  type="number"
                  inputFieldClassname="hideInputArrow"
                  {...register("ageMonths")}
                />
              </div>
              <div className="col-2">
                <span className={addClaimFormStyle.labelStyle}>
                  {translate?.addItemModalTranslate?.inputFields?.months?.label}
                </span>
              </div>
            </div>
          </div>
          <div className="row m-2">
            <div className={clsx("col-3", addClaimFormStyle.inputBoxAlign)}>
              <label className={addClaimFormStyle.labelStyle}>
                {translate?.addItemModalTranslate?.inputFields?.room?.label}
              </label>
            </div>
            <div className="row col-8 p-0">
              <div className="col-4">
                <Controller
                  control={control}
                  name={"room"}
                  rules={{ required: true }}
                  render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                    <GenericSelect
                      placeholder={""}
                      options={rooms}
                      getOptionLabel={(option: { name: string }) => option.name}
                      getOptionValue={(option: { id: any }) => option.id}
                      name={"room"}
                      showLabel={false}
                      isModalPopUp={true}
                      {...rest}
                      onChange={(e: any) => fieldOnChange(e)}
                    />
                  )}
                />
              </div>
              {newRoomInputField && (
                <div className="col-4">
                  <a onClick={addRoomHandler}>
                    {translate?.addItemModalTranslate?.inputFields?.room?.newRoom}
                  </a>
                </div>
              )}
              {!newRoomInputField && (
                <div className="col-6">
                  <div className={clsx(addClaimFormStyle.margin, "row")}>
                    <div className="col-8">
                      <GenericNormalInput
                        formControlClassname={addClaimFormStyle.inputBox}
                        placeholder={
                          translate?.addItemModalTranslate?.inputFields?.room
                            ?.roomNameLabel
                        }
                        id="roomName"
                        type="text"
                        value={roomName}
                        onChange={(e: any) => {
                          setRoomName(e.target.value);
                        }}
                      />
                    </div>
                    <div className={clsx("col-4")}>
                      <a
                        className={addClaimFormStyle.cancelLink}
                        onClick={addRoomHandler}
                      >
                        {translate?.addItemModalTranslate?.inputFields?.room?.cancelBtn}
                      </a>
                    </div>
                  </div>
                  <div className={clsx(addClaimFormStyle.margin, "row")}>
                    <div className="col-8">
                      <Controller
                        control={control}
                        name={"room"}
                        render={({
                          field: { onChange: fieldOnChange, ...rest },
                        }: any) => (
                          <GenericSelect
                            placeholder={
                              translate?.addItemModalTranslate?.inputFields?.room
                                ?.roomTypeLabel
                            }
                            options={roomType}
                            getOptionLabel={(option: { name: string }) => option.name}
                            getOptionValue={(option: { id: number }) => option.id}
                            name={"room"}
                            customStyles={{ placeholder: { fontSize: "13px" } }}
                            showLabel={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              fieldOnChange(e);
                              setRoomTypeSelected(e);
                            }}
                            isModalPopUp={true}
                            {...rest}
                          />
                        )}
                      />
                    </div>
                    <div className="col-4">
                      <a
                        className={addClaimFormStyle.pointerCursor}
                        onClick={handleNewRoomCreation}
                      >
                        {translate?.addItemModalTranslate?.inputFields?.room?.createBtn}
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
                {translate?.addItemModalTranslate?.inputFields?.applyTaxes?.label}
              </label>
            </div>
            <div className="row col-8">
              <div className={clsx(addClaimFormStyle.radioButtonWrapper, "col-4")}>
                <GenericNormalInput
                  type="radio"
                  formControlClassname={addClaimFormStyle.formControl}
                  inputFieldWrapperClassName={addClaimFormStyle.wrapper}
                  inputFieldClassname={addClaimFormStyle.inputField}
                  value="yes"
                  label={
                    translate?.addItemModalTranslate?.inputFields?.applyTaxes?.yesBtn
                  }
                  name="applyTax"
                  labelClassname={addClaimFormStyle.labelClassname}
                  checked={applyTaxState === "yes"}
                  onChange={onTaxOptionChange}
                />
                <GenericNormalInput
                  type="radio"
                  formControlClassname={addClaimFormStyle.formControl1}
                  inputFieldWrapperClassName={addClaimFormStyle.wrapper1}
                  inputFieldClassname={addClaimFormStyle.inputField1}
                  value="no"
                  label={translate?.addItemModalTranslate?.inputFields?.applyTaxes?.noBtn}
                  labelClassname={addClaimFormStyle.labelClassname}
                  checked={applyTaxState === "no"}
                  name="applyTax"
                  onChange={onTaxOptionChange}
                />
              </div>

              <div className={clsx("col-4", addClaimFormStyle.inputBoxAlign)}>
                <label className={addClaimFormStyle.labelStyle}>
                  {translate?.addItemModalTranslate?.inputFields?.condition?.label}
                </label>
              </div>
              <div className="col-4">
                <Controller
                  control={control}
                  name={"condition"}
                  render={({ field: { ...rest } }: any) => (
                    <GenericSelect
                      placeholder={
                        translate?.addItemModalTranslate?.inputFields?.condition
                          ?.placeholder
                      }
                      options={condition}
                      name={"condition"}
                      getOptionLabel={(option: { conditionName: any }) =>
                        option.conditionName
                      }
                      getOptionValue={(option: { conditionId: any }) =>
                        option.conditionId
                      }
                      showLabel={false}
                      isModalPopUp={true}
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
                {translate?.addItemModalTranslate?.inputFields?.purchasedFrom?.label}
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
                      isModalPopUp={true}
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
                    {
                      translate?.addItemModalTranslate?.inputFields?.purchasedFrom
                        ?.newRetailerLink
                    }
                  </a>
                )}
                {newRetailerInputField && (
                  <div className="row col-10">
                    <div className="col-10 p-0">
                      <GenericUseFormInput
                        formControlClassname={addClaimFormStyle.inputBox}
                        placeholder={
                          translate?.addItemModalTranslate?.inputFields?.purchasedFrom
                            ?.addRetailerPlaceholder
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
                {translate?.addItemModalTranslate?.inputFields?.scheduledItem?.label}
              </label>
            </div>
            <div className={clsx(addClaimFormStyle.centerAlign, "row col-8")}>
              <div className={clsx(addClaimFormStyle.radioButtonWrapper, "col-4")}>
                <GenericNormalInput
                  type="radio"
                  formControlClassname={addClaimFormStyle.formControl}
                  inputFieldWrapperClassName={addClaimFormStyle.wrapper}
                  inputFieldClassname={addClaimFormStyle.inputField}
                  value="yes"
                  name="isScheduledItem"
                  id="isScheduledItem-yes"
                  label={
                    translate?.addItemModalTranslate?.inputFields?.scheduledItem?.yesBtn
                  }
                  labelClassname={addClaimFormStyle.labelClassname}
                  checked={isScheduledItemState === "yes"}
                  onChange={onScheduleItemChange}
                />
                <GenericNormalInput
                  type="radio"
                  formControlClassname={addClaimFormStyle.formControl1}
                  inputFieldWrapperClassName={addClaimFormStyle.wrapper1}
                  inputFieldClassname={addClaimFormStyle.inputField1}
                  value="no"
                  name="isScheduledItem"
                  id="isScheduledItem-no"
                  label={
                    translate?.addItemModalTranslate?.inputFields?.scheduledItem?.noBtn
                  }
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
                      {
                        translate?.addItemModalTranslate?.inputFields?.scheduledItem
                          ?.amount
                      }
                    </label>
                  </div>

                  <div className="row col-4 p-0">
                    <GenericUseFormInput
                      formControlClassname={addClaimFormStyle.inputBox}
                      showError={errors["scheduleAmount"]}
                      errorMsg={errors?.scheduleAmount?.message}
                      autoComplete="off"
                      placeholder={
                        translate?.addItemModalTranslate?.inputFields?.scheduledItem
                          ?.amountPlaceholder
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
              {translate?.addItemModalTranslate?.inputFields?.addAttachmentBtn}
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
                {translate?.addItemModalTranslate?.inputFields?.saveAndAddAnotherItemLink}
              </div>
            )}
            {docs?.map((elem: any, index: number) => {
              const fileExtension = elem.imgType;
              let placeHolderImg: any = "";
              if (fileExtension.includes("xlsx") || fileExtension.includes("xls")) {
                placeHolderImg = excelImg.src;
              } else if (fileExtension.includes("pdf")) {
                placeHolderImg = pdfImg.src;
              } else if (
                fileExtension.includes("doc") ||
                fileExtension.includes("docx")
              ) {
                placeHolderImg = docImg.src;
              } else if (
                fileExtension.includes("jpg") ||
                fileExtension.includes("jpeg") ||
                fileExtension.includes("png")
              ) {
                placeHolderImg = elem.url;
              } else {
                placeHolderImg = unKnownImg.src;
              }
              return (
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
                    <Image
                      onClick={() => openModal(elem)}
                      key={index}
                      src={placeHolderImg}
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
                    onClick={() => openModal(elem)}
                    key={index}
                  >
                    {elem.fileName}
                  </a>
                </div>
              );
            })}
          </div>
          <div className="col-8">
            <ImagePreviewModal
              isOpen={isModalOpen}
              onClose={closePreviewModal}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleZoomMid={handleZoomMid}
              prevSelected={previewFile}
              showDelete={false}
              childComp={
                <AttachementPreview prevSelected={previewFile} zoomLevel={zoomLevel} />
              }
              modalClassName={true}
              headingName={
                translate?.addItemModalTranslate?.inputFields?.imagePreviewModal
              }
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

const mapStateToProps = ({ claimContentdata, claimDetail, commonData }: any) => ({
  category: commonData.category,
  subCategory: commonData.subCategory,
  condition: commonData.condition,
  originallyPurchasedFrom: commonData.retailer,
  room: commonData.room,
  roomType: claimDetail.roomType,
  previousItem: claimContentdata.previousItem,
  nextItem: claimContentdata.nextItem,
});
const mapDispatchToProps = {
  addNotification,
  addSubcategories,
  addRoom,
  addEditItemDetail,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AddItemModalForm);
