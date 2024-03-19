import React, { useEffect, useMemo, useState } from "react";
import GenericButton from "@/components/common/GenericButton/index";
import { getUSDCurrency } from "@/utils/utitlity";
import { RiCloseCircleFill } from "react-icons/ri";
import receiptMapperStyle from "../../../receiptMapperComponent.module.scss";
import { object, Output, nullish, any } from "valibot";
import { ConnectedProps, connect } from "react-redux";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useParams } from "next/navigation";

import useCustomForm from "@/hooks/useCustomForm";
import { Controller } from "react-hook-form";
import { addSelectedMappPoint } from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import { isEmpty } from "lodash";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import {
  addAttachitemreplacementcost,
  getClaimedItems,
  updateMappedLineItem,
} from "@/services/_core_logic_services/CoreReceiptMapperService";
import { addClaimedItemsListData } from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericCurrencyFormat from "@/components/common/GenericInput/GenericCurrencyFormat";
import GenericPercentFormat from "@/components/common/GenericInput/GenericPercentFormat";
import selectSessionTaxRate from "@/reducers/Session/Selectors/selectSessionTaxRate";

interface typeProps {
  openDeleteModal: any;
  selectedMappedItem: any;
  pageNumber: number;
  offsetX: number;
  offsetY: number;
  closeModal: any;
  setListLoader: any;
}

