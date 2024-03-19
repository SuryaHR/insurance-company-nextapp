"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./userProfileComponent.module.scss";
import clsx from "clsx";
import { ConnectedProps, connect } from "react-redux";
import { Controller } from "react-hook-form";
import { object, any, string, minLength } from "valibot";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import GenericButton from "@/components/common/GenericButton";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import Cards from "@/components/common/Cards";
import GenericSelect from "@/components/common/GenericSelect";
import useCustomForm from "@/hooks/useCustomForm";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import Loading from "@/app/[lang]/loading";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import DateTimePicker from "@/components/common/DateTimePicker";
import { fetchState } from "@/services/_adjuster_services/ClaimService";
import {
  userProfileDetails,
  updateUserProfileData,
} from "@/services/_adjuster_services/UserProfileService";
import { getFileExtension, phoneFormatHandler } from "@/utils/utitlity";
import { useRouter } from "next/navigation";
import GenericPhoneFormat from "@/components/common/GenericInput/GenericPhoneFormat";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import selectLoggedInUserEmail from "@/reducers/Session/Selectors/selectLoggedInUserEmail";
import { RootState } from "@/store/store";
import { addLocalStorageData } from "@/utils/LocalStorageHelper";
import { addSessionData } from "@/reducers/Session/SessionSlice";
import Image from "next/image";
import { convertToCurrentTimezone } from "@/utils/helper";

interface MyObject {
  imgType: string;
  fileUrl: string;
}

