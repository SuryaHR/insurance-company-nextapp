"use-client";
import React, { useCallback, useEffect, useState } from "react";
import modalStyle from "./PayNowInvoice.module.scss";
import {
  getCustomerState,
  invoicePayment,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { selectVendor } from "@/services/_adjuster_services/ClaimService";
import GenericSelect from "@/components/common/GenericSelect";
import { rest } from "lodash";
import GenericButton from "@/components/common/GenericButton";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import CustomLoader from "@/components/common/CustomLoader";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";

interface PayNowInvoiceProps {
  payNowData: any;
  updateData: () => void;
}

interface payNowInvoiceState {
  name: any;
  addressLine1: any;
  addressLine2: any;
  city: any;
  state: any;
  zipCode: any;
  id: any;
  method: any;
  amount: any;
  checkNumber: any;
  bankAccNo: any;
  routingNumber: any;
  drawnOnBank: any;
  paymentDate: any;
  referenceNumber: any;
}

const PayNowInvoice: React.FC<PayNowInvoiceProps> = ({ payNowData, updateData }) => {
  const initialPayNowInvoiceState: payNowInvoiceState = {
    name: { value: "", error: false, validationPattern: "" },
    addressLine1: { value: "", error: false, validationPattern: "" },
    addressLine2: { value: "", error: false, validationPattern: "" },
    city: { value: "", error: false, validationPattern: "" },
    state: { value: "", error: false, validationPattern: "" },
    zipCode: { value: "", error: false, validationPattern: /^\d{0,5}$/ },
    id: { value: "", error: false, validationPattern: "" },
    method: { value: "Check", error: false, validationPattern: "" },
    amount: {
      value: payNowData?.paymentInfo?.payAmount,
      error: false,
      validationPattern: "",
    },
    checkNumber: { value: "", error: false, validationPattern: /^\d+$/ },
    bankAccNo: { value: "", error: false, validationPattern: "" },
    routingNumber: { value: "", error: false, validationPattern: "" },
    drawnOnBank: { value: "", error: false, validationPattern: "" },
    paymentDate: { value: "", error: false, validationPattern: "" },
    referenceNumber: { value: "", error: false, validationPattern: /^\d+$/ },
  };

  const dispatch = useAppDispatch();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [stateData, setStateData] = useState<any>([]);
  const [disablePayNowBtn, setDisablePayNowBtn] = useState<boolean>(true);
  const [payNowInvoiceData, setPayNowInvoiceData] = useState<any>(
    initialPayNowInvoiceState
  );

  const init = useCallback(async () => {
    setIsLoader(true);
    const payNowDataParsed = payNowData?.vendor;
    const vendorId = payNowDataParsed?.vendorId;
    const vendorNumber = payNowDataParsed?.vendorNumber;
    try {
      const [stateList, vendorDetails] = await Promise.all([
        getCustomerState(true),
        selectVendor({ id: vendorId, registrationNumber: vendorNumber }),
      ]);

      setStateData(stateList?.data);
      setPayNowInvoiceData((prevState: any) => ({
        ...prevState,
        name: {
          value: vendorDetails?.data?.vendorName,
          error: false,
          validationPattern: payNowInvoiceData?.name?.validationPattern,
        },
        addressLine1: {
          value: vendorDetails?.data?.billingAddress?.streetAddressOne,
          error: false,
          validationPattern: payNowInvoiceData?.addressLine1?.validationPattern,
        },
        addressLine2: {
          value: vendorDetails?.data?.billingAddress?.streetAddressTwo,
          error: false,
          validationPattern: payNowInvoiceData?.addressLine2?.validationPattern,
        },
        city: {
          value: vendorDetails?.data?.billingAddress?.city,
          error: false,
          validationPattern: payNowInvoiceData?.city?.validationPattern,
        },
        state: {
          value: vendorDetails?.data?.billingAddress?.state,
          error: false,
          validationPattern: payNowInvoiceData?.state?.validationPattern,
        },
        zipCode: {
          value: vendorDetails?.data?.billingAddress?.zipcode,
          error: false,
          validationPattern: payNowInvoiceData?.zipCode?.validationPattern,
        },
        id: {
          value: vendorId,
          error: false,
          validationPattern: payNowInvoiceData?.id?.validationPattern,
        },
      }));
    } catch (error) {
      console.error("Error in init:", error);
    } finally {
      setIsLoader(false);
    }
  }, [
    payNowData?.vendor,
    payNowInvoiceData?.addressLine1?.validationPattern,
    payNowInvoiceData?.addressLine2?.validationPattern,
    payNowInvoiceData?.city?.validationPattern,
    payNowInvoiceData?.id?.validationPattern,
    payNowInvoiceData?.name?.validationPattern,
    payNowInvoiceData?.state?.validationPattern,
    payNowInvoiceData?.zipCode?.validationPattern,
  ]);

  useEffect(() => {
    init();
  }, [init]);

  const onChangePaymentMethod = (e: any) => {
    setPayNowInvoiceData((prevState: any) => ({
      ...prevState,
      method: { value: e.target.value, error: false, validationPattern: "" },
    }));
  };

  const onChange = (e: any) => {
    if (payNowInvoiceData[e.target.id]?.validationPattern !== "") {
      if (!payNowInvoiceData[e.target.id]?.validationPattern?.test(e.target.value)) {
        return;
      }
    }

    if (e.target.value.trim() == "") {
      setPayNowInvoiceData((prevState: any) => ({
        ...prevState,
        [e.target.id]: {
          value: e.target.value,
          error: true,
          validationPattern: payNowInvoiceData[e.target.id]?.validationPattern,
        },
      }));
    } else {
      setPayNowInvoiceData((prevState: any) => ({
        ...prevState,
        [e.target.id]: {
          value: e.target.value,
          error: false,
          validationPattern: payNowInvoiceData[e.target.id]?.validationPattern,
        },
      }));
    }

    if (payNowInvoiceData?.method?.value == "Check") {
      if (
        (e.target.id == "amount"
          ? e.target.value.trim() !== ""
          : JSON.stringify(payNowInvoiceData?.amount?.value).trim() !== "") &&
        (e.target.id == "checkNumber"
          ? e.target.value.trim() !== ""
          : payNowInvoiceData?.checkNumber?.value.trim() !== "") &&
        (e.target.id == "drawnOnBank"
          ? e.target.value.trim() !== ""
          : payNowInvoiceData?.drawnOnBank?.value.trim() !== "") &&
        (e.target.id == "paymentDate"
          ? e.target.value.trim() !== ""
          : payNowInvoiceData?.paymentDate?.value.trim() !== "")
      ) {
        setDisablePayNowBtn(false);
      } else {
        setDisablePayNowBtn(true);
      }
    } else {
      if (
        (e.target.id == "amount"
          ? e.target.value.trim() !== ""
          : JSON.stringify(payNowInvoiceData?.amount?.value).trim() !== "") &&
        (e.target.id == "bankAccNo"
          ? e.target.value.trim() !== ""
          : payNowInvoiceData?.bankAccNo?.value.trim() !== "") &&
        (e.target.id == "routingNumber"
          ? e.target.value.trim() !== ""
          : payNowInvoiceData?.routingNumber?.value.trim() !== "") &&
        (e.target.id == "drawnOnBank"
          ? e.target.value.trim() !== ""
          : payNowInvoiceData?.drawnOnBank?.value.trim() !== "") &&
        (e.target.id == "paymentDate"
          ? e.target.value.trim() !== ""
          : payNowInvoiceData?.paymentDate?.value.trim() !== "")
      ) {
        setDisablePayNowBtn(false);
      } else {
        setDisablePayNowBtn(true);
      }
    }
  };

  const onBlur = (e: any) => {
    if (e.target.value.trim() == "") {
      setPayNowInvoiceData((prevState: any) => ({
        ...prevState,
        [e.target.id]: {
          value: e.target.value,
          error: true,
          validationPattern: payNowInvoiceData[e.target.id]?.validationPattern,
        },
      }));
    } else {
      setPayNowInvoiceData((prevState: any) => ({
        ...prevState,
        [e.target.id]: {
          value: e.target.value,
          error: false,
          validationPattern: payNowInvoiceData[e.target.id]?.validationPattern,
        },
      }));
    }

    if (payNowInvoiceData?.method?.value == "Check") {
      if (
        JSON.stringify(payNowInvoiceData?.amount?.value).trim() !== "" &&
        payNowInvoiceData?.checkNumber?.value.trim() !== "" &&
        payNowInvoiceData?.drawnOnBank?.value.trim() !== "" &&
        payNowInvoiceData?.paymentDate?.value.trim() !== ""
      ) {
        setDisablePayNowBtn(false);
      } else {
        setDisablePayNowBtn(true);
      }
    } else {
      if (
        JSON.stringify(payNowInvoiceData?.amount?.value).trim() !== "" &&
        payNowInvoiceData?.bankAccNo?.value.trim() !== "" &&
        payNowInvoiceData?.routingNumber?.value.trim() !== "" &&
        payNowInvoiceData?.drawnOnBank?.value.trim() !== "" &&
        payNowInvoiceData?.paymentDate?.value.trim() !== ""
      ) {
        setDisablePayNowBtn(false);
      } else {
        setDisablePayNowBtn(true);
      }
    }
  };

  const payNow = async () => {
    const payload: any = {
      bankName: payNowInvoiceData?.drawnOnBank?.value,
      invoices: [{ id: payNowData?.invoiceDetails?.id }],
      payAmount: payNowInvoiceData?.amount?.value,
      vendorDetails: { vendorId: payNowInvoiceData?.id?.value },
    };

    if (payNowInvoiceData?.method?.value === "Check") {
      Object.assign(payload, {
        check: true,
        checkDate: payNowInvoiceData?.paymentDate?.value,
        checkNumber: payNowInvoiceData?.checkNumber?.value,
        remittAddress: {
          city: payNowInvoiceData?.city?.value,
          state: { id: payNowInvoiceData?.state?.value?.id },
          streetAddressOne: payNowInvoiceData?.addressLine1?.value,
          streetAddressTwo: payNowInvoiceData?.addressLine2?.value,
          zipcode: payNowInvoiceData?.zipcode?.value,
        },
      });
    } else {
      Object.assign(payload, {
        paymentDate: payNowInvoiceData?.paymentDate?.value,
        bankAccountNumber: payNowInvoiceData?.bankAccNo?.value,
        eft: true,
        routingNumber: payNowInvoiceData?.routingNumber?.value,
        referenceNumber: payNowInvoiceData?.referenceNumber?.value,
      });
    }

    try {
      const res: any = await invoicePayment(payload);
      const notification = {
        message: res?.message,
        id: res.status === 200 ? "payment_success" : "payment_error",
        status: res.status === 200 ? "success" : "error",
      };
      dispatch(addNotification(notification));
      if (res.status === 200) {
        updateData();
      }
    } catch (error: any) {
      dispatch(
        addNotification({ message: error?.message, id: "payment_error", status: "error" })
      );
    }
  };
  return (
    <React.Fragment>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <div className={`row ${modalStyle.formCont}`}>
        <div className="col-md-6">
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label
              className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft} ${modalStyle.paymentMethodLabel}`}
            >
              Payment Method
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                id="paymentMethod"
                checked={payNowInvoiceData?.method?.value == "Check"}
                type="radio"
                label="Check"
                value="Check"
                name="paymentMethod"
                formControlClassname={modalStyle.radioFormControl}
                inputFieldWrapperClassName={modalStyle.inputWrapper}
                onChange={onChangePaymentMethod}
                labelClassname={modalStyle.payMethodLabCls}
              />

              <GenericNormalInput
                id="paymentMethod"
                checked={payNowInvoiceData?.method?.value == "EFT"}
                type="radio"
                label="EFT"
                value="EFT"
                name="paymentMethod"
                formControlClassname={modalStyle.radioFormControl}
                inputFieldWrapperClassName={modalStyle.inputWrapper}
                onChange={onChangePaymentMethod}
                labelClassname={modalStyle.payMethodLabCls}
              />
            </div>
          </div>
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
              Amount
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                placeholder="Amount"
                id="amount"
                type="text"
                value={payNowInvoiceData?.amount?.value}
                onChange={onChange}
              />
            </div>
          </div>
          {payNowInvoiceData?.method?.value == "Check" && (
            <div className={`row ${modalStyle.paddingTB5}`}>
              <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
                Check Number
              </label>
              <div className="col-md-7 col-sm-6">
                <GenericNormalInput
                  autoComplete="off"
                  type="text"
                  placeholder="Check Number"
                  id="checkNumber"
                  value={payNowInvoiceData?.checkNumber?.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  errorMsg="Enter Check Number"
                  showError={payNowInvoiceData?.checkNumber?.error}
                />
              </div>
            </div>
          )}
          {payNowInvoiceData?.method?.value == "EFT" && (
            <div className={`row ${modalStyle.paddingTB5}`}>
              <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
                Bank Account No.
              </label>
              <div className="col-md-7 col-sm-6">
                <GenericNormalInput
                  autoComplete="off"
                  type="text"
                  placeholder="Bank Account No."
                  id="bankAccNo"
                  value={payNowInvoiceData?.bankAccNo.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  errorMsg="Enter Bank Account No."
                  showError={payNowInvoiceData?.bankAccNo?.error}
                />
              </div>
            </div>
          )}
          {payNowInvoiceData?.method?.value == "EFT" && (
            <div className={`row ${modalStyle.paddingTB5}`}>
              <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
                Routing Number
              </label>
              <div className="col-md-7 col-sm-6">
                <GenericNormalInput
                  autoComplete="off"
                  type="text"
                  placeholder="Routing Number"
                  id="routingNumber"
                  value={payNowInvoiceData?.routingNumber?.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  errorMsg="Enter Routing Number"
                  showError={payNowInvoiceData?.routingNumber?.error}
                />
              </div>
            </div>
          )}
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
              Drawn On Bank
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Drawn On Bank"
                id="drawnOnBank"
                value={payNowInvoiceData?.drawnOnBank?.value}
                onChange={onChange}
                onBlur={onBlur}
                errorMsg="Enter Drawn On Bank"
                showError={payNowInvoiceData?.drawnOnBank?.error}
              />
            </div>
          </div>
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
              Payment Date
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="date"
                placeholder="Payment Date"
                id="paymentDate"
                value={payNowInvoiceData?.paymentDate?.value}
                onChange={onChange}
                onBlur={onBlur}
                errorMsg="Enter Payment Date"
                showError={payNowInvoiceData?.paymentDate?.error}
              />
            </div>
          </div>
          {payNowInvoiceData?.method?.value == "EFT" && (
            <div className={`row ${modalStyle.paddingTB5}`}>
              <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
                Reference Number
              </label>
              <div className="col-md-7 col-sm-6">
                <GenericNormalInput
                  autoComplete="off"
                  type="text"
                  placeholder="Reference Number"
                  id="referenceNumber"
                  value={payNowInvoiceData?.referenceNumber?.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  errorMsg="Enter Reference Number"
                  showError={payNowInvoiceData?.referenceNumber.error}
                />
              </div>
            </div>
          )}
          <div className={`row col-12 mt-2 ${modalStyle.alignRight}`}>
            <div className={modalStyle.buttonContStyle}>
              <GenericButton
                className={modalStyle.buttonStyle}
                label={"Pay Now"}
                size="medium"
                onClick={payNow}
                disabled={disablePayNowBtn}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
              Vendor Name
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Vendor Name"
                id="name"
                value={payNowInvoiceData?.name?.value}
                onChange={onChange}
              />
            </div>
          </div>
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
              Remit To Address
            </label>
            <div className="col-md-7 col-sm-6 row">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Shipping Address 1"
                id="addressLine1"
                value={payNowInvoiceData?.addressLine1?.value}
                onChange={onChange}
                formControlClassname={modalStyle.addressInput}
              />
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Shipping Address 2"
                id="addressLine2"
                value={payNowInvoiceData?.addressLine2?.value}
                onChange={onChange}
                formControlClassname={modalStyle.addressInput}
              />
            </div>
          </div>
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
              Town / City
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Town / City"
                id="city"
                value={payNowInvoiceData?.city?.value}
                onChange={onChange}
                formControlClassname={modalStyle.normalInput}
              />
            </div>
          </div>
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
              State
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericSelect
                options={stateData}
                name="state"
                id="state"
                value={payNowInvoiceData?.state?.value}
                getOptionLabel={(option: { state: any }) => option.state}
                getOptionValue={(option: { id: any }) => option.id}
                onChange={(e: any) => {
                  setPayNowInvoiceData((prevState: any) => ({
                    ...prevState,
                    state: { value: e, error: false, validationPattern: "" },
                  }));
                }}
                isModalPopUp={true}
                {...rest}
                formControlClassname={modalStyle.normalInput}
              />
            </div>
          </div>
          <div className={`row ${modalStyle.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${modalStyle.labelTextLeft}`}>
              Zip Code
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Zip Code"
                id="zipCode"
                value={payNowInvoiceData?.zipCode?.value}
                onChange={onChange}
                formControlClassname={modalStyle.normalInput}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PayNowInvoice;