const MapperPopup: React.FC<connectorType & typeProps> = ({
  addNotification,
  openDeleteModal,
  selectedMappedItem,
  selectedPdf,
  claimedItemsList,
  pageNumber,
  offsetX,
  offsetY,
  closeModal,
  addSelectedMappPoint,
  setListLoader,
  token,
  addClaimedItemsListData,
  taxRate,
}) => {
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const { claimId } = useParams();
  const [isTaxApply, setApplyTax] = useState<boolean>(false);
  const [reciptValue, setReciptValue] = useState<number>(0);
  const [itemDataArr, setItemData] = useState<any>({
    acv: 0,
    itemId: 0,
  });
  const saleTaxRate = taxRate;

  const schema = object({
    itemNumber: any(),
    quantity: any(),
    materialCost: any(),
    salesTax: nullish(any()),
    shipping: nullish(any()),
  });
  const defaultValue = useMemo(() => {
    return {
      itemNumber: selectedMappedItem.itemNumber ?? null,
      quantity: selectedMappedItem.quantity ?? null,
      materialCost: Number(selectedMappedItem.materialCost) ?? 0,
      salesTax: selectedMappedItem.salesTax ?? saleTaxRate,
      shipping: selectedMappedItem.shipping ?? 0,
    };
  }, [selectedMappedItem, saleTaxRate]);

  const { register, handleSubmit, control, setValue, watch, reset } = useCustomForm(
    schema,
    defaultValue
  );

  const getItemData = (value: any) => {
    const itemData = claimedItemsList.filter(
      (item: any) => Number(item.itemNumber) === Number(value)
    );
    if (isEmpty(itemData)) {
      setItemData([]);
      validateForm("itemNumber", value);
    } else if (
      !isEmpty(itemData) &&
      !selectedMappedItem.isMapped &&
      (itemData[0]?.status?.status === "REPLACED" ||
        itemData[0]?.status?.status === "SETTLED")
    ) {
      setItemData([]);
      addNotification({
        message: "All quantity of the item got replaced. Item can't be mapped!",
        id: "itemNumber_replaced_error",
        status: "warning",
      });
    } else {
      const index = selectedMappedItem.subRowIndex
        ? Number(selectedMappedItem.subRowIndex)
        : 0;
      let editId = null;
      if (selectedMappedItem.subRowIndex === 0 && itemData[0]?.replaceItems) {
        editId = itemData[0]?.replaceItems[index]?.id;
      } else if (selectedMappedItem.subRowIndex) {
        editId = selectedMappedItem.subRowIndex;
      } else {
        editId = null;
      }

      const remainingQuantity =
        itemData[0].quantity !== itemData[0].totalQuantityReplaced
          ? itemData[0].quantity - itemData[0].totalQuantityReplaced
          : itemData[0].quantity;
      const items = {
        acv: itemData[0].acv,
        itemId: itemData[0].id,
        applyTax: itemData[0].applyTax,
        editId: editId,
        remainingQuantity: remainingQuantity,
        replacementExposure: itemData[0].replacementExposure,
        replacementExposureBreakDown:
          itemData[0]?.replacementExposure / itemData[0]?.quantity,
        cashPaidBreakDown: itemData[0].cashPaid / itemData[0].quantity,
        averageACVQuantity: itemData[0].acv / itemData[0].quantity,
        subRowIndex: index,
      };
      if (itemData[0].applyTax === false) {
        setApplyTax(true);
        setValue("salesTax", 0);
      } else {
        setApplyTax(false);
        setValue("salesTax", itemData[0].taxRate ?? saleTaxRate);
      }

      setItemData(items);
    }
  };
  const handleCalculation = (name: string, value: any) => {
    validateForm(name, value);

    const materialCost = Number(watch("materialCost") ?? 0);
    const salesTax = Number(watch("salesTax") ?? 0);
    const shipping = Number(watch("shipping") ?? 0);

    const taxValue = (materialCost * salesTax) / 100;
    const currRecieptvalue = materialCost + taxValue + shipping;

    setReciptValue(currRecieptvalue);
  };
  const resetForm = (itemNumber: number) => {
    addSelectedMappPoint({
      selectedMappedItem: {
        itemNumber: itemNumber,
      },
    });
    reset();
  };
  useEffect(() => {
    setValue("itemNumber", selectedMappedItem.itemNumber ?? null);
    if (selectedMappedItem.itemNumber) {
      getItemData(selectedMappedItem.itemNumber);
      handleCalculation("itemNumber", selectedMappedItem.itemNumber);
    }
    setValue("quantity", selectedMappedItem.quantity ?? null);
    if (selectedMappedItem.applyTax === false) {
      setApplyTax(true);
      setValue("salesTax", 0);
    } else {
      setApplyTax(false);
      setValue(
        "salesTax",
        selectedMappedItem.isMapped ? selectedMappedItem.taxRate : saleTaxRate
      );
    }
    setValue("materialCost", selectedMappedItem.materialCost ?? 0);
    setValue("shipping", selectedMappedItem.shipping ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMappedItem]);

  // console.log(watch());

  const validateForm = (name: string | null, data: any) => {
    const itemNumberKey = name ?? "itemNumber";
    if (itemNumberKey === "itemNumber" && isEmpty(itemDataArr)) {
      addNotification({
        message: "Item Id is not valid",
        id: "itemNumber_zero_error",
        status: "warning",
      });
      return false;
    }

    const quantityKey = name ?? "quantity";
    const qantityValue = name ? data : data.quantity;
    if (quantityKey === "quantity" && Number(qantityValue) === 0) {
      addNotification({
        message: "Quantity cannot be zero",
        id: "quantity_zero_error",
        status: "warning",
      });
      return false;
    }

    const itemQuantity = watch("quantity");
    if (itemQuantity > itemDataArr.remainingQuantity) {
      addNotification({
        message: "Item Quantity should not be greater than available quantity.",
        id: "quantity_more_error",
        status: "warning",
      });
      setValue("quantity", itemDataArr.remainingQuantity);
    }

    const materialCostKey = name ?? "materialCost";
    const materialCostValue = name ? data : data.materialCost;
    if (
      name === null &&
      materialCostKey === "materialCost" &&
      Number(materialCostValue) === 0
    ) {
      addNotification({
        message: "Material Cost cannot be zero",
        id: "materialCost_zero_error",
        status: "warning",
      });
      return false;
    }

    return true;
  };
  const submitForm = async (data: Output<typeof schema>) => {
    setListLoader(true);
    if (validateForm(null, data)) {
      const replacementExposureMapItems =
        itemDataArr?.replacementExposureBreakDown * data.quantity;
      const cashPaidForMapItems = itemDataArr?.cashPaidBreakDown * data.quantity;
      //Hold over for item
      let hold = 0;
      if (reciptValue > replacementExposureMapItems) {
        hold = replacementExposureMapItems - cashPaidForMapItems;
      } else {
        hold = reciptValue - cashPaidForMapItems;
      }
      let HoldoverValue = hold > 0 ? hold : 0;
      //Check if the value is Nan or not
      if (isNaN(HoldoverValue)) {
        HoldoverValue = 0;
      }
      const payload = {
        acv: itemDataArr?.acv,
        itemId: itemDataArr?.itemId,
        offsetX,
        offsetY,
        pdf: {
          pdfId: selectedPdf.pdfId,
        },
        PDFPageNumber: pageNumber,
        rcv: reciptValue,
        receiptValue: reciptValue,
        quantity: data.quantity,
        holdOver: HoldoverValue,
        holdOverDue: HoldoverValue,
        holdOverPaid: 0,
        cashPaid: 0,
        materialCost: data.materialCost,
        salesTax: data.salesTax,
        shipping: data.shipping,
        replacementExposure: replacementExposureMapItems,
        id: itemDataArr?.editId,
      };
      let result = null;

      if (itemDataArr.editId) {
        result = await updateMappedLineItem(payload, token);
      } else {
        result = await addAttachitemreplacementcost(payload, token);
      }
      if (result) {
        closeModal();
        const claimedResp = await getClaimedItems(
          {
            claimId: claimId,
            reqForReceiptMapper: true,
          },
          token
        );
        if (claimedResp.status === 200) {
          addClaimedItemsListData({ claimedData: claimedResp });
        }
        addSelectedMappPoint({
          selectedMappedItem: {
            ...payload,
            itemNumber: data?.itemNumber,
            applyTax: itemDataArr?.applyTax,
            taxRate: payload.salesTax,
            isMapped: true,
            subRowIndex: itemDataArr?.subRowIndex,
          },
        });
        addNotification({
          message: "Item Mapped Added Successfully",
          id: "map_success",
          status: "success",
        });
      } else {
        addNotification({
          message: "Something Went Wrong",
          id: "map_error",
          status: "error",
        });
      }
    }
    setListLoader(false);
  };

  return (
    <>
      <div className={receiptMapperStyle.mapperpopup}>
        <div className={receiptMapperStyle.mappercloseIcon} role="button">
          <RiCloseCircleFill size="25" fill="#cc4848" id="mapper-close" />
        </div>
        <div className={receiptMapperStyle.formRow}>
          <div className={receiptMapperStyle.formCellHeading}>Item Id</div>
          <div className={receiptMapperStyle.formCellInput}>
            <GenericUseFormInput
              id="itemNumber"
              placeholder={translate?.receiptMapperTranslate?.claimedItems?.itemId}
              {...register("itemNumber")}
              type={"number"}
              inputFieldClassname="hideInputArrow"
              onInput={(e: any) => {
                if (isNaN(e.target.value)) {
                  e.target.value = "";
                  e.preventDefault();
                }
              }}
              onBlur={(e: any) => {
                getItemData(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={receiptMapperStyle.formRow}>
          <div className={receiptMapperStyle.formCellHeading}>
            {translate?.receiptMapperTranslate?.claimedItems?.quantityReplaced}
          </div>
          <div className={receiptMapperStyle.formCellInput}>
            <GenericUseFormInput
              id="quantity"
              placeholder={translate?.receiptMapperTranslate?.claimedItems?.quantity}
              {...register("quantity")}
              type={"number"}
              inputFieldClassname="hideInputArrow"
              onInput={(e: any) => {
                if (isNaN(e.target.value)) {
                  e.target.value = "";
                  e.preventDefault();
                }
              }}
              onBlur={(e: any) => {
                handleCalculation(e.target.id, e.target.value);
              }}
            />
          </div>
        </div>
        <div className={receiptMapperStyle.formRow}>
          <div className={receiptMapperStyle.formCellHeading}>
            {translate?.receiptMapperTranslate?.claimedItems?.materialCost}
          </div>
          <div className={receiptMapperStyle.formCellInput}>
            <Controller
              name="materialCost"
              control={control}
              render={({
                field: { onChange: materialCostChange, name: name, value: value },
              }: any) => (
                <GenericCurrencyFormat
                  placeholder="$0.00"
                  inputFieldClassname="hideInputArrow"
                  handleChange={({ value }) => {
                    materialCostChange(value);
                    handleCalculation(name, value);
                  }}
                  defaultValue={value}
                />
              )}
            />
          </div>
        </div>
        <div className={receiptMapperStyle.formRow}>
          <div className={receiptMapperStyle.formCellHeading}>
            {translate?.receiptMapperTranslate?.claimedItems?.salesTax}
          </div>
          <div className={receiptMapperStyle.formCellInput}>
            <Controller
              name="salesTax"
              control={control}
              render={({
                field: { onChange: salesTaxChange, name: name, value: value },
              }: any) => (
                <GenericPercentFormat
                  placeholder="0.00%"
                  inputFieldClassname="hideInputArrow"
                  id="salesTax"
                  handleChange={({ value, clbk }) => {
                    salesTaxChange(value);
                    const currValue = +value;
                    if (currValue > 99) {
                      clbk && clbk("99");
                      setValue("salesTax", 99);
                    }
                    handleCalculation(name, value);
                  }}
                  disabled={isTaxApply}
                  defaultValue={value}
                />
              )}
            />
          </div>
        </div>
        <div className={receiptMapperStyle.formRow}>
          <div className={receiptMapperStyle.formCellHeading}>
            {translate?.receiptMapperTranslate?.claimedItems?.shipping}
          </div>
          <div className={receiptMapperStyle.formCellInput}>
            <Controller
              name="shipping"
              control={control}
              render={({
                field: { onChange: shippingChange, name: name, value: value },
              }: any) => (
                <GenericCurrencyFormat
                  placeholder="$0.00"
                  inputFieldClassname="hideInputArrow"
                  handleChange={({ value }) => {
                    shippingChange(value);
                    handleCalculation(name, value);
                  }}
                  defaultValue={value}
                />
              )}
            />{" "}
          </div>
        </div>
        <div className={receiptMapperStyle.formRow}>
          <div className={receiptMapperStyle.formCellHeading}>
            {translate?.receiptMapperTranslate?.claimedItems?.receiptValuePop}
          </div>
          <div className={`${receiptMapperStyle.formCellInput} w-100`}>
            <b>{getUSDCurrency(reciptValue)}</b>
          </div>
        </div>
        <div className={receiptMapperStyle.formButton}>
          <GenericButton
            label={translate?.receiptMapperTranslate?.claimedItems?.reset}
            theme="linkBtn"
            size="small"
            btnClassname="ps-0"
            onClick={() => resetForm(watch("itemNumber"))}
          />
          <GenericButton
            label={translate?.receiptMapperTranslate?.claimedItems?.save}
            size="small"
            onClick={handleSubmit(submitForm)}
          />
          <GenericButton
            label={translate?.receiptMapperTranslate?.claimedItems?.delete}
            theme="deleteBtn"
            size="small"
            onClick={() => openDeleteModal()}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  selectedPdf: state.receiptMapper.selectedPdf,
  selectedMappedItem: state.receiptMapper.selectedMappedItem,
  claimedItemsList: state.claimedItems.claimedItemsList,
  token: selectAccessToken(state),
  taxRate: selectSessionTaxRate(state),
});

const mapDispatchToProps = {
  addNotification,
  addSelectedMappPoint,
  addClaimedItemsListData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(MapperPopup);
