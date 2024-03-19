import React, { useContext, useRef, useState } from "react";
import customComparableStyle from "./customComparable.module.scss";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";
import useCustomForm from "@/hooks/useCustomForm";
import GenericButton from "@/components/common/GenericButton";
import Modal from "@/components/common/ModalPopups";
import { Output, minLength, object, string } from "valibot";
import { getFileExtension, parseFloatWithFixedDecimal } from "@/utils/utitlity";
import { useParams } from "next/navigation";
import selectItemUID from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectItemUID";
import { addCustomItem } from "@/services/_adjuster_services/AdjusterMyClaimServices/LineItemDetailService";
import {
  fetchLineItemDetail,
  saveComparable,
} from "@/reducers/_adjuster_reducers/LineItemDetail/LineItemThunkService";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { NO_IMAGE } from "@/constants/constants";
import { Controller } from "react-hook-form";
import GenericCurrencyFormat from "@/components/common/GenericInput/GenericCurrencyFormat";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import selectItemTaxDetail from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectItemTaxDetail";
import selectItemQuantity from "@/reducers/_adjuster_reducers/LineItemDetail/Selectors/selectItemQuantity";
import { unknownObjectType } from "@/constants/customTypes";
import { calculateRCV as rcvCalculator } from "../../helper";
import { LineItemContext } from "../../LineItemContext";

