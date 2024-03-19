"use-client";
import React, { useEffect, useState } from "react";
import modalStyle from "./PayNowPopup.module.scss";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import {
  getCustomerState,
  invoicePayment,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import { selectVendor } from "@/services/_adjuster_services/ClaimService";
import GenericSelect from "@/components/common/GenericSelect";
import { rest } from "lodash";
import GenericButton from "@/components/common/GenericButton";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";

interface PayNowPopupProps {
  handleOpenModal?: () => void;
  addLoader: () => void;
  removeLoader: () => void;
  translate?: any;
  payNowData: any;
}

interface vendorState {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: any;
  state: any;
  zipCode: any;
  id: any;
}

interface paymentState {
  method: any;
  amount: any;
  checkNumber: any;
  bankAccNo: any;
  routingNumber: any;
  drawnOnBank: any;
  paymentDate: any;
}

const PayNowPopup: React.FC<PayNowPopupProps> = ({
  handleOpenModal,
  addLoader,
  removeLoader,
  payNowData,
}) => {
  const initialVendorState: vendorState = {
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    id: "",
  };

  const initialPaymentState: paymentState = {
    method: "Check",
    amount: payNowData?.Amount,
    checkNumber: "",
    bankAccNo: "",
    routingNumber: "",
    drawnOnBank: "",
    paymentDate: "",
  };

  const initialPaymentError: paymentState = {
    method: false,
    amount: false,
    checkNumber: false,
    bankAccNo: false,
    routingNumber: false,
    drawnOnBank: false,
    paymentDate: false,
  };
  const dispatch = useAppDispatch();
  const [stateData, setStateData] = useState<any>([]);
  const [vendorData, setVendorData] = useState<any>(initialVendorState);
  const [paymentData, setPaymentData] = useState<any>(initialPaymentState);
  const [paymentError, setPaymentError] = useState<any>(initialPaymentError);

  const init = React.useCallback(async () => {
    const payNowDataParsed = JSON.parse(payNowData?.completeData);
    const vendorId = payNowDataParsed?.vendorId;
    const vendorNumber = payNowDataParsed?.vendorNumber;
    try {
      const [stateList, vendorDetails] = await Promise.all([
        getCustomerState(true),
        selectVendor({ id: vendorId, registrationNumber: vendorNumber }),
      ]);

      setStateData(stateList?.data);
      setVendorData(vendorDetails?.data);
      setVendorData({
        name: vendorDetails?.data?.vendorName,
        addressLine1: vendorDetails?.data?.billingAddress?.streetAddressOne,
        addressLine2: vendorDetails?.data?.billingAddress?.streetAddressTwo,
        city: vendorDetails?.data?.billingAddress?.city,
        state: vendorDetails?.data?.billingAddress?.state,
        zipCode: vendorDetails?.data?.billingAddress?.zipcode,
        id: vendorDetails?.data?.vendorId,
      });
    } catch (error) {
      dispatch(
        addNotification({
          message: error,
          id: "init_error",
          status: "error",
        })
      );
    }
  }, [payNowData, dispatch]);

  useEffect(() => {
    init();
  }, [init]);

  const onChange = (e: any) => {
    if (e.target.id === "zipcode" && e.target.value.length > 5) return;
    setVendorData({ ...vendorData, [e.target.id]: e.target.value });
  };

  const onBlurPaymentData = (e: any) => {
    if (e.target.value.trim() == "") {
      setPaymentError({ ...paymentError, [e.target.id]: true });
    } else if (e.target.value.trim() !== "") {
      setPaymentError({ ...paymentError, [e.target.id]: false });
    }
  };

  const onChangePaymentMethod = (e: any) => {
    setPaymentData({ ...paymentData, method: e.target.value });
  };

  const onChangePaymentData = (e: any) => {
    if (e.target.value.trim() == "") {
      setPaymentError({ ...paymentError, [e.target.id]: true });
    } else if (e.target.value.trim() !== "") {
      setPaymentError({ ...paymentError, [e.target.id]: false });
    }
    setPaymentData({ ...paymentData, [e.target.id]: e.target.value });
  };

  const findIdByInvoiceNumber = (array: any, number: any) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].invoiceNumber === number) {
        return array[i].id;
      }
    }
    return null;
  };
  const payNow = async () => {
    addLoader();

    try {
      let payload: any = {};
      const invoiceId = findIdByInvoiceNumber(
        JSON.parse(payNowData?.completeData)?.invoices,
        payNowData["Invoice Id"]
      );

      const commonPayload = {
        bankName: paymentData?.drawnOnBank,
        invoices: [{ id: invoiceId }],
        payAmount: paymentData?.amount.replace("$", ""),
        vendorDetails: { vendorId: vendorData?.id },
      };

      if (paymentData?.method === "Check") {
        payload = {
          ...commonPayload,
          check: true,
          checkDate: paymentData?.paymentDate,
          checkNumber: paymentData?.checkNumber,
          remittAddress: {
            city: vendorData?.city,
            state: { id: vendorData?.state?.id },
            streetAddressOne: vendorData?.addressLine1,
            streetAddressTwo: vendorData?.addressLine2,
            zipcode: vendorData?.zipcode,
          },
        };
      } else {
        payload = {
          ...commonPayload,
          paymentDate: paymentData?.paymentDate,
          bankAccountNumber: paymentData?.bankAccNo,
          eft: true,
          routingNumber: paymentData?.routingNumber,
        };
      }

      const res: any = await invoicePayment(payload);

      if (res.status === 200) {
        dispatch(
          addNotification({
            message: res?.message,
            id: "payment_success",
            status: "success",
          })
        );
        init();
      } else {
        dispatch(
          addNotification({
            message: res?.message,
            id: "payment_error",
            status: "error",
          })
        );
      }
    } catch (error) {
      console.error("An error occurred while processing payment:", error);
      dispatch(
        addNotification({
          message: "An error occurred while processing payment",
          id: "payment_error",
          status: "error",
        })
      );
    }

    removeLoader();
  };

  return (
    <React.Fragment>
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
                type="radio"
                label="Check"
                value="Check"
                name="paymentMethod"
                checked={paymentData?.method == "Check"}
                formControlClassname={modalStyle.radioFormControl}
                inputFieldWrapperClassName={modalStyle.inputWrapper}
                onChange={onChangePaymentMethod}
                labelClassname={modalStyle.payMethodLabCls}
              />
              <GenericNormalInput
                type="radio"
                label="EFT"
                value="EFT"
                name="paymentMethod"
                checked={paymentData?.method == "EFT"}
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
              <span className={modalStyle.labelTextRight}>{paymentData?.amount}</span>
            </div>
          </div>
          {paymentData?.method == "Check" && (
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
                  value={paymentData?.checkNumber}
                  onChange={onChangePaymentData}
                  onBlur={onBlurPaymentData}
                  errorMsg="Enter Check Number"
                  showError={paymentError?.checkNumber}
                />
              </div>
            </div>
          )}
          {paymentData?.method == "EFT" && (
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
                  value={paymentData?.bankAccNo}
                  onChange={onChangePaymentData}
                  onBlur={onBlurPaymentData}
                  errorMsg="Enter Bank Account No."
                  showError={paymentError?.bankAccNo}
                />
              </div>
            </div>
          )}
          {paymentData?.method == "EFT" && (
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
                  value={paymentData?.routingNumber}
                  onChange={onChangePaymentData}
                  onBlur={onBlurPaymentData}
                  errorMsg="Enter Routing Number"
                  showError={paymentError?.routingNumber}
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
                value={paymentData?.drawnOnBank}
                onChange={onChangePaymentData}
                onBlur={onBlurPaymentData}
                errorMsg="Enter Drawn On Bank"
                showError={paymentError?.drawnOnBank}
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
                value={paymentData?.paymentDate}
                onChange={onChangePaymentData}
                onBlur={onBlurPaymentData}
                errorMsg="Enter Payment Date"
                showError={paymentError?.paymentDate}
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
                value={vendorData?.name}
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
                value={vendorData?.addressLine1}
                onChange={onChange}
                formControlClassname={modalStyle.addressInput}
              />
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Shipping Address 2"
                id="addressLine2"
                value={vendorData?.addressLine2}
                onChange={onChange}
                formControlClassname={modalStyle.addressInput}
              />
              <div className={`col-md-6 ${modalStyle.p_0}`}>
                <GenericNormalInput
                  autoComplete="off"
                  type="text"
                  placeholder="Town / City"
                  id="city"
                  value={vendorData?.city}
                  onChange={onChange}
                  formControlClassname={modalStyle.addressInput}
                />
              </div>
              <div className={`col-md-6 ${modalStyle.p_0}`}>
                <GenericSelect
                  options={stateData}
                  name="state"
                  id="state"
                  value={vendorData?.state}
                  getOptionLabel={(option: { state: any }) => option.state}
                  getOptionValue={(option: { id: any }) => option.id}
                  onChange={(e: any) => {
                    setVendorData({ ...vendorData, state: e });
                  }}
                  isModalPopUp={true}
                  {...rest}
                  formControlClassname={modalStyle.addressInput}
                />
              </div>
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Zip Code"
                id="zipCode"
                value={vendorData?.zipCode}
                onChange={onChange}
                formControlClassname={modalStyle.addressInput}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={`row col-12 mt-2 ${modalStyle.alignRight}`}>
        <div className={modalStyle.buttonContStyle}>
          <GenericButton
            className={modalStyle.buttonStyle}
            label={"Cancel"}
            size="medium"
            onClick={handleOpenModal}
          />
          <GenericButton
            className={modalStyle.buttonStyle}
            label={"Pay Now"}
            size="medium"
            onClick={payNow}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default PayNowPopup;
