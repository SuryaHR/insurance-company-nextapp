import React from "react";
import orginalItemFormStyle from "./orginalItemForm.module.scss";
import clsx from "clsx";
import GenericInput from "@/components/common/GenericInput";
import GenericSelect from "@/components/common/GenericSelect";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import EnumStoreSlice from "@/reducers/EnumStoreSlice";
import { fetchSubCategory } from "@/reducers/LineItemDetail/LineItemThunkService";
import {
  updateLineItem,
  updateOnCategoryChange,
  updateOnSubCategoryChange,
} from "@/reducers/LineItemDetail/LineItemDetailSlice";
import useDebounce from "@/hooks/useDebounce";
import { unknownObjectType } from "@/constants/customTypes";
import Tooltip from "@/components/common/ToolTip";

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
    getValues,
    setValue,
    fetchSubCategory,
    updateOnCategoryChange,
    updateOnSubCategoryChange,
    updateLineItem,
  } = props;

  const debounce = useDebounce(updateLineItem, 100);

  const { onChange: quantityOnChange, ...quantityRegister } = register("quantity");
  const { onChange: insuredPriceOnChange, ...insuredPriceRegister } =
    register("insuredPrice");

  const updateTotalStatedAmount = () => {
    const [insuredPrice, quantity] = getValues(["insuredPrice", "quantity"]);
    setValue("totalStatedAmount", (insuredPrice ?? 0) * (quantity ?? 0));
  };

  const handleApplyTax = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLineItem({ applyTax: e.target.value === "no" ? false : true });
  };

  const handleScheduleItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLineItem({ isScheduledItem: e.target.value === "no" ? false : true });
  };

  return (
    <div className={orginalItemFormStyle.root}>
      <div className={orginalItemFormStyle.heading}>Original Item</div>
      <div className={orginalItemFormStyle.formContainer}>
        <div className={clsx(orginalItemFormStyle.formGroup, orginalItemFormStyle.row1)}>
          <label htmlFor="itemDesc" className={orginalItemFormStyle.label}>
            Original Item Description
          </label>
          <textarea
            id="itemDesc"
            className={orginalItemFormStyle.textarea}
            placeholder="Description"
            {...register("description")}
            onChange={(e: React.FocusEvent<HTMLInputElement>) =>
              debounce({ description: e.target.value ?? "" })
            }
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
                Category
              </label>
              <div className={orginalItemFormStyle.formFieldTooltip}>
                <GenericSelect
                  menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                  id="category"
                  value={
                    lineItem?.category
                      ? {
                          categoryId: lineItem?.category?.id,
                          categoryName: lineItem?.category?.name,
                        }
                      : null
                  }
                  options={category}
                  getOptionLabel={(option: { categoryName: any }) => option.categoryName}
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
                  }}
                />
                <Tooltip
                  className={orginalItemFormStyle.infoIconContainer}
                  text={
                    lineItem?.category?.name
                      ? lineItem?.category?.name
                      : "Select Category"
                  }
                />
              </div>
            </div>
            <div className={orginalItemFormStyle.formControl}>
              <label htmlFor="subCategory" className={orginalItemFormStyle.label}>
                Sub-Category
              </label>
              <div className={orginalItemFormStyle.formFieldTooltip}>
                <GenericSelect
                  menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                  id="subCategory"
                  value={lineItem.subCategory}
                  options={subCategory}
                  getOptionLabel={(option: { name: string }) => option.name}
                  getOptionValue={(option: { id: number }) => option.id}
                  onChange={(
                    e: {
                      id: number;
                      name: string;
                    } | null
                  ) => {
                    updateOnSubCategoryChange(e);
                  }}
                />
                <Tooltip
                  className={orginalItemFormStyle.infoIconContainer}
                  text={
                    lineItem?.subCategory?.name
                      ? lineItem?.subCategory?.name
                      : "Select SubCategory"
                  }
                />
              </div>
            </div>
          </div>
          <div className={orginalItemFormStyle.standardReplacement}>
            <div>Standard Replacement</div>
            <div>$0.00</div>
          </div>
        </div>
        <div className={orginalItemFormStyle.formGroup}>
          <label htmlFor="cost_per_unit" className={orginalItemFormStyle.label}>
            Cost Per Unit
          </label>
          <GenericInput
            id="cost_per_unit"
            type="number"
            labelClassname={orginalItemFormStyle.label}
            placeholder="Stated Value(per unit)"
            onChange={(e: any) => {
              insuredPriceOnChange(e);
              updateTotalStatedAmount();
              debounce({ insuredPrice: +(e.target.value ?? 0) });
            }}
            {...insuredPriceRegister}
          />
        </div>
        <div className={orginalItemFormStyle.formGroup}>
          <label htmlFor="qty_lost" className={orginalItemFormStyle.label}>
            Qty Lost / Damaged
          </label>
          <GenericInput
            id="qty_lost"
            type="number"
            labelClassname={orginalItemFormStyle.label}
            placeholder="Quantity"
            onChange={(e: React.FocusEvent<HTMLInputElement>) => {
              quantityOnChange(e);
              updateTotalStatedAmount();
              debounce({ quantity: +(e.target.value ?? 0) });
            }}
            {...quantityRegister}
          />
        </div>
        <div className={orginalItemFormStyle.formGroup}>
          <label htmlFor="total_lost" className={orginalItemFormStyle.label}>
            Total Cost
          </label>
          <GenericInput
            id="total_lost"
            labelClassname={orginalItemFormStyle.label}
            disabled={true}
            {...register("totalStatedAmount")}
          />
        </div>
        <div className={clsx(orginalItemFormStyle.itemAge)}>
          <label className={orginalItemFormStyle.label}>Age of Item</label>
          <div className={orginalItemFormStyle.itemAgeFormGroup}>
            <GenericInput
              label="(Years)"
              type="number"
              formControlClassname={orginalItemFormStyle.itemAgeFormControl}
              inputFieldWrapperClassName={orginalItemFormStyle.inputFieldWrapper}
              {...register("ageYears")}
              onChange={(e: React.FocusEvent<HTMLInputElement>) =>
                debounce({ ageYears: +(e.target.value ?? 0) })
              }
            />
            <GenericInput
              label="(Months)"
              type="number"
              formControlClassname={orginalItemFormStyle.itemAgeFormControl}
              inputFieldWrapperClassName={orginalItemFormStyle.inputFieldWrapper}
              {...register("ageMonths")}
              onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                const month = e.target.value;
                debounce({ ageMonths: +(month ?? 0) });
              }}
            />
          </div>
        </div>
        <div className={orginalItemFormStyle.tax}>
          <label className={orginalItemFormStyle.label}>
            Apply Taxes({lineItem?.taxRate}%)
          </label>
          <div className={orginalItemFormStyle.taxFormGroup}>
            <GenericInput
              type="radio"
              label="Yes"
              value="yes"
              name="applyTax"
              checked={lineItem?.applyTax}
              formControlClassname={orginalItemFormStyle.radioFormControl}
              inputFieldWrapperClassName={orginalItemFormStyle.inputWrapper}
              onChange={handleApplyTax}
            />
            <GenericInput
              type="radio"
              label="No"
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
          <GenericInput
            label="Brand / Manufacturer"
            placeholder="Brand"
            labelClassname={orginalItemFormStyle.label}
            {...register("brand")}
            onChange={(e: React.FocusEvent<HTMLInputElement>) =>
              debounce({ brand: e.target.value ? e.target.value : null })
            }
          />
        </div>
        <div className={orginalItemFormStyle.formGroup}>
          <GenericInput
            label="Model"
            labelClassname={orginalItemFormStyle.label}
            placeholder="Model"
            {...register("model")}
            onChange={(e: React.FocusEvent<HTMLInputElement>) =>
              debounce({ model: e.target.value ? e.target.value : null })
            }
          />
        </div>
        <div
          className={clsx(
            orginalItemFormStyle.formGroup,
            orginalItemFormStyle.startFromCol1
          )}
        >
          <label htmlFor="purchasedFrom" className={orginalItemFormStyle.label}>
            Purchased From
          </label>
          <GenericSelect
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            id="originallyPurchasedFrom"
            options={retailer}
            value={lineItem?.originallyPurchasedFrom}
            getOptionLabel={(option: { name: string }) => option.name}
            getOptionValue={(option: { id: number }) => option.id}
            onChange={(e: unknownObjectType) => {
              updateLineItem({ originallyPurchasedFrom: e });
            }}
          />
        </div>
        <div className={orginalItemFormStyle.formGroup}>
          <label htmlFor="purchasedMethod" className={orginalItemFormStyle.label}>
            Purchased Method
          </label>
          <GenericSelect
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            id="purchaseMethod"
            value={lineItem?.purchaseMethod}
            options={paymentTypes}
            onChange={(e: unknownObjectType) => {
              updateLineItem({ purchaseMethod: e });
            }}
          />
        </div>
        <div
          className={clsx(
            orginalItemFormStyle.formGroup,
            orginalItemFormStyle.startFromCol1
          )}
        >
          <label htmlFor="condition" className={orginalItemFormStyle.label}>
            Condition
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
            }}
          />
        </div>
        <div className={orginalItemFormStyle.formGroup}>
          <label htmlFor="room" className={orginalItemFormStyle.label}>
            Room
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
            <span className="text-danger">*</span>Scheduled Item
          </label>
          <div className={orginalItemFormStyle.scheduledItemFormGroup}>
            <GenericInput
              type="radio"
              label="Yes"
              value="yes"
              name="scheduledItem"
              checked={lineItem?.isScheduledItem}
              formControlClassname={orginalItemFormStyle.radioFormControl}
              inputFieldWrapperClassName={orginalItemFormStyle.inputWrapper}
              onChange={handleScheduleItem}
            />
            <GenericInput
              type="radio"
              label="No"
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
            <GenericInput
              label={
                <span>
                  <span className="text-danger">*</span> Scheduled Amount
                </span>
              }
              type="number"
              labelClassname={orginalItemFormStyle.label}
              placeholder="scheduledAmount"
              {...register("scheduleAmount")}
              onChange={(e: React.FocusEvent<HTMLInputElement>) =>
                debounce({ scheduleAmount: e.target.value ? e.target.value : null })
              }
            />
          </div>
        )}
        <div
          className={clsx(
            orginalItemFormStyle.formGroup,
            orginalItemFormStyle.startFromCol1
          )}
        >
          <label className={orginalItemFormStyle.label}>Pictures, Recipts etc.</label>
          <a href="#">Click to add attachment(s)</a>
        </div>
      </div>
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
});

const mapDispatchToProps = {
  fetchSubCategory,
  updateOnCategoryChange,
  updateLineItem,
  updateOnSubCategoryChange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(OrginalItemForm);
