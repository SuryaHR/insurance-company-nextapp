"use client";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/ModalPopups";
import addClaimFormStyle from "./addClaimForm.module.scss";
import AddItemModalForm from "./AddItemModalForm";
import { ConnectedProps, connect } from "react-redux";
import clsx from "clsx";
import GenericButton from "@/components/common/GenericButton";
import { object, string, number, minLength, Output, nullish } from "valibot";
import useCustomForm from "@/hooks/useCustomForm";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(core_logic)/(dashboardLayout)/core-logic/core-adjuster-property-claim-details/[claimNumberEncrypted]/page";
import {
  addContentItem,
  updateContentItem,
} from "@/services/_core_logic_services/CoreAdjusterPropertyClaimDetailService";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import selectSessionClaimNumber from "@/reducers/Session/Selectors/selectSessionClaimNumber";
import selectSessionClaimId from "@/reducers/Session/Selectors/selectSessionClaimId";

interface typeProps {
  [key: string | number]: any;
}
const AddItemModal: React.FC<connectorType & typeProps> = (props: any) => {
  const {
    isModalOpen,
    closeModal,
    editItem,
    editItemDetail = null,
    contentData = null,
    addNotification,
    token,
    claimNumber,
    claimId,
  } = props;

  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const [docs, setDocs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [deletedFile, setDeletedFile] = useState<any>([]);
  const [disable, setDisable] = useState<any>(false);

  const [applyTaxState, setapplyTaxState] = useState("yes");
  const [isScheduledItemState, SetScheduledItemState] = useState("no");
  const [loaderAddItem, setLoaderAddItem] = useState(false);

  const schema = object({
    description: string(" Description must be a string.", [
      minLength(1, translate?.addItemModalTranslate?.inputErrors?.decriptionRequired),
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
        name: string(),
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
  }, [editItem, editItemDetail, reset, setValue]);

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
      room:
        (data?.room && {
          id: data?.room?.id,
          roomName: data?.room?.name,
        }) ||
        undefined,
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
    const addItemRes = await addContentItem(formData, token);

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
    setDisable(true);
    setLoaderAddItem(true);
    const formData = await submitFormData(data);
    const addItemRes = await addContentItem(formData, token);

    if (addItemRes?.status === 200) {
      await closeModal();
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
    setLoaderAddItem(false);
  };
  const handleUpdate = async (data: Output<typeof schema>) => {
    setLoaderAddItem(true);
    const formData = await submitFormData(data);

    const updateItemRes = await updateContentItem(formData, token);

    if (updateItemRes?.status === 200) {
      await closeModal();

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
    setLoaderAddItem(false);
  };

  const FooterComp = () => {
    return (
      <>
        {editItem ? (
          <div className={addClaimFormStyle.modalWidth}>
            <div className={clsx(addClaimFormStyle.addItemButton, "m-4")}>
              <div className={addClaimFormStyle.centerAlign}>
                <a
                  className={addClaimFormStyle.pointerCursor}
                  onClick={async () => {
                    await closeModal();
                  }}
                >
                  Cancel
                </a>
              </div>
              <div className={addClaimFormStyle.centerAlign}>
                <GenericButton
                  label="Update Item"
                  type="submit"
                  onClick={handleSubmit(handleUpdate)}
                  size="medium"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={addClaimFormStyle.modalWidth}>
            <div className={clsx(addClaimFormStyle.addItemButton, "m-4")}>
              <div className={addClaimFormStyle.centerAlign}>
                <a
                  type="submit"
                  className={addClaimFormStyle.pointerCursor}
                  onClick={handleSubmit(handleSaveAndNext)}
                >
                  {
                    translate?.addItemModalTranslate?.inputFields
                      ?.saveAndAddAnotherItemLink
                  }
                </a>
              </div>

              <div className={addClaimFormStyle.centerAlign}>
                <a className={addClaimFormStyle.pointerCursor} onClick={() => reset()}>
                  Reset
                </a>
              </div>
              <div className={addClaimFormStyle.centerAlign}>
                <GenericButton
                  label={translate?.addItemModalTranslate?.inputFields?.addItemBtn ?? ""}
                  type="submit"
                  size="medium"
                  disabled={disable}
                  onClick={handleSubmit(formSubmit)}
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
      onClose={async () => await closeModal(true)}
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
          contentData={contentData}
          loaderAddItem={loaderAddItem}
          token={token}
          claimNumber={claimNumber}
          claimId={claimId}
        />
      }
      headingName={
        editItem
          ? "Item# " + editItemDetail.itemNumber
          : translate?.addItemModalTranslate?.modalHeading
      }
      modalWidthClassName={addClaimFormStyle.modalWidth}
      footerContent={<FooterComp />}
    ></Modal>
  );
};

const mapStateToProps = (state: any) => ({
  editItemDetail: state.claimContentdata.editItemDetail,
  token: selectAccessToken(state),
  claimNumber: selectSessionClaimNumber(state),
  claimId: selectSessionClaimId(state),
});
const mapDispatchToProps = {
  addNotification,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AddItemModal);
