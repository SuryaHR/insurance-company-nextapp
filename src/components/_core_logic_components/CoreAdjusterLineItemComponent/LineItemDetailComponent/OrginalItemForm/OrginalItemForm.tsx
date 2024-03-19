import React, { useContext, useEffect, useRef, useState } from "react";
import orginalItemFormStyle from "./orginalItemForm.module.scss";
import clsx from "clsx";
import GenericSelect from "@/components/common/GenericSelect";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import {
  fetchSubCategory,
  removeAttachment,
  saveSubCategoryChange,
} from "@/reducers/_core_logic_reducers/LineItemDetail/LineItemThunkService";
import {
  updateLineItem,
  updateOnCategoryChange,
} from "@/reducers/_core_logic_reducers/LineItemDetail/LineItemDetailSlice";
import useDebounce from "@/hooks/useDebounce";
import { unknownObjectType } from "@/constants/customTypes";
import Tooltip from "@/components/common/ToolTip";
import selectAttachment from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectAttachment";
import Image from "next/image";
import {
  PDF_IMAGE,
  EXCEL_IMAGE,
  DOC_IMAGE,
  NO_IMAGE,
  ITEM_STATUS,
} from "@/constants/constants";
import { IoMdCloseCircle } from "react-icons/io";
import Modal from "@/components/common/ModalPopups";
import useBodyScrollbar from "@/hooks/useBodyScrollbar";
import GenericButton from "@/components/common/GenericButton";
import { LineItemContext } from "../../LineItemContext";
import { calculateRCV } from "@/components/_adjuster_components/AdjusterLineItemComponent/helper";
import selectItemCategory from "@/reducers/_core_logic_reducers/LineItemDetail/Selectors/selectItemCategory";
import { getUSDCurrency, parseTranslateString } from "@/utils/utitlity";
import { IoCloseCircle } from "react-icons/io5";
import OriginalItemPreview from "./OriginalItemPreview";
import ImagePreviewModal from "@/components/common/PreviewMedia/ImagePreviewModal";
import AttachementPreview from "@/components/common/PreviewMedia/AttachementPreview";
import { Controller } from "react-hook-form";
import GenericCurrencyFormat, {
  currencyFormatHandlers,
} from "@/components/common/GenericInput/GenericCurrencyFormat";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { lineItemTranslatePropType } from "@/app/[lang]/(core_logic)/(dashboardLayout)/core-logic/core-adjuster-line-item-detail/[claimId]/[itemId]/page";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";

interface propType {
  register: any;
  control: any;
  getValues: any;
  setValue: any;
}