const UserProfileComponent: React.FC<MyObject & connectorType> = (props) => {
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState([]);
  const [docs, setDocs] = useState<any>(null);
  const [fileDetailsUploaded, setFileDetailsUploaded] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  interface FileDetails {
    fileName: string;
    fileType: string;
    extension: string;
    filePurpose: string;
    latitude: null | number;
    longitude: null | number;
  }

  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const schema = object({
    email: any(),
    cellPhone: string("lastName", [minLength(1, "Please enter Mobile Number")]),
    dayTimePhone: any(),
    eveningTimePhone: any(),
    streetAddressOne: string("streetAddressOne", [
      minLength(1, "Please enter street address 1"),
    ]),
    streetAddressTwo: any(),
    city: string("city", [minLength(1, "Please enter city")]),
    zipCode: string("zipCode", [minLength(1, "Please enter zip code")]),
    dateOfBirth: any(),
    firstName: string("firstName", [minLength(1, "Please enter first name")]),
    lastName: string("lastName", [minLength(1, "Please enter Last name")]),
    extension: any(),
    // policyHolderId: any(),
    userId: any(),
    profilePicture: any(),
    fileName: any(),
    filePurpose: any(),
    fileType: any(),
    fileUrl: any(),
    imageId: any(),
  });
  const { register, handleSubmit, formState, setValue, getValues, control } =
    useCustomForm(schema);
  interface PolicyData {
    address: {
      id: string;
      streetAddressOne: any;
      streetAddressTwo: any;
      city: any;
      zipcode: any;
      state: any;
      secondaryAddress: any;
    } | null;
    // policyHolderId: any;
    userId: any;
    email: any;
    secondaryEmail: any;
    cellPhone: any;
    dayTimePhone: any;
    eveningTimePhone: any;
    firstName: any;
    lastName: any;
    dob: any;
    // profilePicture: any;
    displayPicture: any;
  }

  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [address, setAddress] = useState<{
    stateId: any;
    id: any;
    addressOne: string | null;
    addressTwo: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
  }>({
    stateId: null,
    id: null,
    addressOne: null,
    addressTwo: null,
    city: null,
    state: null,
    zipcode: null,
  });

  const handleCancel = () => {
    setValue("email", policyData?.email);
    setValue("cellPhone", policyData?.cellPhone);

    setValue("dayTimePhone", policyData?.dayTimePhone);
    setValue("eveningTimePhone", policyData?.eveningTimePhone);
    setValue("firstName", policyData?.firstName);
    setValue("lastName", policyData?.lastName);
    setValue("city", policyData?.address?.city);
    setAddress(policyData?.address?.city);
    setValue("zipCode", policyData?.address?.zipcode);
    setAddress(policyData?.address?.zipcode);
    setAddress(policyData?.address?.state);
    setValue("dateOfBirth", policyData?.dob);
    setValue("profilePicture", policyData?.displayPicture);
    setShow(false);
  };

  const handleStateChange = (selectedOption: any) => {
    setAddress((prev) => ({
      ...prev,
      ...selectedOption,
    }));
  };

  const fetchData = useCallback(
    async (isProfileUpdated?: boolean) => {
      try {
        setTableLoader(true);
        const payload = {
          userName: props.loggedInUserEmail,
        };
        const response = await userProfileDetails(payload);
        if (isProfileUpdated) {
          if (response.status === 200) {
            addLocalStorageData(response);
            dispatch(addSessionData(localStorage));
          }
        }
        setPolicyData(response.data);
        const {
          firstName,
          lastName,
          email,
          cellPhone,
          dayTimePhone,
          eveningTimePhone,
          userId,
          dob,
          extension,
        } = response.data;
        const { city, state, streetAddressOne, streetAddressTwo, zipcode } =
          response.data.address;
        setValue("email", email);
        setValue("firstName", firstName, { shouldValidate: true });
        setValue("lastName", lastName, { shouldValidate: true });
        setValue("cellPhone", cellPhone ?? "");
        setValue("dayTimePhone", dayTimePhone ?? "", { shouldValidate: true });
        setValue("eveningTimePhone", eveningTimePhone ?? "");
        // setValue("policyHolderId", policyHolderId);
        setValue("userId", userId);
        setAddress(state ?? "");
        setValue("streetAddressOne", streetAddressOne, { shouldValidate: true });
        setValue("streetAddressTwo", streetAddressTwo);
        setValue("city", city ?? "", { shouldValidate: true });
        setValue("zipCode", zipcode ?? "", { shouldValidate: true });
        setValue("dateOfBirth", dob ?? new Date());
        setValue("extension", extension ?? null);
        setDocs(response.data.displayPicture ? response.data.displayPicture : null);
        setProfilePictureFile(response.data.displayPicture?.fileUrl || null);
        setTableLoader(false);
      } catch (error) {
        console.error("Error", error);
        setTableLoader(false);
      }
    },
    [dispatch, props.loggedInUserEmail, setValue]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const { errors } = formState;

  const handleClick = () => {
    setShow(true);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFileDetailsUploaded(true);
    if (selectedFile) {
      const fileObject = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        extension: getFileExtension(selectedFile),
        filePurpose: "PROFILE_PICTURE",
        latitude: null,
        longitude: null,
      };
      setProfilePictureFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      let selectedImageArr;
      if (selectedFile.type === "image/png") {
        const newObj: MyObject = {
          imgType: "png",
          fileUrl: imageUrl,
        };
        selectedImageArr = newObj;
      } else {
        const newObj: MyObject = {
          imgType: "jpg",
          fileUrl: imageUrl,
        };
        selectedImageArr = newObj;
      }
      setProfilePictureFile(selectedFile);
      setDocs(selectedImageArr);
      setUploaded(true);

      setFileDetails(fileObject);
    } else {
      setFileDetails(null);
    }
    event.target.value = "";
  };
  const handleDeleteImage = () => {
    setFileDetailsUploaded(true);
    setDocs(null);
  };

  const handleUpdate = async (data: any) => {
    try {
      setProfilePictureFile(null);
      setTableLoader(true);
      const createUserProfile = {
        details: {
          firstName: data.firstName,
          lastName: data.lastName,
          profilePicture: fileDetailsUploaded
            ? null
            : { fileUrl: policyData?.displayPicture?.fileUrl },
          speedCheckVendorUrl: process.env.NEXT_PUBLIC_SPEED_CHECK_VENDOR,
          userRole: "COMPANY_USER",
          dateOfBirth: dayjs(data.dateOfBirth).format("MM-DD-YYYY") + "T00:00:00Z",
          cellPhone: data.cellPhone,
          dayTimePhone: data.dayTimePhone,
          extension: data.extension ?? null,
          eveningTimePhone: data.eveningTimePhone,

          address: {
            city: data.city,
            state: {
              id: address.id,
            },
            streetAddressOne: data.streetAddressOne,
            streetAddressTwo: data.streetAddressTwo,
            zipcode: data.zipCode,
          },
        },
      };
      const formData = new FormData();
      if (fileDetailsUploaded && fileDetails) {
        formData.append("filesDetails", JSON.stringify([fileDetails]));
      }
      if (fileDetailsUploaded && fileDetails && profilePictureFile) {
        formData.append("file", profilePictureFile);
      }
      formData.append("details", JSON.stringify(createUserProfile.details));

      const creatClaimRes = await updateUserProfileData(formData);
      console.log("Update successful", creatClaimRes);

      if (creatClaimRes?.status === 200) {
        setShow(false);
        fetchData(true);
        dispatch(
          addNotification({
            message: creatClaimRes.message,
            id: "submit_vendor",
            status: "success",
          })
        );
      } else {
        setShow(true);
        setTableLoader(false);
        dispatch(
          addNotification({
            message: creatClaimRes.message ?? "something went wrong",
            id: "submit_vendor",
            status: "error",
          })
        );
      }
    } catch (error) {
      setTableLoader(false);
      dispatch(
        addNotification({
          message: "Failed to update policyholder details",
          id: "update_failure",
          status: "error",
        })
      );
    }
  };

  return (
    <>
      <div className={clsx("row mt-2", styles.policyAndCoverageDetails)}>
        <div className={styles.card2}>
          <Cards className={styles.cardPolicy}>
            {tableLoader && <Loading />}
            {show ? (
              <>
                <div className={styles.editableDiv}>
                  <form onSubmit={handleSubmit(handleUpdate)}>
                    <div
                      className={clsx("row align-items-center", styles.policyNumber)}
                    ></div>
                    <div className="row">
                      <div className={clsx(styles.editButton)}>
                        <div className={clsx(styles.cancelButton)}>
                          <GenericButton
                            label={"Save"}
                            theme="normal"
                            size="medium"
                            type="submit"
                          />
                        </div>
                        <div className={clsx("ml-2", styles.cancelButton)}>
                          <GenericButton
                            label="Cancel"
                            theme="normal"
                            size="medium"
                            onClick={() => handleCancel()}
                          ></GenericButton>
                        </div>
                      </div>
                    </div>
                    <div className={styles.stickyContainer}>
                      <GenericComponentHeading
                        customHeadingClassname={styles.headingContainer}
                        customTitleClassname={styles.headingTxt}
                        title={"Personal Details"}
                      />
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>
                          <span style={{ color: "red" }}>*</span> First Name
                        </label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mb-2 mt-2">
                        <GenericUseFormInput
                          placeholder="FirstName"
                          showError={errors["firstName"]}
                          errorMsg={errors?.firstName?.message}
                          isFixedError={false}
                          {...register("firstName")}
                        />
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>
                          <span style={{ color: "red" }}>*</span>Last Name
                        </label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mb-2 mt-2">
                        <GenericUseFormInput
                          placeholder="Last Name"
                          showError={errors["lastName"]}
                          errorMsg={errors?.lastName?.message}
                          isFixedError={false}
                          errorMsgClassname={styles.erroeMessage}
                          {...register("lastName")}
                        />
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>Date Of Birth</label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mt-2 mb-2 ">
                        <Controller
                          control={control}
                          name="dateOfBirth"
                          rules={{ required: true }}
                          defaultValue={getValues("dateOfBirth")}
                          render={({
                            field: { onChange: fieldOnChange, value, ...rest },
                          }: any) => {
                            return (
                              <div className={styles.datePickerInputRight}>
                                <DateTimePicker
                                  name="dateOfBirth"
                                  placeholderText="To"
                                  showError={true}
                                  errorMsg="kkkk"
                                  errorMsgClassname="erressage"
                                  labelClassname="labeext"
                                  formControlClassname={styles.DatePickerZindex}
                                  value={new Date(value)}
                                  // value={selectedDate}
                                  onChange={(e) => {
                                    fieldOnChange(e);
                                  }}
                                  dateFormat="MM-dd-yyyy"
                                  enableTime={false}
                                  // time_24hr={true}
                                  minDate={null}
                                  maxDate={null}
                                  {...rest}
                                />
                              </div>
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>Mobile Phone</label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mb-2 mt-2">
                        <Controller
                          name="cellPhone"
                          control={control}
                          render={({ field: { onChange: mobileChange } }: any) => (
                            <GenericPhoneFormat
                              placeholder="XXX-XXX-XXXX"
                              showError={errors["cellPhone"]}
                              defaultValue={getValues("cellPhone")}
                              errorMsg={errors?.cellPhone?.message}
                              handleChange={({ originalValue }) => {
                                mobileChange(originalValue);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className={styles.stickyContainer}>
                      <GenericComponentHeading
                        customHeadingClassname={styles.headingContainer}
                        customTitleClassname={styles.headingTxt}
                        title={"Mailing Address"}
                      />
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>
                          {" "}
                          <span style={{ color: "red" }}>*</span>Street Address 1
                        </label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mt-2 mb-2">
                        <GenericUseFormInput
                          placeholder="Street Address 1"
                          showError={errors["streetAddressOne"]}
                          errorMsg={errors?.streetAddressOne?.message}
                          isFixedError={false}
                          {...register("streetAddressOne")}
                        />
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>
                          {" "}
                          <span style={{ color: "red" }}>*</span>Street Address 2
                        </label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mb-2 mt-2">
                        <GenericUseFormInput
                          placeholder="Street Address 2"
                          showError={errors["streetAddressTwo"]}
                          errorMsg={errors?.streetAddressTwo?.message}
                          isFixedError={false}
                          {...register("streetAddressTwo")}
                        />
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>
                          {" "}
                          <span style={{ color: "red" }}>*</span>City
                        </label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mb-2 mt-2">
                        <GenericUseFormInput
                          placeholder="City"
                          showError={errors["city"]}
                          errorMsg={errors?.city?.message}
                          isFixedError={false}
                          {...register("city")}
                        />
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>
                          {" "}
                          <span style={{ color: "red" }}>*</span>State
                        </label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mb-2 mt-2">
                        <span className={styles.number}>
                          <GenericSelect
                            name="state"
                            value={address}
                            onChange={handleStateChange}
                            options={options}
                            getOptionLabel={(option: { state: any }) => option.state}
                            getOptionValue={(option: { id: any }) => option.id}
                          />
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-2")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.firstName}>
                          {" "}
                          <span style={{ color: "red" }}>*</span>Zip Code
                        </label>
                      </div>
                      <div className="col-lg-3 col-sm-12 mb-2 mt-2">
                        <div className="col-lg-8 col-md-3 col-sm-12 ">
                          <span className={styles.number}>
                            <GenericUseFormInput
                              placeholder="Zip Code"
                              {...register("zipCode")}
                              showError={errors["zipCode"]}
                              errorMsg={errors?.zipCode?.message}
                              isFixedError={false}
                              isNumberOnly={true}
                              maxLength={5}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.stickyContainer}>
                      <GenericComponentHeading
                        customHeadingClassname={styles.headingContainer}
                        customTitleClassname={styles.headingTxt}
                        title={"Communication Details"}
                      />
                    </div>
                    <div className={clsx("row mb-3 mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.firstName}>Employee Id</label>
                      </div>
                      <div className="col-lg-3 col-sm-12">
                        <span className={styles.emailStyle}>{getValues("userId")}</span>
                      </div>
                    </div>
                    <div className={clsx("row mb-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.firstName}>Email</label>
                      </div>
                      <div className="col-lg-3 col-sm-12 ">
                        <span className={styles.emailStyle}>{getValues("email")}</span>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-md-4 col-sm-12">
                            <label className={styles.mobilePhone}>Work Phone</label>
                          </div>
                          <div className="col-md-4 col-sm-12 mb-2">
                            <Controller
                              name="dayTimePhone"
                              control={control}
                              render={({ field: { onChange: daymobileChange } }: any) => (
                                <GenericPhoneFormat
                                  placeholder="XXX-XXX-XXXX"
                                  showError={errors["dayTimePhone"]}
                                  defaultValue={getValues("dayTimePhone")}
                                  errorMsg={errors?.dayTimePhone?.message}
                                  handleChange={({ originalValue }) => {
                                    daymobileChange(originalValue);
                                  }}
                                />
                              )}
                            />
                          </div>
                          <div className="col-md-2 col-sm-12">
                            <label className={styles.firstName}>Extension</label>
                          </div>
                          <div className="col-md-2 col-sm-12">
                            <GenericUseFormInput
                              placeholder=""
                              {...register("extension")}
                              maxLength={5}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-2 mt-2">
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-md-4 col-sm-12">
                            <label className={styles.mobilePhone}>Home Phone</label>
                          </div>
                          <div className="col-md-4 col-sm-12 mb-2 mt-2">
                            <Controller
                              name="eveningTimePhone"
                              control={control}
                              render={({ field: { onChange: eveningTimePhone } }) => (
                                <GenericPhoneFormat
                                  placeholder="XXX-XXX-XXXX"
                                  showError={errors["eveningTimePhone"]}
                                  defaultValue={getValues("eveningTimePhone")}
                                  errorMsg={errors?.eveningTimePhone?.message}
                                  handleChange={({ originalValue }) => {
                                    eveningTimePhone(originalValue);
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.stickyContainer}>
                      <GenericComponentHeading
                        customHeadingClassname={styles.headingContainer}
                        customTitleClassname={styles.headingTxt}
                        title={"Profile Picture"}
                      />
                      <div className="row mb-2 mt-2">
                        {docs && docs.length === 0 ? (
                          <div className={clsx(styles.contentCenter)}>
                            {uploaded ? "" : null}
                          </div>
                        ) : (
                          docs && (
                            <div className="col-2 m-2">
                              <div>
                                <button
                                  onClick={handleDeleteImage}
                                  className={styles.deleteButton}
                                >
                                  <IoClose style={{ color: "#f20707" }} />
                                </button>
                                <div>
                                  <Image
                                    src={docs?.fileUrl}
                                    alt={`Profile Image`}
                                    style={{
                                      display: "inline-block",
                                      objectFit: "cover",
                                      aspectRatio: 400 / 400,
                                    }}
                                    width={120}
                                    height={120}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="row">
                        <div className={clsx("col-md-3 mt-2")}>
                          <input
                            type="file"
                            id="inp"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept=".png,.jpg,.jpeg"
                            onChange={handleUpload}
                          />
                          <a
                            onClick={() => {
                              fileInputRef?.current && fileInputRef?.current?.click();
                              setUploaded(true);
                            }}
                            role="button"
                            className={styles.fileType}
                          >
                            Upload new Picture
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2 mb-2">
                      <div className={clsx(styles.editButton)}>
                        <div className={clsx(styles.cancelButton)}>
                          <GenericButton
                            label={"Save"}
                            theme="normal"
                            size="medium"
                            type="submit"
                          ></GenericButton>
                        </div>
                        <div className={clsx("ml-2", styles.cancelButton)}>
                          <GenericButton
                            label="Cancel"
                            theme="normal"
                            size="medium"
                            onClick={() => handleCancel()}
                          ></GenericButton>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
                {policyData && (
                  <>
                    <div className="row mt-2 mb-2">
                      <div className={clsx(styles.editButton)}>
                        <div className={clsx(styles.cancelButton)}>
                          <GenericButton
                            label={"Edit"}
                            theme="normal"
                            size="medium"
                            onClick={handleClick}
                          ></GenericButton>
                        </div>
                        <div className={clsx("ml-2", styles.cancelButton)}>
                          <GenericButton
                            label="Cancel"
                            theme="normal"
                            size="medium"
                            onClick={() => router.push("/adjuster-dashboard")}
                          ></GenericButton>
                        </div>
                      </div>
                    </div>
                    <div className={styles.stickyContainer}>
                      <GenericComponentHeading
                        customHeadingClassname={styles.headingContainer}
                        customTitleClassname={styles.headingTxt}
                        title={"Personal Details"}
                      />
                    </div>
                    <div className={clsx("row mb-2 mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>First Name</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>{getValues("firstName")} </span>
                      </div>
                    </div>
                    <div className={clsx("row mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>Last Name</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>{getValues("lastName")}</span>
                      </div>
                    </div>
                    <div className={clsx("row mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>Date Of Birth</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>
                          {getValues("dateOfBirth") &&
                            convertToCurrentTimezone(
                              getValues("dateOfBirth")?.toString(),
                              "MM/DD/YYYY"
                            )}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row mt-3 mb-4")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>Mobile Phone</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>
                          {phoneFormatHandler(getValues("cellPhone")).formattedInput}
                        </span>
                      </div>
                    </div>
                    <div className={styles.stickyContainer}>
                      <GenericComponentHeading
                        customHeadingClassname={styles.headingContainer}
                        customTitleClassname={styles.headingTxt}
                        title={"Mailing Address"}
                      />
                    </div>
                    <div className={clsx("row mb-2 mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>Street Address 1</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>
                          {getValues("streetAddressOne")}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>Street Address 2</label>
                      </div>

                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>
                          {getValues("streetAddressTwo")}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>City</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>{getValues("city")}</span>
                      </div>
                    </div>
                    <div className={clsx("row mb-2 mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>State</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>
                          {address?.state && `${address.state}`}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row mb-4 mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>Zip Code</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>
                          {getValues("zipCode") && `${getValues("zipCode")}`}
                        </span>
                      </div>
                    </div>
                    <div className={styles.stickyContainer}>
                      <GenericComponentHeading
                        customHeadingClassname={styles.headingContainer}
                        customTitleClassname={styles.headingTxt}
                        title={"Communication Details"}
                      />
                    </div>
                    <div className={clsx("row mb-2 mt-3")}>
                      <div className="col-md-2 col-sm-12">
                        <label className={styles.stateSelect}>Employee Id</label>
                      </div>
                      <div className="col-lg-2 col-sm-12">
                        <span className={styles.number}>{getValues("userId")}</span>
                      </div>
                    </div>
                    <div className={clsx("row")}>
                      <div className="col-md-2 col-sm-12 mt-2">
                        <label className={styles.stateSelect}>Email Id</label>
                      </div>
                      <div className="col-lg-2 col-sm-12 mt-2 mb-2">
                        <span className={styles.number}>{getValues("email")}</span>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-md-4 col-sm-12 mt-1">
                            <label className={styles.mobilePhone}>Work Phone</label>
                          </div>
                          <div className="col-md-4 col-sm-12 mb-2 mt-1">
                            <span className={styles.number}>
                              {
                                phoneFormatHandler(getValues("dayTimePhone"))
                                  .formattedInput
                              }
                            </span>
                          </div>
                          <div className="col-md-2 col-sm-12">
                            <label className={styles.firstName}>Extension</label>
                          </div>
                          <div className="col-md-2 col-sm-12">
                            <span>{getValues("extension")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={clsx("row mb-4")}>
                      <div className="col-lg-2 col-sm-12">
                        <label className={styles.firstName}>Home Phone</label>
                      </div>
                      <div className="col-lg-4 col-md-3 col-sm-12">
                        <span className={styles.number}>
                          {
                            phoneFormatHandler(getValues("eveningTimePhone"))
                              .formattedInput
                          }
                        </span>
                      </div>
                    </div>
                    <div className={styles.stickyContainer}>
                      <GenericComponentHeading
                        customHeadingClassname={styles.headingContainer}
                        customTitleClassname={styles.headingTxt}
                        title={"Profile Picture"}
                      />
                      <div className={styles.profile}>
                        {(profilePictureFile || policyData?.displayPicture?.fileUrl) && (
                          <div className="row mb-2 mt-2">
                            <div className={clsx("col-12", styles.pic)}>
                              <Image
                                src={
                                  profilePictureFile || policyData?.displayPicture.fileUrl
                                }
                                alt="Profile Picture"
                                style={{
                                  display: "inline-block",
                                  objectFit: "cover",
                                  marginTop: "8px",
                                  // height: "100px",
                                  // width: "auto",
                                  aspectRatio: "400 / 400",
                                }}
                                width={150}
                                height={150}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="row mt-2 mb-2">
                  <div className={clsx(styles.editButton)}>
                    <div className={clsx(styles.cancelButton)}>
                      <GenericButton
                        label={"Edit"}
                        theme="normal"
                        size="medium"
                        onClick={handleClick}
                      ></GenericButton>
                    </div>
                    <div className={clsx("ml-2", styles.cancelButton)}>
                      <GenericButton
                        label="Cancel"
                        theme="normal"
                        size="medium"
                        onClick={() => router.push("/adjuster-dashboard")}
                      ></GenericButton>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Cards>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state: RootState) => ({
  loggedInUserEmail: selectLoggedInUserEmail(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(UserProfileComponent);
