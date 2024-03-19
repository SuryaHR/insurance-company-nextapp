"use client";

import React, { useEffect, useRef, useState } from "react";
import ClaimPolicyInformation from "./policyInformation.module.scss";
import { Controller } from "react-hook-form";
import {
  fetchPolicyType,
  fetchState,
  validateEmail,
} from "@/services/_adjuster_services/ClaimService";
import { unknownObjectType } from "@/constants/customTypes";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import GenericSelect from "@/components/common/GenericSelect/index";
import { newClaimTransalateProp } from "@/app/[lang]/(adjuster)/new-claim/page";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericPhoneFormat, {
  phoneFormatHandlers,
} from "@/components/common/GenericInput/GenericPhoneFormat";
// import { current } from "@reduxjs/toolkit";

function ClaimpolicyInformation({
  register,
  error,
  control,
  setValue,
  updateHomeOwnerType,
  resetField,
  getValues,
  clearErrors,
  setError,
  policyNumber,
}: any) {
  const [options, setOptions] = useState([]);
  const [showEmailExitPop, setEmailExitPopUp] = useState(false);
  const [policyDetails, setpolicyDetails] = useState<unknownObjectType | null>(null);

  const { translate } =
    useContext<TranslateContextData<newClaimTransalateProp>>(TranslateContext);

  const verifyEmail = (email: string) => {
    if (!email) {
      setError("email", {
        type: "manual",
        message: "Please Enter valid email",
      });
      setEmailExitPopUp(false);
      return;
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) {
      setError("email", {
        type: "manual",
        message: "Please Enter valid email",
      });
      setEmailExitPopUp(false);
      return;
    }
    clearErrors("email");

    validateEmail({
      email: email,
    })
      .then((res) => {
        setEmailExitPopUp(true);
        setpolicyDetails(res.data);
      })
      .catch((error) => console.log("verify errr", error));
  };

  const handleClose = () => {
    setEmailExitPopUp(false);
  };

  const handleGetData = () => {
    setValue("firstname", policyDetails?.firstName, { shouldValidate: true }),
      setValue("lastname", policyDetails?.lastName, { shouldValidate: true });
    setValue("mobilenumber", policyDetails?.cellPhone);
    mobileRef?.current?.changeValue(policyDetails?.cellPhone);
    setValue("secondaryPhonenumber", policyDetails?.dayTimePhone);
    secMobileRef?.current?.changeValue(policyDetails?.dayTimePhone);
    setValue("address", policyDetails?.address.streetAddressOne, {
      shouldValidate: true,
    });
    setValue("address1", policyDetails?.address.streetAddressTwo, {
      shouldValidate: true,
    });
    setValue("address2", policyDetails?.address.city, { shouldValidate: true });
    setValue("state", policyDetails?.address.state, { shouldValidate: true });
    getPolicyType(policyDetails?.address.state.id);
    setValue("zipcode", policyDetails?.address.zipcode, { shouldValidate: true });
    // clearErrors("claim");
    // clearErrors("minItemPrice");
    // clearErrors("contentLimits");
    handleClose();
  };
  useEffect(() => {
    fetchState({
      isTaxRate: false,
      isTimeZone: false,
    })
      .then((res) => {
        setOptions(res.data);
      })
      .catch((error) => console.log("state errr", error));
  }, []);

  const getPolicyType = (id: number) => {
    const stateId = getValues("state")?.id;
    if (!stateId) return;
    fetchPolicyType(id)
      .then((res) => {
        updateHomeOwnerType(res.data);
      })
      .catch((error) => console.log("policy errr", error));
  };

  const mobileRef = useRef<phoneFormatHandlers>(null);
  const secMobileRef = useRef<phoneFormatHandlers>(null);

  return (
    <div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 ml-8 text-right">
          <label className={ClaimPolicyInformation.label}>Email</label>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-12 mt-2">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange: emailChange, ...rest } }: any) => (
              <GenericUseFormInput
                placeholder="E-mail"
                showError={error["email"]}
                errorMsg={error?.email?.message}
                onChange={(e: any) => {
                  emailChange(e);
                  const emailValue = e.target.value;
                  verifyEmail(emailValue);
                }}
                {...rest}
                disabled={policyNumber}
              />
            )}
          />
          {showEmailExitPop && (
            <div>
              <ConfirmModal
                showConfirmation={true}
                closeHandler={handleClose}
                submitBtnText="Yes"
                closeBtnText="No"
                childComp="This policyholder email already exists! Do you want to prepopulate the data? Please Confirm!"
                modalHeading="Policyhlder Info"
                submitHandler={() => handleGetData()}
              />
            </div>
          )}
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimPolicyInformation.label}>
            <span className={ClaimPolicyInformation.redColor}>*</span>{" "}
            {translate?.newClaimTransalate?.newClaim?.policyText?.firstName ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-12">
          <GenericUseFormInput
            placeholder="First Name"
            showError={error["firstname"]}
            errorMsg={error?.firstname?.message}
            {...register("firstname")}
            disabled={policyNumber}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimPolicyInformation.label}>
            {" "}
            <span className={ClaimPolicyInformation.redColor}>*</span>
            {translate?.newClaimTransalate?.newClaim?.policyText?.lastName ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericUseFormInput
            placeholder="Last Name"
            showError={error["lastname"]}
            errorMsg={error?.lastname?.message}
            {...register("lastname")}
            disabled={policyNumber}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimPolicyInformation.label}>
            {" "}
            {translate?.newClaimTransalate?.newClaim?.policyText?.mobileNumber ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <Controller
            name="mobilenumber"
            control={control}
            render={({ field: { onChange: mobilenumberChange } }: any) => (
              <GenericPhoneFormat
                ref={mobileRef}
                placeholder="XXX-XXX-XXXX"
                showError={error["mobilenumber"]}
                defaultValue={getValues("cellPhone")}
                errorMsg={error?.mobilenumber?.message}
                handleChange={({ originalValue }) => {
                  mobilenumberChange(originalValue);
                }}
              />
            )}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimPolicyInformation.label}>
            {translate?.newClaimTransalate?.newClaim?.policyText?.secondaryPhoneNumber ??
              ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <Controller
            name="secondaryPhonenumber"
            control={control}
            render={({ field: { onChange: mobileChange } }: any) => (
              <GenericPhoneFormat
                ref={secMobileRef}
                placeholder="XXX-XXX-XXXX"
                showError={error["secondaryPhonenumber"]}
                defaultValue={getValues("dayTimePhone")}
                errorMsg={error?.secondaryPhonenumber?.message}
                handleChange={({ originalValue }) => {
                  mobileChange(originalValue);
                }}
              />
            )}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-start">
        <div className="col-lg-3 col-md-2 col-sm-12 mt-2 text-right">
          <label className={ClaimPolicyInformation.label}>
            {" "}
            {translate?.newClaimTransalate?.newClaim?.policyText?.address ?? ""}
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericUseFormInput
            placeholder="Street Address 1"
            formControlClassname="mb-3"
            {...register("address")}
          />
          <GenericUseFormInput
            placeholder="Street Address 2"
            formControlClassname="mb-3"
            {...register("address1")}
          />
          <GenericUseFormInput
            placeholder="City / Town"
            formControlClassname="mb-3"
            {...register("address2")}
          />
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-lg-3 col-md-2 col-sm-12 text-right">
          <label className={ClaimPolicyInformation.label}>
            <span className={ClaimPolicyInformation.redColor}>*</span>{" "}
            {translate?.newClaimTransalate?.newClaim?.policyText?.state ?? ""}
          </label>
        </div>
        <div className="col-lg-2">
          <Controller
            control={control}
            name="state"
            render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
              <GenericSelect
                options={options}
                name="state"
                showError={error["state"]}
                errorMsg={error?.state?.message}
                onChange={(e: any) => {
                  fieldOnChange(e);
                  resetField("homeOwnersPolicyType");
                  if (e) getPolicyType(e.id);
                  else updateHomeOwnerType([]);
                }}
                {...rest}
                getOptionLabel={(option: { state: any }) => option.state}
                getOptionValue={(option: { id: any }) => option.id}
              />
            )}
          />
        </div>

        <div className="col-auto">
          <label className={ClaimPolicyInformation.label}>
            <span className={ClaimPolicyInformation.redColor}>*</span>{" "}
            {translate?.newClaimTransalate?.newClaim?.policyText?.zipCode ?? ""}
          </label>
        </div>
        <div className="col-lg-2 col-md-2 col-sm-12  justify-content-left">
          <GenericUseFormInput
            placeholder="Zip Code"
            {...register("zipcode")}
            showError={error["zipcode"]}
            errorMsg={error?.zipcode?.message}
            maxLength={5}
          />{" "}
        </div>
      </div>
    </div>
  );
}

export default ClaimpolicyInformation;
