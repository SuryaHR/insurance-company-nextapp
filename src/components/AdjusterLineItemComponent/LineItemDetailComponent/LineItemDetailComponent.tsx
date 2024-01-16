import React, { useEffect, useState } from "react";
import lineItemDetailComponentStyle from "./lineItemDetailComponent.module.scss";
import GroupedActionButtons from "./GroupedActionButtons";
import OrginalItemForm from "./OrginalItemForm";
import ReplacementItemSection from "./ReplacementItemSection";
import WebComparables from "./WebComparables";
import AddedComparables from "./AddedComparables";
import useCustomForm from "@/hooks/useCustomForm";
import { Output, any, minLength, object, string } from "valibot";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
// import Modal from "@/components/common/ModalPopups";
// import GenericButton from "@/components/common/GenericButton";
import CustomComparable from "./CustomComparable";
import useBodyScrollbar from "@/hooks/useBodyScrollbar";
import Modal from "@/components/common/ModalPopups";
import GenericButton from "@/components/common/GenericButton";
import { deleteClaimItem } from "@/services/ClaimContentListService";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { useRouter } from "next/navigation";
import { fetchClaimContentAction } from "@/reducers/ClaimData/ClaimContentSlice";

function LineItemDetailComponentForm({ rapidDivRef }: { rapidDivRef: any }) {
  const router = useRouter();
  const { hideScroll, showScroll } = useBodyScrollbar();
  const dispatch = useAppDispatch();
  const lineItem = useAppSelector(
    (state) => state[EnumStoreSlice.LINE_ITEM_DETAIL]?.lineItem
  );
  const CRN = useAppSelector((state) => state.session?.CRN);
  const [openCustomComparableModal, setOpenCustomComparableModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const schema = object({
    description: string("Item description", [minLength(0)]),
    insuredPrice: any(),
    quantity: any(),
    scheduleAmount: any(),
    totalStatedAmount: any(),
    ageYears: any(),
    ageMonths: any(),
    brand: any(),
    model: any(),
  });

  useEffect(() => {
    if (openCustomComparableModal || confirmDelete) {
      hideScroll();
    } else {
      showScroll();
    }
    return () => showScroll();
  }, [openCustomComparableModal, confirmDelete, hideScroll, showScroll]);

  const defaultValue = {
    description: lineItem?.description,
    insuredPrice: lineItem?.insuredPrice,
    quantity: lineItem?.quantity,
    scheduleAmount: lineItem?.scheduleAmount,
    totalStatedAmount: lineItem?.totalStatedAmount,
    ageYears: lineItem?.ageYears,
    ageMonths: lineItem?.ageMonths,
    brand: lineItem?.brand,
    model: lineItem?.model,
  };

  const { register, handleSubmit, control, formState, getValues, setValue } =
    useCustomForm(schema, defaultValue);
  console.log("Error>>", formState.errors);

  const handleFormSubmit = (data: Output<typeof schema>) => {
    console.log("handleFormSubmit>>>>", data);
    try {
      const payload = {
        registrationNumber: CRN,
        comparableItems: [],
        claimItem: {
          acv: lineItem.acv,
          acvTax: lineItem.acvTax,
          acvTotal: lineItem.acvTotal,
          adjusterDescription: lineItem?.adjusterDescription,
          source: lineItem.source,
          ageMonths: lineItem.ageMonths,
          ageYears: lineItem.ageYears,
          appraisalDate: lineItem.appraisalDate,
          appraisalValue: lineItem.appraisalValue,
          approvedItemValue: lineItem.approvedItemValue,
          assignedTo: lineItem.assignedTo,
          brand: lineItem.brand,
          categoryLimit: lineItem.categoryLimit,
          claimId: lineItem.claimId,
          claimNumber: lineItem.claimNumber,
          dateOfPurchase: lineItem.dateOfPurchase,
          depriciationRate: lineItem.depriciationRate,
          description: lineItem.description,
          applyTax: lineItem.applyTax,
          holdOverPaymentDate: lineItem.holdOverPaymentDate,
          holdOverPaymentMode: lineItem.holdOverPaymentMode,
          holdOverPaymentPaidAmount: lineItem.holdOverPaymentPaidAmount,
          itemOverage: lineItem.itemOverage,
          scheduleAmount: lineItem.scheduleAmount,
          deductibleAmount: lineItem.deductibleAmount,
          individualLimitAmount: lineItem.individualLimitAmount,
          totalStatedAmount: lineItem.totalStatedAmount,
          id: lineItem.id,
          itemUID: lineItem.itemUID,
          insuredPrice: lineItem.insuredPrice > 0 ? lineItem.insuredPrice : 0,
          isReplaced: lineItem.isReplaced,
          replacementQty: lineItem.replacementQty,
          replacedItemPrice: lineItem.replacedItemPrice,
          isScheduledItem: lineItem.isScheduledItem,
          itemName: lineItem.itemName,
          itemType: lineItem.itemType,
          itemUsefulYears: lineItem.itemUsefulYears,
          model: lineItem.model,
          paymentDetails: lineItem.paymentDetails,
          quantity: lineItem.quantity > 0 ? lineItem.quantity : 0,
          quotedPrice: lineItem.quotedPrice,
          rcv: lineItem.rcv,
          rcvTax: lineItem.rcvTax,
          rcvTotal: lineItem.rcvTotal,
          receiptValue: lineItem.receiptValue > 0 ? lineItem.receiptValue : 0,
          depreciationAmount:
            lineItem.depreciationAmount > 0 ? lineItem.depreciationAmount : 0,
        },
      };
      console.log("payload:::", payload);
    } catch (error) {
      console.log("error>>>>", error);
    }
  };

  const closeCustomComparable = () => {
    setOpenCustomComparableModal(false);
  };

  // Delete item
  const showDeleteModal = () => setConfirmDelete(true);
  const closeDeleteModal = () => setConfirmDelete(false);

  const handleDeleteItem = async () => {
    const { id, itemUID, claimId } = lineItem;

    const res = await deleteClaimItem({ id, itemUID });

    if (res) {
      dispatch(
        addNotification({
          message: res ?? "Successfully deleted item.",
          id,
          status: "success",
        })
      );
      dispatch(fetchClaimContentAction({ claimId: claimId.toString() }));
      router.replace(`/adjuster-property-claim-details/${claimId}`);
    } else {
      dispatch(
        addNotification({
          message: "Something went wrong.",
          id,
          status: "error",
        })
      );
    }
    closeDeleteModal();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={lineItemDetailComponentStyle.root}
    >
      <CustomComparable
        closeCustomComparable={closeCustomComparable}
        openCustomComparableModal={openCustomComparableModal}
      />
      <Modal
        isOpen={confirmDelete}
        onClose={closeDeleteModal}
        headingName="Delete Lost/Damaged Item"
        overlayClassName={lineItemDetailComponentStyle.deleteModalOverlay}
        footerContent={
          <div className={lineItemDetailComponentStyle.deleteModalBtn}>
            <GenericButton label="No" theme="linkBtn" onClickHandler={closeDeleteModal} />
            <GenericButton label="Yes" size="small" onClickHandler={handleDeleteItem} />
          </div>
        }
        childComp={
          <p className={lineItemDetailComponentStyle.deleteModalMessage}>
            Are you sure you want to delete this item? <strong>Please Confirm!</strong>
          </p>
        }
        animate
        positionTop
        roundedBorder
      />

      <GroupedActionButtons onDeleteClick={showDeleteModal} />
      <div className={lineItemDetailComponentStyle.topItemSection}>
        <div ref={rapidDivRef} style={{ position: "absolute", top: 0 }} />
        <OrginalItemForm
          register={register}
          control={control}
          getValues={getValues}
          setValue={setValue}
        />
        <ReplacementItemSection
          showCustomComparableModal={() => setOpenCustomComparableModal(true)}
        />
      </div>
      <div className={lineItemDetailComponentStyle.bottomItemSection}>
        <WebComparables />
        <AddedComparables />
      </div>
    </form>
  );
}

export default LineItemDetailComponentForm;
