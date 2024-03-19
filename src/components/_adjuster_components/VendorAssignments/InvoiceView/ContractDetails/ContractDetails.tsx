"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "../ContractDetails/ContractDetails.module.scss";
import { convertToCurrentTimezone } from "@/utils/helper";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { paymentContactDetails } from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import CustomLoader from "@/components/common/CustomLoader";
import { getUSDCurrency } from "@/utils/utitlity";
import Image from "next/image";

const ContractDetails = () => {
  const [contactDetails, setContactDetails] = useState<any>({});
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const init = useCallback(async () => {
    try {
      setIsLoader(true);
      const payload = {
        contactType: "claim",
        invoiceNo: sessionStorage.getItem("invoiceNumber"),
        vendorRegNo: "ARTGM",
      };

      const res = await paymentContactDetails(payload);
      if (res.status === 200) {
        setContactDetails(res?.data?.claimContract);
      }
    } catch (error) {
      console.error("Error initializing:", error);
    } finally {
      setIsLoader(false);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className={styles.contactDetCont}>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>Contract#</label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>{contactDetails?.contractUID}</span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Insurance Company Name
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>{contactDetails?.company?.name}</span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Contract Name
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>{contactDetails?.contractName}</span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>Start Date</label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {convertToCurrentTimezone(contactDetails?.createDate)}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Expiration Date
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {convertToCurrentTimezone(contactDetails?.endDate)}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Contract Type
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>{contactDetails?.contractType}</span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5} ${styles.lastChildBHead}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Max. Claim Time Agreed (days)
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>{contactDetails?.maxClaimTime}</span>
        </div>
      </div>
      <GenericComponentHeading title={"Contract Document(s)"} />
      <div className={`row ${styles.paddingTB5} ${styles.lastChildBHead}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Contract Documents
        </label>
        <div className="col-md-6 col-sm-6">
          {contactDetails?.attachments?.map((element: any, index: any) => (
            <a key={index}>
              <Image
                src={element.url}
                alt="attachment"
                style={{ height: "auto", width: "75px" }}
              />
              <br />
              <span>{element.name}</span>
            </a>
          ))}
        </div>
      </div>
      <GenericComponentHeading title={"Response Time"} />
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          First Contact Time/ Initial Response Time (hrs)
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {contactDetails?.initialResponseTime}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Follow Up Response Time (hrs)
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {contactDetails?.followUpResponseTime}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5} ${styles.lastChildBHead}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Max. Claim Time Agreed (days)
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>{contactDetails?.maxClaimTime}</span>
        </div>
      </div>
      <GenericComponentHeading title={"Shipping Charges"} />
      <div className={`row ${styles.paddingTB5} `}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Shipping Charges
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {getUSDCurrency(contactDetails?.shippingCharge)}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5} ${styles.lastChildBHead}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>PickUp Fee</label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {getUSDCurrency(contactDetails?.pickupFee)}
          </span>
        </div>
      </div>
      <GenericComponentHeading title={"Quote Fees and Evaluation Fees"} />
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Quote Only Fee
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {getUSDCurrency(contactDetails?.pickupFee)}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Max. Line Item in an assignment
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {getUSDCurrency(contactDetails?.pickupFee)}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Additional Line Item Quote Fee
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {getUSDCurrency(contactDetails?.pickupFee)}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5} ${styles.lastChildBHead}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Full Evalution Fee
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {getUSDCurrency(contactDetails?.pickupFee)}
          </span>
        </div>
      </div>
      <GenericComponentHeading title={"Additional Services Rate Card"} />
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Gemologist Eval Fee
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {getUSDCurrency(contactDetails?.gemologistEvalFee)}
          </span>
        </div>
      </div>
      <div className={`row ${styles.paddingTB5}`}>
        <label className={`col-md-6 col-sm-6 ${styles.labelTextLeft}`}>
          Gemologist Eval Fee with Full Report
        </label>
        <div className="col-md-6 col-sm-6">
          <span className={styles.labelTextRight}>
            {getUSDCurrency(contactDetails?.gemologistEvalFullReportFee)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
