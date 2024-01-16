"use client";

import React, { useEffect, useState } from "react";
import ClaimPolicyInformation from "./policyInformation.module.scss";
import { Controller } from "react-hook-form";
import GenericInput from "../common/GenericInput/index";
import clsx from "clsx";
import GenericSelect from "../common/GenericSelect/index";
import { fetchPolicyType, fetchState, validateEmail } from "@/services/ClaimService";
import ConfirmModal from "../common/ConfirmModal/ConfirmModal";
import { unknownObjectType } from "@/constants/customTypes";

function ClaimpolicyInformation({
  register,
  error,
  control,
  setValue,
  updateHomeOwnerType,
  resetField,
  getValues,
  clearErrors,
}: any) {
  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);
  // const [stateId, setStateId] = useState(null);
  const [policyDetails, setpolicyDetails] = useState<unknownObjectType | null>(null);

  const { onChange: emailChange, ...rest } = register("email");

  // const pattern = "/^([0-9-,()s+]{15})$/";

  const verifyEmail = (email: string) => {
    validateEmail({
      email: email,
    })
      .then((res) => {
        console.log("result", res.data);
        setShow(true);
        console.log("resss", res.data.address.state.id);
        setpolicyDetails(res.data);
        // console.log("set", setpolicyDetails(res.data));
        // setStateId(res.data.address.state.id);
      })

      .catch((error) => console.log("verify errr", error));
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleGetData = () => {
    console.log("policyDetails", policyDetails?.firstName, { shouldValidate: true });
    setValue("firstname", policyDetails?.firstName, { shouldValidate: true }),
      setValue("lastname", policyDetails?.lastName, { shouldValidate: true });
    setValue("mobilenumber", policyDetails?.cellPhone, { shouldValidate: true });
    setValue("secondaryPhonenumber", policyDetails?.dayTimePhone, {
      shouldValidate: true,
    });
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
    clearErrors("claim");
    clearErrors("minItemPrice");
    clearErrors("contentLimits");

    // setValue("claim", { shouldValidate: true });
    // setValue("claimDate", { shouldValidate: true });
    // setValue("insuranceCompany", { shouldValidate: true });
    // setValue("adjusterName", { shouldValidate: true });
    // setValue("claimDescription", { shouldValidate: true });
    // setValue("claimDeductible", { shouldValidate: true });
    // setValue("minItemPrice", { shouldValidate: true });
    // setValue("taxRate", { shouldValidate: true });
    // setValue("contentLimits", { shouldValidate: true });
    // setValue("lossType", { shouldValidate: true });
    // setValue("homeOwnersPolicyType", { shouldValidate: true });

    // fetchPolicyType(stateId)
    //   .then((res: any) => {
    //     console.log("state", res);
    //   })
    //   .catch((error: any) => console.log("verify errr", error));

    handleClose();
  };
  useEffect(() => {
    fetchState({
      isTaxRate: false,
      isTimeZone: false,
    })
      .then((res) => {
        console.log("state", res);
        setOptions(res.data);
        // console.log(
        //   "stateObject",
        //   res.data.map((item: { state: string }) => {
        //     item;
        //   })
        // );

        // setStateId(res.data.address.state.id);
      })
      .catch((error) => console.log("state errr", error));
  }, []);

  /* eslint-disable no-useless-escape */
  const regex: RegExp =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const getPolicyType = (id: number) => {
    console.log("onwers logs");
    const stateId = getValues("state")?.id;
    if (!stateId) return;
    fetchPolicyType(id)
      .then((res) => {
        console.log("id", id);
        console.log("policy", res.data);
        updateHomeOwnerType(res.data);
      })
      .catch((error) => console.log("policy errr", error));
  };

  return (
    <div>
      {/* <form className="col-lg-4 col-md-6 col-12 d-flex flex-column"> */}
      <div className="row mt-3 align-items-center">
        <div className={clsx("col-lg-3 col-md-2 col-sm-12 mt-2 ml-8 text-right")}>
          <label className={ClaimPolicyInformation.label}>Email</label>
        </div>
        <div className={clsx("col-lg-3 col-md-4 col-sm-12 mt-2")}>
          <GenericInput
            placeholder="E-mail"
            showError={error["email"]}
            errorMsg={error?.email?.message}
            isFixedError={true}
            onChange={(e: any) => {
              emailChange(e);
              const emailValue = e.target.value;
              if (emailValue.match(regex) != null) {
                console.log(emailValue);
                verifyEmail(emailValue);
              }
              // /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            }}
            {...rest}
          />
          {show && (
            <div>
              <ConfirmModal
                showConfirmation={true}
                closeHandler={handleClose}
                submitBtnText="Yes"
                closeBtnText="No"
                childComp="This policyholder email already exists! Do you want to prepopulate the data? Please Confirm!"
                // descText="This policyholder email already exists! Do you want to prepopulate the data? Please Confirm!"
                modalHeading="Policyhlder Info"
                submitHandler={() => handleGetData()}
              />
            </div>
          )}
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className={clsx("col-lg-3 col-md-2 col-sm-12 mt-2 text-right")}>
          <label className={ClaimPolicyInformation.label}>
            <span style={{ color: "red" }}>*</span> First Name
          </label>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-12">
          <GenericInput
            placeholder="First Name"
            showError={error["firstname"]}
            errorMsg={error?.firstname?.message}
            // className={ClaimPolicyInformation.firstName}
            {...register("firstname")}
            singleValue
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className={clsx("col-lg-3 col-md-2 col-sm-12 mt-2 text-right")}>
          <label className={ClaimPolicyInformation.label}>
            {" "}
            <span style={{ color: "red" }}>*</span> Last Name
          </label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericInput
            placeholder="Last Name"
            showError={error["lastname"]}
            errorMsg={error?.lastname?.message}
            // className={ClaimPolicyInformation.lastName}
            {...register("lastname")}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className={clsx("col-lg-3 col-md-2 col-sm-12 mt-2 text-right")}>
          <label className={ClaimPolicyInformation.label}>Mobile Number</label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericInput
            placeholder="XXX-XXX-XXXX"
            // textContentType="telephoneNumber"
            keyboardType="phone-pad"
            // name="phone-number"
            // pattern={pattern}
            {...register("mobilenumber")}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-center">
        <div className={clsx("col-lg-3 col-md-2 col-sm-12 mt-2 text-right")}>
          <label className={ClaimPolicyInformation.label}>Secondary Phone Number</label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericInput
            placeholder="XXX-XXX-XXXX"
            // name="phone-number"
            // pattern={pattern}
            {...register("secondaryPhonenumber")}
          />
        </div>
      </div>
      <div className="row mt-3 align-items-start">
        <div className={clsx("col-lg-3 col-md-2 col-sm-12 mt-2 text-right")}>
          <label className={ClaimPolicyInformation.label}>Address</label>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <GenericInput
            placeholder="Street Address 1"
            formControlClassname="mb-3"
            {...register("address")}
          />
          <GenericInput
            placeholder="Street Address 2"
            formControlClassname="mb-3"
            {...register("address1")}
          />
          <GenericInput
            placeholder="City / Town"
            formControlClassname="mb-3"
            {...register("address2")}
          />
        </div>
      </div>
      <div className="row align-items-center">
        {/* <div className="row"> */}
        <div className={clsx("col-lg-3 col-md-2 col-sm-12 text-right")}>
          <label className={clsx(ClaimPolicyInformation.label)}>
            <span style={{ color: "red" }}>*</span> State
          </label>
        </div>
        <div className="col-lg-2">
          <Controller
            control={control}
            name="state"
            // rules={{ required: true }}
            render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
              <GenericSelect
                // labelText={selectLabel}
                // placeholder={selectPlaceholder}
                options={options}
                name="state"
                onChange={(e: any) => {
                  fieldOnChange(e);
                  resetField("homeOwnersPolicyType");
                  console.log("onselect", e?.state);
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
        {/* <SelectCheckBox options={options} className="col-4" /> */}
        {/* <div className={clsx("col-lg-2 col-md-2 col-sm-12 mt-2 text-right ")}> */}
        {/* <div className="row"> */}
        <div className={clsx("col-auto")}>
          <label className={clsx(ClaimPolicyInformation.label)}>
            <span style={{ color: "red" }}>*</span> Zip Code
          </label>
        </div>
        <div className={clsx("col-lg-2 col-md-2 col-sm-12  justify-content-left")}>
          <GenericInput
            placeholder="Zip Code"
            {...register("zipcode")}
            showError={error["zipcode"]}
            errorMsg={error?.zipcode?.message}
            maxLength="5"
          />{" "}
        </div>
        {/* </div> */}
      </div>
    </div>
    // </div>
  );
}

export default ClaimpolicyInformation;
