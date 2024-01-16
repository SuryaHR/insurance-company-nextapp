"use client";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/ModalPopups";
import addClaimFormStyle from "./addClaimForm.module.scss";
import AddItemModalForm from "./AddItemModalForm";
import { ConnectedProps, connect } from "react-redux";
import clsx from "clsx";
import GenericButton from "@/components/common/GenericButton";
import { addContentItem, updateContentItem } from "@/services/AddItemContentService";
import { useParams } from "next/navigation";
import { claimContentList } from "@/services/ClaimContentListService";
import { addClaimContentListData } from "@/reducers/ClaimData/ClaimContentSlice";
import { object, string, number, minLength, Output, nullish } from "valibot";
import useCustomForm from "@/hooks/useCustomForm";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { addItemModalTranslateType } from "@/translations/addItemModalTranslate/en";
import useTranslation from "@/hooks/useTranslation";

interface typeProps {
  [key: string | number]: any;
}
const AddItemModal: React.FC<connectorType & typeProps> = (props: any) => {
  const {
    isModalOpen,
    closeModal,
    editItem,
    editItemDetail = null,

    addNotification,
    addClaimContentListData,
  } = props;

  const { translate }: { translate: addItemModalTranslateType | undefined } =
    useTranslation("addItemModalTranslate");

  const { claimId }: { claimId: string } = useParams();
  let claimNumber: string;
  try {
    claimNumber = sessionStorage.getItem("claimNumber") ?? "";
  } catch (error) {
    console.error("Error accessing sessionStorage:", error);
    claimNumber = "";
  }
  const [docs, setDocs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [deletedFile, setDeletedFile] = useState<any>([]);

  const [applyTaxState, setapplyTaxState] = useState("yes");
  const [isScheduledItemState, SetScheduledItemState] = useState("no");

  const schema = object({
    description: string(" Description must be a string.", [
      minLength(1, translate?.inputErrors?.decriptionRequired),
    ]),
    quantity: nullish(string("Quantity must be a number")),
    insuredPrice: nullish(string("Price must be a number")),
    category: nullish(
      object({
        categoryName: string(),
        categoryId: number(),
      })
    ),
    subCategory: nullish(
      object({
        name: string(),
        id: number(),
      })
    ),
    ageYears: nullish(string("Years must be a number")),
    ageMonths: nullish(string("Month must be a number")),
    room: nullish(
      object({
        roomName: string(),
        id: number(),
      })
    ),
    condition: nullish(
      object({
        conditionName: string(),
        conditionId: number(),
      })
    ),
    originallyPurchasedFrom: nullish(
      object({
        id: number(),
        name: string(),
      })
    ),
    scheduleAmount: nullish(string("Amount must be a number")),
    addRetailer: nullish(string()),
  });

  const defaultValue = useMemo(() => {
    return {
      description:
        editItem && editItemDetail.description ? editItemDetail.description : null,
      quantity:
        editItem && editItemDetail.quantity ? String(editItemDetail.quantity) : null,
      insuredPrice:
        editItem && editItemDetail?.insuredPrice
          ? String(editItemDetail?.insuredPrice)
          : null,
      category: editItem && editItemDetail.category ? editItemDetail.category : null,
      subCategory:
        editItem && editItemDetail.subCategory ? editItemDetail.subCategory : null,
      ageYears:
        editItem && editItemDetail.ageYears ? String(editItemDetail.ageYears) : null,
      ageMonths:
        editItem && editItemDetail.ageMonths ? String(editItemDetail.ageMonths) : null,
      room: editItem && editItemDetail.room ? editItemDetail.room : null,
      condition: editItem && editItemDetail.condition ? editItemDetail.condition : null,
      originallyPurchasedFrom:
        editItem && editItemDetail.originallyPurchasedFrom
          ? editItemDetail.originallyPurchasedFrom
          : null,
      scheduleAmount:
        editItem && editItemDetail.scheduleAmount
          ? String(editItemDetail.scheduleAmount)
          : null,
    };
  }, [editItem, editItemDetail]);

  const { register, handleSubmit, formState, control, setValue, reset } = useCustomForm(
    schema,
    defaultValue
  );

  const { errors } = formState;

  useEffect(() => {
    if (editItem && editItemDetail) {
      setValue("description", editItemDetail.description ?? null);
      setValue(
        "quantity",
        editItemDetail.quantity ? String(editItemDetail.quantity) : null
      );
      setValue(
        "insuredPrice",
        editItemDetail?.insuredPrice ? String(editItemDetail?.insuredPrice) : null
      );
      setValue("category", editItemDetail.category ? editItemDetail.category : null);
      setValue("subCategory", editItemDetail.subCategory ?? null);
      setValue(
        "ageYears",
        editItemDetail.ageYears ? String(editItemDetail.ageYears) : null
      );
      setValue(
        "ageMonths",
        editItemDetail.ageMonths ? String(editItemDetail.ageMonths) : null
      );
      setValue("room", editItemDetail.room ?? null);
      setValue("condition", editItemDetail.condition ?? null);
      setValue("originallyPurchasedFrom", editItemDetail.originallyPurchasedFrom ?? null);
      setValue(
        "scheduleAmount",
        editItemDetail.scheduleAmount ? String(editItemDetail.scheduleAmount) : null
      );
      setapplyTaxState(editItemDetail?.applyTax ? "yes" : "no");
      SetScheduledItemState(editItemDetail?.isScheduledItem ? "yes" : "no");

      const files = editItemDetail.attachments;
      setDocs([]);
      setSelectedFile([]);
      setDeletedFile([]);
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          const newObj = {
            fileName: file.name,
            fileType: file.type,
            filePurpose: file.purpose,
            imgType: file.type === "application/pdf" ? "pdf" : "jpeg",
            url: file.url,
            id: file.id,
            imageUID: file.imageUID,
          };

          setDocs((prev: any) => [...prev, newObj]);
        }
      }
    } else {
      reset();
    }
  }, [editItem, editItemDetail, setValue]);

  const itemListApi = async () => {
    const payload = {
      claimId,
    };
    const claimContentListRes: any = await claimContentList(payload, true);
    if (claimContentListRes) {
      addClaimContentListData({ claimContentData: claimContentListRes, claimId });
    }
  };

  const submitFormData = async (data: Output<typeof schema>) => {
    const payload = {
      id: editItem && editItemDetail ? editItemDetail?.itemId : null,
      claimId: claimId,
      claimNumber: claimNumber,
      description: data.description,
      quantity: data.quantity,
      insuredPrice: data.insuredPrice,
      applyTax: applyTaxState === "yes" ? true : false,
      ageYears: data.ageYears,
      ageMonths: data.ageMonths,
      isScheduledItem: isScheduledItemState === "yes" ? true : false,
      scheduleAmount: data.scheduleAmount,
      category: {
        id: data?.category?.categoryId,
        name: data?.category?.categoryName,
      },
      subCategory: data.subCategory,
      room: data.room,
      condition: data.condition,
      originallyPurchasedFrom: data.addRetailer
        ? { name: data.addRetailer }
        : data.originallyPurchasedFrom,
      deleteAttachments: deletedFile ?? null,
    };
    const formData = new FormData();
    if (selectedFile.length > 0) {
      const docArray = docs.filter((elem: any) => {
        if (elem?.id) {
          return false;
        } else {
          return elem;
        }
      });
      formData.append("filesDetails", JSON.stringify(docArray));
      selectedFile.map((file: any) => {
        formData.append("file", file);
      });
    }
    formData.append("itemDetails", JSON.stringify(payload));

    return formData;
  };

  const handleSaveAndNext = async (data: Output<typeof schema>) => {
    const formData = await submitFormData(data);
    const addItemRes = await addContentItem(formData);

    if (addItemRes?.status === 200) {
      reset();
      addNotification({
        message: "Item Added Successfully. You Can Add Another One",
        id: "add_content_item_and_next_success",
        status: "success",
      });
    } else {
      addNotification({
        message: addItemRes.message ?? "Something went wrong.",
        id: "add_content_item_and_next_failure",
        status: "error",
      });
    }
  };
  const formSubmit = async (data: Output<typeof schema>) => {
    const formData = await submitFormData(data);
    const addItemRes = await addContentItem(formData);

    if (addItemRes?.status === 200) {
      closeModal();
      await itemListApi();
      addNotification({
        message: "Item Added Successfully",
        id: "add_content_item_success",
        status: "success",
      });
    } else {
      addNotification({
        message: addItemRes.message ?? "Something went wrong.",
        id: "add_content_item_failure",
        status: "error",
      });
    }
  };
  const handleUpdate = async (data: Output<typeof schema>) => {
    const formData = await submitFormData(data);

    const updateItemRes = await updateContentItem(formData);

    if (updateItemRes?.status === 200) {
      closeModal();
      await itemListApi();

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

  const FooterComp = () => {
    return (
      <>
        {editItem ? (
          <div className={addClaimFormStyle.modalWidth}>
            <div className="row m-2 flex-row-reverse">
              <div className="row col-12 m-2 flex-row-reverse">
                <div className="row col-2">
                  <GenericButton
                    label="Cancel"
                    onClick={async () => {
                      closeModal();
                      await itemListApi();
                    }}
                    size="medium"
                  />
                </div>
                <div className="row col-2">
                  <GenericButton
                    label="Update Item"
                    type="submit"
                    onClick={handleSubmit(handleUpdate)}
                    size="medium"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={addClaimFormStyle.modalWidth}>
            <div className={clsx(addClaimFormStyle.centerAlign, "row m-4")}>
              <div className="col-8 " style={{ textAlign: "right" }}>
                <a
                  type="submit"
                  className={addClaimFormStyle.pointerCursor}
                  onClick={handleSubmit(handleSaveAndNext)}
                >
                  {translate?.inputFields?.saveAndAddAnotherItemLink}
                </a>
              </div>

              <div className={clsx("row col-2", addClaimFormStyle.centerAlign)}>
                <GenericButton
                  label={translate?.inputFields?.addItemBtn ?? ""}
                  type="submit"
                  size="medium"
                  onClick={handleSubmit(formSubmit)}
                />
              </div>
              <div className="row col-2">
                <GenericButton
                  label={translate?.inputFields?.resetBtn ?? ""}
                  size="medium"
                  onClick={() => reset()}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      childComp={
        <AddItemModalForm
          editItem={editItem}
          editItemDetail={editItemDetail}
          submitFormData={submitFormData}
          setSelectedFile={setSelectedFile}
          setDeletedFile={setDeletedFile}
          setapplyTaxState={setapplyTaxState}
          SetScheduledItemState={SetScheduledItemState}
          docs={docs}
          setDocs={setDocs}
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
          isScheduledItemState={isScheduledItemState}
          applyTaxState={applyTaxState}
          handleSubmit={handleSubmit}
        />
      }
      headingName={
        editItem ? "Item# " + editItemDetail.itemNumber : translate?.modalHeading
      }
      modalWidthClassName={addClaimFormStyle.modalWidth}
      footerContent={<FooterComp />}
    ></Modal>
  );
};

const mapStateToProps = ({ claimContentdata }: any) => ({
  editItemDetail: claimContentdata.editItemDetail,
});
const mapDispatchToProps = {
  addNotification,
  addClaimContentListData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AddItemModal);
