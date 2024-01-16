import React, { useRef, useState } from "react";
import customComparableStyle from "./customComparable.module.scss";
import GenericInput from "@/components/common/GenericInput";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";
import useCustomForm from "@/hooks/useCustomForm";
import GenericButton from "@/components/common/GenericButton";
import Modal from "@/components/common/ModalPopups";
import { Output, minLength, object, string } from "valibot";
import { parseFloatWithFixedDecimal } from "@/utils/utitlity";
import { useParams } from "next/navigation";
import selectItemUID from "@/reducers/LineItemDetail/Selectors/selectItemUID";
import { addCustomItem } from "@/services/AdjusterMyClaimServices/LineItemDetailService";
import { fetchLineItemDetail } from "@/reducers/LineItemDetail/LineItemThunkService";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { NO_IMAGE } from "@/constants/constants";
import selectItemTaxDetail from "@/reducers/LineItemDetail/Selectors/selectItemTaxDetail";
import selectItemQuantity from "@/reducers/LineItemDetail/Selectors/selectItemQuantity";

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

  const { taxRate, applyTax } = useAppSelector(selectItemTaxDetail);
  const [taxAmount, setTaxAmount] = useState(0);
  const { claimId, itemId } = useParams();
  const itemUID = useAppSelector(selectItemUID);
  const dispatch = useAppDispatch();

  const schema = object({
    ItemDescription: string("Item desciption", [
      minLength(1, "Please enter item description"),
    ]),
    unitPrice: string([minLength(1, "Please enter price")]),
    ItemQuantity: string([minLength(1, "Please enter Quantity")]),
    ItemPrice: string(),
    supplier: string(),
    SupplierWebsite: string(),
  });

  const { register, handleSubmit, formState, getValues, setValue, reset } = useCustomForm(
    schema,
    {
      ItemPrice: "",
      unitPrice: "",
      ItemQuantity,
      ItemDescription: "",
      supplier: "",
      SupplierWebsite: "",
    }
  );
  const { errors, isValid } = formState;
  const registeredQty = register("ItemQuantity");
  const registeredUnitPrice = register("unitPrice");

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
    setValue("ItemPrice", parseFloatWithFixedDecimal(rcvTotal).toString());
    setTaxAmount(taxAmt);
  };

  const getFileExtension = (file: File) => {
    const fileExtension = `.${file.name.split(".").pop()}`;
    return fileExtension;
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

  const createComparable = async (
    data: Output<typeof schema>,
    isReplacementItem: boolean
  ) => {
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
      console.log("res:", res);
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
      dispatch(fetchLineItemDetail({ itemId: +itemId }));
      reset();
      return dispatch(
        addNotification({
          message: res?.message,
          id: "customComparable",
          status: "success",
        })
      );
    } catch (error) {
      reset();
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
        onClose={closeCustomComparable}
        overlayClassName={customComparableStyle.modalOverlay}
        headingName="New Custom Comparable"
        positionTop
        animate
        roundedBorder
        footerContent={
          <div className={customComparableStyle.customComparableModalButton}>
            <GenericButton
              disabled={!isValid}
              label="Mark Replacement"
              size="medium"
              onClickHandler={handleSubmit(handleReplacementAdd)}
            />
            <GenericButton
              disabled={!isValid}
              size="medium"
              label="Add Comparable"
              onClickHandler={handleSubmit(handleComarableAdd)}
            />
            <GenericButton
              label="Cancel"
              size="medium"
              onClickHandler={closeCustomComparable}
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
                  <GenericInput
                    type="number"
                    id="totalCost"
                    errorMsg={errors?.unitPrice?.message}
                    showError={errors["unitPrice"]}
                    {...registeredUnitPrice}
                    onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                      CalculateRCV({ unitPrice: e.target.value ?? 0 });
                      registeredUnitPrice.onChange(e);
                    }}
                  />
                </div>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="qty">
                    <span className="text-danger">*</span> Quantity
                  </label>
                  <GenericInput
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
                  <GenericInput id="replaceCost" disabled {...register("ItemPrice")} />
                </div>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="supplier">Supplier Name</label>
                  <GenericInput id="supplier" {...register("supplier")} />
                </div>
              </div>
              <div>
                <div className={customComparableStyle.formGroup}>
                  <label htmlFor="website">Supplier&apos;s Website (If any)</label>
                  <GenericInput id="website" {...register("SupplierWebsite")} />
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