const OrginalItemForm: React.FC<propType & connectorType> = (props) => {
  const {
    lineItem,
    category,
    subCategory,
    condition,
    room,
    retailer,
    paymentTypes,
    register,
    fetchSubCategory,
    updateOnCategoryChange,
    updateLineItem,
    attachment,
    removeAttachment,
    selectedCatgory,
    saveSubCategoryChange,
    control,
  } = props;

  const {
    translate: { lineItemTranslate },
  } = useContext<TranslateContextData<lineItemTranslatePropType>>(TranslateContext);
  const debounce = useDebounce(updateLineItem, 100);
  const [imageDeleteConfirm, setImageDeleteConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<unknownObjectType | null>(null);
  const receiptRef = useRef<null | HTMLInputElement>(null);
  const { hideScroll, showScroll } = useBodyScrollbar();
  const [previewFile, setPreviewFile] = useState<unknownObjectType | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const {
    addFiles,
    files,
    removeFile,
    subCategoryRef: selectRef,
    categoryRef,
    setShowLoader,
    setNewRetail,
    newRetail,
    setShowNewRetail,
    showNewRetail,
    setGiftedFrom,
    giftedFrom,
    setIsPageUpdated,
    isDataUpdated,
  } = useContext(LineItemContext);
  const initRef = useRef(false);

  const insuredPriceRef = useRef<currencyFormatHandlers>(null);
  useEffect(() => {
    if (isDataUpdated) {
      insuredPriceRef?.current?.changeValue(
        getUSDCurrency(lineItem?.insuredPrice).toString()
      );
    }
  }, [isDataUpdated, lineItem?.insuredPrice]);

  useEffect(() => {
    if (lineItem && selectedCatgory?.subCategory && !initRef.current) {
      initRef.current = true;
      const latestLineItem = calculateRCV(lineItem);
      updateLineItem(latestLineItem);
      setGiftedFrom(latestLineItem?.giftedFrom ?? "");
    }
  }, [lineItem, selectedCatgory?.subCategory, updateLineItem, setGiftedFrom]);

  const handleReceiptSelect = (e: React.FocusEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const fileList = Array.from(files || []);
    let isFileInvalid = false;
    for (const file of fileList) {
      if (file.size > 20000000) {
        if (!isFileInvalid) isFileInvalid = true;
        return;
      }
    }
    if (!isFileInvalid) {
      addFiles(fileList);
      setIsPageUpdated(true);
    }
  };

  const hideImageConfirmModal = () => {
    showScroll();
    setImageDeleteConfirm(false);
    setSelectedImage(null);
  };

  const showImageConfirmModal = (img: unknownObjectType) => {
    setImageDeleteConfirm(true);
    hideScroll();
    setSelectedImage(img);
  };

  const handleFileRemove = () => {
    if (selectedImage?.isLocal) {
      removeFile(selectedImage?.name, hideImageConfirmModal);
    } else {
      removeAttachment({ id: selectedImage?.id, callback: hideImageConfirmModal });
    }
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

  const { onChange: quantityOnChange, ...quantityRegister } = register("quantity");
  // const { onChange: insuredPriceOnChange, ...insuredPriceRegister } =
  //   register("insuredPrice");

  const handleApplyTax = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLineItem({ applyTax: e.target.value === "no" ? false : true });
    setIsPageUpdated(true);
  };

  const handleScheduleItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLineItem({ isScheduledItem: e.target.value === "no" ? false : true });
    setIsPageUpdated(true);
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

  const closePreviewModal = () => {
    setShowFilePreviewModal(false);
    setPreviewFile(null);
    showScroll();
  };

  const showFilePreview = (file: unknownObjectType) => {
    setPreviewFile(file);
    setShowFilePreviewModal(true);
    hideScroll();
  };

  return (
    <div className={orginalItemFormStyle.root}>
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
      <Modal
        isOpen={imageDeleteConfirm}
        onClose={hideImageConfirmModal}
        headingName={`Delete ${selectedImage?.name}`}
        titleStyle={orginalItemFormStyle.modalTitleStyle}
        childComp={
          <p className={orginalItemFormStyle.deleteModalMessage}>
            {lineItemTranslate?.originalItem?.attachment?.attachmentConfirmMsg}{" "}
            <strong>{lineItemTranslate?.originalItem?.attachment?.confirmText}</strong>
          </p>
        }
        footerContent={
          <div className={orginalItemFormStyle.deleteModalBtn}>
            <GenericButton
              label="No"
              theme="linkBtn"
              onClickHandler={hideImageConfirmModal}
            />
            <GenericButton label="Yes" size="small" onClickHandler={handleFileRemove} />
          </div>
        }
        positionTop={true}
        animate={true}
        overlayClassName={orginalItemFormStyle.deleteModalOverlay}
      />
      <div className={orginalItemFormStyle.heading}>
        {lineItemTranslate?.originalItem?.heading}
      </div>
      {lineItem.status.status !== ITEM_STATUS.underReview && (
        <div className={orginalItemFormStyle.formContainer}>
          <div
            className={clsx(orginalItemFormStyle.formGroup, orginalItemFormStyle.row1)}
          >
            <label htmlFor="itemDesc" className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.formField?.itemDesc?.label}
            </label>
            <textarea
              id="itemDesc"
              className={orginalItemFormStyle.textarea}
              placeholder={lineItemTranslate?.originalItem?.formField?.itemDesc}
              {...register("description")}
              onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                debounce({ description: e.target.value ?? "" });
                setIsPageUpdated(true);
              }}
            />
          </div>
          <div
            className={clsx(
              orginalItemFormStyle.formGroup,
              orginalItemFormStyle.row1,
              orginalItemFormStyle.categoryDiv
            )}
          >
            <div className={orginalItemFormStyle.categorySelect}>
              <div className={orginalItemFormStyle.formControl}>
                <label htmlFor="category" className={orginalItemFormStyle.label}>
                  {lineItemTranslate?.originalItem?.formField?.category?.label}
                </label>
                <div className={orginalItemFormStyle.formFieldTooltip}>
                  <GenericSelect
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    id="category"
                    value={
                      selectedCatgory?.category
                        ? {
                            categoryId: lineItem?.category?.id,
                            categoryName: lineItem?.category?.name,
                          }
                        : null
                    }
                    options={category}
                    selectRef={categoryRef}
                    getOptionLabel={(option: { categoryName: any }) =>
                      option.categoryName
                    }
                    getOptionValue={(option: { categoryId: any }) => option.categoryId}
                    onChange={(e: {
                      categoryId: number;
                      categoryName: string;
                      noOfItems: number;
                    }) => {
                      if (e !== null) {
                        fetchSubCategory(e.categoryId);
                      }
                      updateOnCategoryChange(e);
                      setIsPageUpdated(true);
                    }}
                  />
                  <Tooltip
                    className={orginalItemFormStyle.infoIconContainer}
                    text={
                      lineItem?.category?.name
                        ? lineItem?.category?.name
                        : lineItemTranslate?.originalItem?.formField?.category?.tooltip
                    }
                  />
                </div>
              </div>
              <div className={orginalItemFormStyle.formControl}>
                <label htmlFor="subCategory" className={orginalItemFormStyle.label}>
                  {lineItemTranslate?.originalItem?.formField?.subCategory?.label}
                </label>
                <div className={orginalItemFormStyle.formFieldTooltip}>
                  <GenericSelect
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    id="subCategory"
                    value={selectedCatgory?.subCategory}
                    options={subCategory}
                    getOptionLabel={(option: { name: string }) => option.name}
                    getOptionValue={(option: { id: number }) => option.id}
                    selectRef={selectRef}
                    onChange={(
                      e: {
                        id: number;
                        name: string;
                      } | null
                    ) => {
                      setShowLoader(true);
                      saveSubCategoryChange({
                        subCategory: e,
                        clbk: () => {
                          setShowLoader(false);
                        },
                      });
                    }}
                  />
                  <Tooltip
                    className={orginalItemFormStyle.infoIconContainer}
                    text={
                      lineItem?.subCategory?.name
                        ? lineItem?.subCategory?.name
                        : lineItemTranslate?.originalItem?.formField?.subCategory?.tooltip
                    }
                  />
                </div>
              </div>
            </div>
            <div className={orginalItemFormStyle.standardReplacement}>
              <div className={orginalItemFormStyle.standardHeading}>
                {lineItemTranslate?.originalItem?.formField?.standardReplace?.label}
              </div>
              {lineItem.standardDescription && (
                <div className={orginalItemFormStyle.standardDesc}>
                  {lineItem.standardDescription}
                </div>
              )}
              <div>
                {getUSDCurrency(
                  lineItem.standardCost != null ? lineItem.standardCost : 0.0
                )}
              </div>
            </div>
          </div>
          <div className={orginalItemFormStyle.formGroup}>
            <label htmlFor="cost_per_unit" className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.formField?.costPerUnit?.label}
            </label>
            <Controller
              name="insuredPrice"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <GenericCurrencyFormat
                    ref={insuredPriceRef}
                    defaultValue={value}
                    labelClassname={orginalItemFormStyle.label}
                    placeholder={
                      lineItemTranslate?.originalItem?.formField?.costPerUnit?.placeholder
                    }
                    handleChange={({ value }) => {
                      onChange(value);
                      debounce({ insuredPrice: +(value ?? 0) });
                      setIsPageUpdated(true);
                    }}
                  />
                );
              }}
            />
          </div>
          <div className={orginalItemFormStyle.formGroup}>
            <label htmlFor="qty_lost" className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.formField?.qty?.label}
            </label>
            <GenericUseFormInput
              id="qty_lost"
              type="number"
              labelClassname={orginalItemFormStyle.label}
              placeholder={lineItemTranslate?.originalItem?.formField?.qty?.placeholder}
              onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                e.target.value = Number.parseInt(e.target.value).toString();
                quantityOnChange(e);
                debounce({ quantity: +(e.target.value ?? 0) });
                setIsPageUpdated(true);
              }}
              isNumberOnly={true}
              {...quantityRegister}
            />
          </div>
          <div className={orginalItemFormStyle.formGroup}>
            <label htmlFor="total_lost" className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.formField?.totalCost?.label}
            </label>
            <GenericUseFormInput
              id="total_cost"
              labelClassname={orginalItemFormStyle.label}
              disabled={true}
              value={getUSDCurrency(lineItem?.totalStatedAmount)}
            />
          </div>
          <div className={clsx(orginalItemFormStyle.itemAge)}>
            <label className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.formField?.itemAge?.label}
            </label>
            <div className={orginalItemFormStyle.itemAgeFormGroup}>
              <GenericUseFormInput
                label={lineItemTranslate?.originalItem?.formField?.itemAge?.yearLabel}
                type="number"
                formControlClassname={orginalItemFormStyle.itemAgeFormControl}
                inputFieldWrapperClassName={orginalItemFormStyle.inputFieldWrapper}
                {...register("ageYears")}
                onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                  debounce({ ageYears: +(e.target.value ? e.target.value : 0) });
                  setIsPageUpdated(true);
                }}
                isNumberOnly={true}
              />
              <GenericUseFormInput
                label={lineItemTranslate?.originalItem?.formField?.itemAge?.monthLabel}
                type="number"
                formControlClassname={orginalItemFormStyle.itemAgeFormControl}
                inputFieldWrapperClassName={orginalItemFormStyle.inputFieldWrapper}
                {...register("ageMonths")}
                onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (+e.target.value > 11) {
                    e.target.value = e.target.value.slice(0, -1);
                  }
                  const month = e.target.value ? e.target.value : 0;
                  debounce({ ageMonths: +month });
                  setIsPageUpdated(true);
                }}
                isNumberOnly={true}
              />
            </div>
          </div>
          <div className={orginalItemFormStyle.tax}>
            <label className={orginalItemFormStyle.label}>
              {parseTranslateString({
                parseString: lineItemTranslate?.originalItem?.formField?.applyTax?.label,
                replaceMapper: { VALUE: lineItem?.taxRate },
              })}
            </label>
            <div className={orginalItemFormStyle.taxFormGroup}>
              <GenericNormalInput
                type="radio"
                label={lineItemTranslate?.originalItem?.formField?.applyTax?.yesLabel}
                value="yes"
                name="applyTax"
                checked={lineItem?.applyTax}
                formControlClassname={orginalItemFormStyle.radioFormControl}
                inputFieldWrapperClassName={orginalItemFormStyle.inputWrapper}
                onChange={handleApplyTax}
              />
              <GenericNormalInput
                type="radio"
                label={lineItemTranslate?.originalItem?.formField?.applyTax?.noLabel}
                value="no"
                name="applyTax"
                checked={!lineItem?.applyTax}
                formControlClassname={orginalItemFormStyle.radioFormControl}
                inputFieldWrapperClassName={orginalItemFormStyle.inputWrapper}
                onChange={handleApplyTax}
              />
            </div>
          </div>
          <div className={orginalItemFormStyle.formGroup}>
            <GenericUseFormInput
              label={lineItemTranslate?.originalItem?.formField?.brand?.label}
              placeholder={lineItemTranslate?.originalItem?.formField?.brand?.placeholder}
              labelClassname={orginalItemFormStyle.label}
              {...register("brand")}
              onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                debounce({ brand: e.target.value ? e.target.value : null });
                setIsPageUpdated(true);
              }}
            />
          </div>
          <div className={orginalItemFormStyle.formGroup}>
            <GenericUseFormInput
              label={lineItemTranslate?.originalItem?.formField?.model?.label}
              placeholder={lineItemTranslate?.originalItem?.formField?.model?.placeholder}
              labelClassname={orginalItemFormStyle.label}
              {...register("model")}
              onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                debounce({ model: e.target.value ? e.target.value : null });
                setIsPageUpdated(true);
              }}
            />
          </div>
          {lineItem?.purchaseMethod?.value !== "Gift" && (
            <div
              className={clsx(
                orginalItemFormStyle.formGroup,
                orginalItemFormStyle.startFromCol1
              )}
            >
              <label htmlFor="purchasedFrom" className={orginalItemFormStyle.label}>
                {lineItemTranslate?.originalItem?.formField?.purchaseFrom?.label}
              </label>
              <GenericSelect
                menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                id="originallyPurchasedFrom"
                options={retailer}
                value={lineItem?.originallyPurchasedFrom}
                getOptionLabel={(option: { name: string }) => option.name}
                getOptionValue={(option: { id: number }) => option.id}
                onChange={(e: unknownObjectType) => {
                  setShowNewRetail(false);
                  setNewRetail("");
                  updateLineItem({ originallyPurchasedFrom: e });
                  setIsPageUpdated(true);
                }}
              />
              {!showNewRetail ? (
                <div
                  className={orginalItemFormStyle.linkText}
                  role="button"
                  onClick={() => {
                    setShowNewRetail(true);
                    updateLineItem({ originallyPurchasedFrom: null });
                  }}
                >
                  {lineItemTranslate?.originalItem?.formField?.purchaseFrom?.addRetail}
                </div>
              ) : (
                <div className={orginalItemFormStyle.customRetailDiv}>
                  <GenericNormalInput
                    placeholder={
                      lineItemTranslate?.originalItem?.formField?.purchaseFrom
                        ?.addRetailPlaceholder
                    }
                    value={newRetail}
                    onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                      setNewRetail(e.target.value);
                      setIsPageUpdated(true);
                    }}
                  />
                  <IoCloseCircle
                    size={24}
                    role="button"
                    onClick={() => {
                      setShowNewRetail(false);
                      setNewRetail("");
                    }}
                    className={orginalItemFormStyle.closeIcon}
                  />
                </div>
              )}
            </div>
          )}
          <div
            className={clsx(orginalItemFormStyle.formGroup, {
              [orginalItemFormStyle.startFromCol1]:
                lineItem?.purchaseMethod?.value === "Gift",
            })}
          >
            <label htmlFor="purchasedMethod" className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.formField?.purchaseMethod?.label}
            </label>
            <GenericSelect
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              id="purchaseMethod"
              value={lineItem?.purchaseMethod}
              options={paymentTypes}
              onChange={(e: unknownObjectType) => {
                if (e && e.value === "Gift") {
                  setNewRetail("");
                  updateLineItem({ purchaseMethod: e, originallyPurchasedFrom: null });
                } else {
                  setGiftedFrom("");
                  updateLineItem({ purchaseMethod: e, giftedFrom: null });
                }
                setIsPageUpdated(true);
              }}
            />
          </div>
          {lineItem?.purchaseMethod?.value === "Gift" && (
            <div
              className={clsx(
                orginalItemFormStyle.formGroup,
                orginalItemFormStyle.startFromCol1
              )}
            >
              <GenericNormalInput
                label="Gift From"
                placeholder={
                  lineItemTranslate?.originalItem?.formField?.purchaseMethod
                    ?.giftFromPlaceholder
                }
                value={giftedFrom}
                labelClassname={orginalItemFormStyle.label}
                onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                  setGiftedFrom(e.target.value);
                  debounce({ giftedFrom: e.target.value });
                  setIsPageUpdated(true);
                }}
              />
            </div>
          )}
          <div
            className={clsx(
              orginalItemFormStyle.formGroup,
              orginalItemFormStyle.startFromCol1
            )}
          >
            <label htmlFor="condition" className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.formField?.condition?.label}
            </label>
            <GenericSelect
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              id="condition"
              value={lineItem?.condition}
              options={condition}
              getOptionLabel={(option: { conditionName: any }) => option.conditionName}
              getOptionValue={(option: { conditionId: any }) => option.conditionId}
              onChange={(e: unknownObjectType) => {
                updateLineItem({ condition: e });
                setIsPageUpdated(true);
              }}
            />
          </div>
          <div className={orginalItemFormStyle.formGroup}>
            <label htmlFor="room" className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.formField?.room?.label}
            </label>
            <GenericSelect
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              id="room"
              options={room}
              value={lineItem.room}
              getOptionLabel={(option: { roomName: any }) => option.roomName}
              getOptionValue={(option: { id: any }) => option.id}
              onChange={(e: unknownObjectType) => {
                const payload = e
                  ? {
                      id: e.id,
                      roomName: e.roomName,
                    }
                  : null;
                updateLineItem({ room: payload });
                setIsPageUpdated(true);
              }}
            />
          </div>
          <div
            className={clsx(
              orginalItemFormStyle.formGroup,
              orginalItemFormStyle.scheduledItem
            )}
          >
            <label className={orginalItemFormStyle.label}>
              <span className="text-danger">*</span>
              {lineItemTranslate?.originalItem?.formField?.scheduleItem?.label}
            </label>
            <div className={orginalItemFormStyle.scheduledItemFormGroup}>
              <GenericNormalInput
                type="radio"
                label={lineItemTranslate?.originalItem?.formField?.scheduleItem?.yesLabel}
                value="yes"
                name="scheduledItem"
                checked={lineItem?.isScheduledItem}
                formControlClassname={orginalItemFormStyle.radioFormControl}
                inputFieldWrapperClassName={orginalItemFormStyle.inputWrapper}
                onChange={handleScheduleItem}
              />
              <GenericNormalInput
                type="radio"
                label={lineItemTranslate?.originalItem?.formField?.scheduleItem?.noLabel}
                value="no"
                name="scheduledItem"
                checked={!lineItem?.isScheduledItem}
                formControlClassname={orginalItemFormStyle.radioFormControl}
                inputFieldWrapperClassName={orginalItemFormStyle.inputWrapper}
                onChange={handleScheduleItem}
              />
            </div>
          </div>
          {lineItem?.isScheduledItem && (
            <div className={orginalItemFormStyle.formGroup}>
              <Controller
                name="scheduleAmount"
                control={control}
                render={({ field: { onChange, value: fieldValue } }) => {
                  return (
                    <GenericCurrencyFormat
                      defaultValue={fieldValue}
                      handleChange={({ value }) => {
                        onChange(value);
                        debounce({
                          scheduleAmount: value ? value : null,
                        });
                        setIsPageUpdated(true);
                      }}
                    />
                  );
                }}
              />
            </div>
          )}
          <div
            className={clsx(orginalItemFormStyle.formGroup, orginalItemFormStyle.row1)}
          >
            <label className={orginalItemFormStyle.label}>
              {lineItemTranslate?.originalItem?.attachment?.label}
            </label>
            <div
              className={orginalItemFormStyle.fileInput}
              onClick={() => receiptRef?.current?.click()}
            >
              {lineItemTranslate?.originalItem?.attachment?.btnText}
            </div>
            <input
              type="file"
              hidden
              ref={receiptRef}
              accept="image/*|.pdf|.xls|.xlsx"
              onChange={handleReceiptSelect}
              multiple
            />
            <div className={orginalItemFormStyle.attachmentContainer}>
              {attachment?.map((img: any) => (
                <div key={img?.id} className={orginalItemFormStyle.attachmentWrapper}>
                  <IoMdCloseCircle
                    className={orginalItemFormStyle.clearImage}
                    size={24}
                    onClick={() => showImageConfirmModal(img)}
                  />
                  <div className={orginalItemFormStyle.attachmentFile}>
                    <Image
                      unoptimized={true}
                      src={getFileUrl(img)}
                      alt="products"
                      fill={true}
                      sizes="100%"
                      style={{ objectFit: "fill" }}
                    />
                  </div>
                  <GenericButton
                    label={img?.name}
                    theme="linkBtn"
                    onClickHandler={() => showFilePreview(img)}
                    btnClassname={orginalItemFormStyle.fileName}
                  />
                </div>
              ))}

              {files?.map((img: any, index: number) => (
                <div
                  key={`editImage_${index}`}
                  className={orginalItemFormStyle.attachmentWrapper}
                >
                  <IoMdCloseCircle
                    className={orginalItemFormStyle.clearImage}
                    size={24}
                    onClick={() => showImageConfirmModal(img)}
                  />
                  <div className={orginalItemFormStyle.attachmentFile}>
                    <Image
                      unoptimized={true}
                      src={getFileUrl(img)}
                      alt="products"
                      fill={true}
                      sizes="100%"
                      style={{ objectFit: "fill" }}
                    />
                  </div>
                  <GenericButton
                    label={img?.name}
                    theme="linkBtn"
                    onClickHandler={() => showFilePreview(img)}
                    btnClassname={orginalItemFormStyle.fileName}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {lineItem.status.status === ITEM_STATUS.underReview && <OriginalItemPreview />}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  lineItem: state[EnumStoreSlice.LINE_ITEM_DETAIL]?.lineItem,
  category: state[EnumStoreSlice.LINE_ITEM_DETAIL].category,
  condition: state[EnumStoreSlice.LINE_ITEM_DETAIL].condition,
  subCategory: state[EnumStoreSlice.LINE_ITEM_DETAIL].subCategory,
  room: state[EnumStoreSlice.LINE_ITEM_DETAIL].room,
  retailer: state[EnumStoreSlice.LINE_ITEM_DETAIL].retailer,
  paymentTypes: state[EnumStoreSlice.LINE_ITEM_DETAIL].paymentTypes,
  attachment: selectAttachment(state),
  selectedCatgory: selectItemCategory(state),
});

const mapDispatchToProps = {
  fetchSubCategory,
  updateOnCategoryChange,
  updateLineItem,
  saveSubCategoryChange,
  removeAttachment,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(OrginalItemForm);
