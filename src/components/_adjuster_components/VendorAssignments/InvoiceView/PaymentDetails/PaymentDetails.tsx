"use-client";
import React from "react";
import styles from "./PaymentDetails.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import { convertToCurrentTimezone } from "@/utils/helper";
import { getUSDCurrency } from "@/utils/utitlity";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";

interface PaymentDetailsProps {
  paymentDetails: any;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ paymentDetails }) => {
  return (
    <div className={styles.paymentDetailsCont}>
      <GenericComponentHeading title={"Payment Details"} />
      <div className="col-md-6">
        <div className={`row ${styles.paddingTB5}`}>
          <label
            className={`col-md-4 col-sm-6 ${styles.labelTextLeft} ${styles.paymentMethodLabel}`}
          >
            Payment Method
          </label>
          <div className="col-md-7 col-sm-6">
            <GenericNormalInput
              type="radio"
              label="Check"
              value="Check"
              name="paymentMethod"
              checked={paymentDetails?.check}
              formControlClassname={styles.radioFormControl}
              inputFieldWrapperClassName={styles.inputWrapper}
              labelClassname={styles.payMethodLabCls}
              disabled={true}
            />
            <GenericNormalInput
              type="radio"
              label="EFT"
              value="EFT"
              name="paymentMethod"
              checked={paymentDetails?.eft}
              formControlClassname={styles.radioFormControl}
              inputFieldWrapperClassName={styles.inputWrapper}
              labelClassname={styles.payMethodLabCls}
              disabled={true}
            />
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
            Amount Received
          </label>
          <div className="col-md-7 col-sm-6">
            <GenericNormalInput
              autoComplete="off"
              type="text"
              placeholder="Amount Received"
              id="amountReceived"
              value={getUSDCurrency(paymentDetails?.payAmount)}
              disabled={true}
            />
          </div>
        </div>
        {paymentDetails?.check && (
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Check Number
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Check Number"
                id="checkNumber"
                value={paymentDetails?.checkNumber}
                disabled={true}
              />
            </div>
          </div>
        )}
        {paymentDetails?.eft && (
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Bank Account No.
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Bank Account No"
                id="bankAccountNo"
                value={paymentDetails?.bankAccountNumber}
                disabled={true}
              />
            </div>
          </div>
        )}
        {paymentDetails?.eft && (
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Routing Number
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Routing Number"
                id="routingNumber"
                value={paymentDetails?.routingNumber}
                disabled={true}
              />
            </div>
          </div>
        )}
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
            Drawn On Bank
          </label>
          <div className="col-md-7 col-sm-6">
            <GenericNormalInput
              autoComplete="off"
              type="text"
              placeholder="Drawn On Bank"
              id="drawnOnBank"
              value={paymentDetails?.bankName}
              disabled={true}
            />
          </div>
        </div>
        <div className={`row ${styles.paddingTB5}`}>
          <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
            Payment Date
          </label>
          <div className="col-md-7 col-sm-6">
            <GenericNormalInput
              autoComplete="off"
              type="text"
              placeholder="Payment Date"
              id="paymentDate"
              value={convertToCurrentTimezone(paymentDetails?.paymentDate)}
              disabled={true}
            />
          </div>
        </div>
        {paymentDetails?.referenceNumber && (
          <div className={`row ${styles.paddingTB5}`}>
            <label className={`col-md-4 col-sm-6 ${styles.labelTextLeft}`}>
              Reference Number
            </label>
            <div className="col-md-7 col-sm-6">
              <GenericNormalInput
                autoComplete="off"
                type="text"
                placeholder="Reference Number"
                id="referenceNumber"
                value={paymentDetails?.referenceNumber}
                disabled={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