interface propType {
  closeCustomComparable: () => void;
  openCustomComparableModal: boolean;
}
function CustomComparable({
  closeCustomComparable,
  openCustomComparableModal,
}: propType) {
  const fileRef = useRef<null | HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const ItemQuantity = useAppSelector(selectItemQuantity);
  const [ItemPrice, setItemPrice] = useState<number>(0);

  const { taxRate, applyTax } = useAppSelector(selectItemTaxDetail);
  const [taxAmount, setTaxAmount] = useState(0);
  const { claimId, itemId } = useParams();
  const itemUID = useAppSelector(selectItemUID);
  const dispatch = useAppDispatch();
  const { handleItemReplace } = useContext(LineItemContext);

  const schema = object({
    ItemDescription: string("Item desciption", [
      minLength(1, "Please enter item description"),
    ]),
    unitPrice: string([minLength(1, "Please enter price")]),
    ItemQuantity: string([minLength(1, "Please enter Quantity")]),
    supplier: string(),
    SupplierWebsite: string(),
  });

  const { register, handleSubmit, formState, getValues, reset, control } = useCustomForm(
    schema,
    {
      unitPrice: "0",
      ItemQuantity: ItemQuantity ? ItemQuantity.toString() : "1",
      ItemDescription: "",
      supplier: "",
      SupplierWebsite: "",
    }
  );
  const { errors, isValid } = formState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registeredQty = register("ItemQuantity");

  const handleReset = () => {
    reset();
    setFile(undefined);
    setItemPrice(0);
    setTaxAmount(0);
    setIsSubmitting(false);
  };

  const CalculateRCV = (param: {
    unitPrice?: string | number;
    ItemQuantity?: string | number;
  }) => {
    const unitPrice = Number(param.unitPrice ?? getValues("unitPrice") ?? 0);
    const ItemQuantity = Number(param.ItemQuantity ?? getValues("ItemQuantity") ?? 1);
    const totalAmount =
      (!unitPrice ? 0 : Number(unitPrice)) * (!ItemQuantity ? 1 : Number(ItemQuantity));
    const rcv = parseFloatWithFixedDecimal(totalAmount);
    let appliedTax = 0;
    if (applyTax) {
      appliedTax = taxRate;
    }
    const taxAmt = parseFloatWithFixedDecimal((rcv * appliedTax) / 100);
    const rcvTotal = rcv + taxAmt;
    setItemPrice(parseFloatWithFixedDecimal(rcvTotal));
    setTaxAmount(taxAmt);
  };

  const isValidImage = (file: File) => {
    const fileExtension = getFileExtension(file);
    const size = file.size;
    const allowedFileSize = 20000000;
    const allowedExtension = [".jpeg", ".png", ".svg", ".webp", ".zip", ".jpg"];
    if (allowedExtension.includes(fileExtension)) {
      return size <= allowedFileSize ? true : false;
    }
  };

  const handleFileSelection = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e?.target?.files &&
      e.target.files.length > 0 &&
      isValidImage(e.target?.files[0])
    ) {
      setFile(e?.target?.files[0]);
    }
  };

  const removeFile = () => {
    setFile(undefined);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const saveCustomReplaceItem = (data: unknownObjectType) => {
    const ItemDetails = { ...data };
    let replaceItem = null;
    const comparableItems: unknownObjectType[] = [];
    ItemDetails?.comparableItems?.forEach((item: unknownObjectType) => {
      item.imageURL = item?.imageURL ? item?.imageURL : "assets/global/img/no-image.png";
      item.isDelete = item?.isDelete ? true : false;
      item.price = item?.unitPrice;
      if (item.isReplacementItem) {
        ItemDetails.isReplaced = true;
        item.imageURL = item.imageURL ? item.imageURL : "assets/global/img/no-image.png";
        ItemDetails.adjusterDescription = item.description;
        ItemDetails.source = item.buyURL;
        ItemDetails.replacedItemPrice = item.unitPrice;
        ItemDetails.replacementQty = item.quantity ?? 1;
        replaceItem = item;
      } else {
        comparableItems.push(item);
      }
    });
    ItemDetails.comparableItems = comparableItems;
    const newLineItem = rcvCalculator(ItemDetails, replaceItem);
    replaceItem && comparableItems.push(replaceItem);
    dispatch(
      saveComparable({
        comparableArr: comparableItems,
        tempLineItem: newLineItem,
        isReplacement: true,
        callback: (data?: unknownObjectType) => {
          if (data?.status === 200) {
            handleItemReplace();
          }
        },
      })
    );
  };

  const createComparable = async (
    data: Output<typeof schema>,
    isReplacementItem: boolean
  ) => {
    setIsSubmitting(true);
    const { ItemDescription, unitPrice, supplier, ItemQuantity, SupplierWebsite } = data;
    const param = new FormData();
    param.append(
      "customItem",
      JSON.stringify({
        id: null,
        customItemFlag: true,
        description: !ItemDescription ? "" : encodeURIComponent(ItemDescription),
        itemStatus: "Comparable",
        replacementCost: unitPrice,
        supplierName: supplier,
        supplier: supplier,
        quantity: ItemQuantity,
        supplierWebsite: SupplierWebsite,
        sku: null,
        registrationNumber: sessionStorage.getItem("CompanyCRN"),
        claim: {
          claimId,
        },
        item: {
          itemUID,
        },
        customItemType: {},
        customSubItem: null,
        isReplacementItem,
      })
    );

    if (file) {
      const extension = getFileExtension(file);
      const fileDetaills = [
        {
          extension,
          fileName: file.name,
          filePurpose: "CUSTOM_ITEM",
          fileType: file.type,
        },
      ];
      param.append("filesDetails", JSON.stringify(fileDetaills));
      param.append("file", file);
    } else {
      param.append("filesDetails", JSON.stringify([]));
    }

    try {
      const res = await addCustomItem(param);
      if (res?.status !== 200) {
        return dispatch(
          addNotification({
            message: res?.errorMessage,
            id: "customComparable",
            status: "error",
          })
        );
      }
      closeCustomComparable();
      dispatch(
        fetchLineItemDetail({
          itemId: +itemId,
          clbk: (data) => isReplacementItem && saveCustomReplaceItem(data),
        })
      );
      handleReset();
      return dispatch(
        addNotification({
          message: res?.message,
          id: "customComparable",
          status: "success",
        })
      );
    } catch (error) {
      handleReset();
      setIsSubmitting(false);
      console.log("customComparable_error", error);
    }
  };

  const handleComarableAdd = (data: Output<typeof schema>) => {
    createComparable(data, false);
  };
  const handleReplacementAdd = (data: Output<typeof schema>) => {
    createComparable(data, true);
  };

  return (
    <form>
      <Modal
        isOpen={openCustomComparableModal}
        onClose={() => {
          handleReset();
          closeCustomComparable();
        }}
        overlayClassName={customComparableStyle.modalOverlay}
        headingName="New Custom Comparable"
        positionTop
        animate
        roundedBorder
        footerContent={
          <div className={customComparableStyle.customComparableModalButton}>
            <GenericButton
              disabled={!isValid || ItemPrice < 1 || isSubmitting}
              label="Mark Replacement"
              size="medium"
              onClickHandler={handleSubmit(handleReplacementAdd)}
            />

            <GenericButton
              disabled={!isValid || ItemPrice < 1 || isSubmitting}
              size="medium"
              label="Add Comparable"
              onClickHandler={handleSubmit(handleComarableAdd)}
            />
            <GenericButton
              label="Cancel"
              size="medium"
              disabled={isSubmitting}
              onClickHandler={() => {
                handleReset();
                closeCustomComparable();
              }}
            />
          </div>
        }
        childComp={
          <div className={customComparableStyle.root}>
            <div className={customComparableStyle.imageContainer}>
              <div className={customComparableStyle.imageDiv}>
                {file && (
                  <IoMdCloseCircle
                    className={customComparableStyle.clearImage}
                    size={24}
                    onClick={removeFile}
                  />
                )}
                <div className={customComparableStyle.imageWrapper}>
                  <Image
                    unoptimized={true}
                    src={file ? URL.createObjectURL(file) : NO_IMAGE}
                    alt="products"
                    fill={true}
                    sizes="100%"
                    style={{ objectFit: "fill" }}
                  />
                </div>
              </div>
              <div className={customComparableStyle.fileName}>
                {file ? file.name : "..."}
              </div>
              <div
                className={customComparableStyle.fileInput}
                onClick={() => fileRef?.current?.click()}
              >
                Click to add attachment
              </div>
              <input type="file" hidden ref={fileRef} onChange={handleFileSelection} />
            </div>
            <div className={customComparableStyle.formContent}>
              <div className={customComparableStyle.formGroup}>
                <label htmlFor="description">
                  <span className="text-danger">*</span> Replacement Description
                </label>
                <textarea id="description" {...register("ItemDescription")} />
                {errors.ItemDescription && (
                  <div className="errorText">{errors.ItemDescription.message}</div>
                )}
              </div>
              <div className={customComparableStyle.section2}>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="totalCost">
                    <span className="text-danger">*</span> Total Cost
                  </label>
                  <Controller
                    name="unitPrice"
                    control={control}
                    render={({ field: { onChange: unitPriceChange } }) => (
                      <GenericCurrencyFormat
                        handleChange={({ value }) => {
                          unitPriceChange(value);
                          CalculateRCV({ unitPrice: value ?? 0 });
                        }}
                        id="totalCost"
                        errorMsg={errors?.unitPrice?.message}
                        showError={errors["unitPrice"]}
                      />
                    )}
                  />
                </div>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="qty">
                    <span className="text-danger">*</span> Quantity
                  </label>
                  <GenericUseFormInput
                    id="qty"
                    type="number"
                    errorMsg={errors?.ItemQuantity?.message}
                    showError={errors["ItemQuantity"]}
                    {...registeredQty}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      if (!e.target.value) {
                        e.target.value = "1";
                      }
                      CalculateRCV({ ItemQuantity: e.target.value });
                      registeredQty.onBlur(e);
                    }}
                  />
                </div>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="tax">
                    <span className="text-danger">*</span> Tax(@{taxRate}%)
                  </label>
                  {/* <GenericInput id="tax" /> */}
                  <div className="ms-4">{taxAmount}</div>
                </div>
              </div>
              <div className={customComparableStyle.section3}>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="replaceCost">
                    <span className="text-danger">*</span> Total Replacement Cost
                  </label>
                  <GenericUseFormInput id="replaceCost" disabled value={ItemPrice} />
                </div>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="supplier">Supplier Name</label>
                  <GenericUseFormInput id="supplier" {...register("supplier")} />
                </div>
              </div>
              <div>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="website">Supplier&apos;s Website (If any)</label>
                  <GenericUseFormInput id="website" {...register("SupplierWebsite")} />
                </div>
              </div>
            </div>
          </div>
        }
      />
    </form>
  );
}

export default CustomComparable;
