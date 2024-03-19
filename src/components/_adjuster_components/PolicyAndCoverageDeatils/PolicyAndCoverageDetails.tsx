"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./policyAndCoverageDetails.module.scss";
import Cards from "@/components/common/Cards";
import clsx from "clsx";
import { FaRegEdit } from "react-icons/fa";
import { ImLoop2 } from "react-icons/im";
import { IconContext } from "react-icons";
import {
  getCoreRowModel,
  createColumnHelper,
  useReactTable,
} from "@tanstack/react-table";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import useCustomForm from "@/hooks/useCustomForm";
import { object, string, any } from "valibot";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import CustomReactTable from "@/components/common/CustomReactTable";
import { unknownObjectType } from "@/constants/customTypes";
import GenericButton from "@/components/common/GenericButton";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import GenericSelect from "@/components/common/GenericSelect";
import {
  getPolicyAndCoverageDetails,
  fetchState,
  updatePolicyAndCoverageDetails,
  getEmailPlaceholder,
} from "@/services/_adjuster_services/ClaimService";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import selectClaimNumber from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectClaimNumber";
import selectPolicyNumber from "@/reducers/_adjuster_reducers/ClaimDetail/Selectors/selectPolicyNumber";
import dayjs from "dayjs";
import { getUSDCurrency, phoneFormatHandler } from "@/utils/utitlity";
import Loading from "@/app/[lang]/loading";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { Controller } from "react-hook-form";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import GenericPhoneFormat from "@/components/common/GenericInput/GenericPhoneFormat";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";

const PolicyAndCoverageDetails: React.FC<connectorType> = (props) => {
  const { claimNumber } = props;
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState([]);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const schema = object({
    // policy schema
    email: string("email"),
    secondaryEmail: any(),
    cellPhone: any(),
    dayPhone: any(),
    eveningPhone: any(),
    streetAddressOne: any(),
    streetAddressTwo: any(),
    cityTown: any(),
    zipCode: any(),
    secondaryUserFirstName: any(),
    secondaryUserLastName: any(),
    streetAddressOnes: any(),
    streetAddressTwos: any(),
    cityTowns: any(),
    zipCodes: any(),
  });
  interface PolicyHolder {
    address: {
      id: string;
      streetAddressOne: any;
      streetAddressTwo: any;
      city: any;
      zipcode: any;
      state: any;
      secondaryAddress: any;
    } | null;
    secondaryAddress: {
      id: string;
      streetAddressOne: any;
      streetAddressTwo: any;
      city: any;
      zipcode: any;
      state: any;
    } | null;
    policyHolderId: any;
    email: any;
    secondaryEmail: any;
    cellPhone: any;
    dayTimePhone: any;
    eveningTimePhone: any;
    secondaryUserFirstName: any;
    secondaryUserLastName: any;
  }

  interface commonObj {
    newInsuranceAccountNumber?: string;
    newPolicyNumber?: string;
  }

  interface PolicyData {
    policyNumber: string;
    policyType: string;
    totalCoverage: number;
    totalSpecialLimit: number;
    totalDetuctibleAmount: number;
    homeownerPolicyType: any | null;
    policyLimit: any;
    policyHolder: PolicyHolder;
  }

  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState<any>(null);
  // const [secondaryEmail, setSecondaryEmail] = useState(null);
  const [insuranceAccountNumber, setInsuranceAccountNumber] = useState("");
  const [contactId, setContactId] = useState("");
  const [categories, setCategories] = useState([]);

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

  const [secondaryAddress, setSecondaryAddress] = useState<{
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
    console.log("streetAddressOnes", policyData);

    setValue("email", policyData?.policyHolder.email);
    // setEmail(policyData?.policyHolder.email);

    setValue("secondaryEmail", policyData?.policyHolder?.secondaryEmail);
    // setSecondaryEmail(policyData?.policyHolder?.secondaryEmail);

    setValue("cellPhone", policyData?.policyHolder.cellPhone);

    setValue("dayPhone", policyData?.policyHolder.dayTimePhone);
    setValue("eveningPhone", policyData?.policyHolder.eveningTimePhone);
    setValue("secondaryUserFirstName", policyData?.policyHolder.secondaryUserFirstName);
    setValue("secondaryUserLastName", policyData?.policyHolder.secondaryUserLastName);
    setValue("streetAddressOne", policyData?.policyHolder?.address?.streetAddressOne);
    setAddress(policyData?.policyHolder?.address?.streetAddressOne);
    setValue("streetAddressTwo", policyData?.policyHolder?.address?.streetAddressTwo);
    setAddress(policyData?.policyHolder?.address?.streetAddressTwo);
    setValue("cityTown", policyData?.policyHolder?.address?.city);
    setAddress(policyData?.policyHolder?.address?.city);
    setValue("zipCode", policyData?.policyHolder?.address?.zipcode);
    setAddress(policyData?.policyHolder?.address?.zipcode);
    setAddress(policyData?.policyHolder?.address?.state);
    setValue(
      "streetAddressOnes",
      policyData?.policyHolder?.secondaryAddress?.streetAddressOne ?? null
    );
    setValue(
      "streetAddressTwos",
      policyData?.policyHolder?.secondaryAddress?.streetAddressTwo ?? null
    );
    setValue("cityTowns", policyData?.policyHolder.secondaryAddress?.city ?? null);
    setValue("zipCode", policyData?.policyHolder?.secondaryAddress?.zipcode ?? null);
    setSecondaryAddress(policyData?.policyHolder?.secondaryAddress?.state);
    setShow(false);
  };

  const handleStateChange = (selectedOption: any) => {
    console.log("selectedOption", selectedOption);
    setAddress((prev) => ({
      ...prev,
      ...selectedOption,
    }));
  };

  const handleSecondaryStateChange = (selectedOption: any) => {
    setSecondaryAddress((prev) => ({
      ...prev,
      ...selectedOption,
    }));
  };

  const [commonObj, setcommonObj] = useState<commonObj>({});

  function CreateDefaultDetails(PolicyDetails: {
    policyHolder: { lastName: string | null; firstName: string | null };
    insuraceAccountDetails: { insuranceCompanyDetails: { name: string | null } };
  }) {
    console.log("common", PolicyDetails);

    const CommonObj: { newInsuranceAccountNumber?: string; newPolicyNumber?: string } =
      {};

    if (PolicyDetails.policyHolder) {
      let PolicyInitials = "";
      let InsuranceCompanyIntials = "";
      const CurrentDate = dayjs().format("MMDDYYYYHHmm");

      if (
        PolicyDetails.policyHolder.lastName &&
        PolicyDetails.policyHolder.lastName !== null &&
        PolicyDetails.policyHolder.firstName &&
        PolicyDetails.policyHolder.firstName !== null
      ) {
        PolicyInitials +=
          PolicyDetails.policyHolder.firstName.charAt(0) +
          "" +
          PolicyDetails.policyHolder.lastName.charAt(0);
      }
      if (
        PolicyDetails.insuraceAccountDetails &&
        PolicyDetails.insuraceAccountDetails.insuranceCompanyDetails &&
        PolicyDetails.insuraceAccountDetails.insuranceCompanyDetails.name !== null
      ) {
        const insuranceCompanyName =
          PolicyDetails.insuraceAccountDetails.insuranceCompanyDetails.name.trim(); //Removing Empty spaces at left and right side
        const abc = insuranceCompanyName.indexOf(" ");
        console.log("abc", abc);
        //Checking for spaces in Company name string
        if (abc == -1) {
          console.log("1111");
          InsuranceCompanyIntials +=
            insuranceCompanyName.charAt(0) + "" + insuranceCompanyName.charAt(1);
          if (
            PolicyInitials &&
            PolicyInitials.length > 0 &&
            InsuranceCompanyIntials &&
            InsuranceCompanyIntials.length > 0
          ) {
            console.log("newPolicyNumber");
            CommonObj.newPolicyNumber =
              "PL" +
              "" +
              InsuranceCompanyIntials.toUpperCase() +
              "" +
              PolicyInitials.toUpperCase() +
              "" +
              CurrentDate;
            CommonObj.newInsuranceAccountNumber =
              "CA" +
              "" +
              InsuranceCompanyIntials.toUpperCase() +
              "" +
              PolicyInitials.toUpperCase() +
              "" +
              CurrentDate;
          }
        } else {
          console.log("2222");

          InsuranceCompanyIntials += insuranceCompanyName.charAt(0);
          for (let i = 0; i <= insuranceCompanyName.length; i++) {
            if (insuranceCompanyName[i] == " " && i < insuranceCompanyName?.length) {
              console.log("3333");

              InsuranceCompanyIntials += insuranceCompanyName[i + 1];
            }
          }
          if (
            PolicyInitials &&
            PolicyInitials.length > 0 &&
            InsuranceCompanyIntials &&
            InsuranceCompanyIntials.length > 0
          ) {
            console.log("4444");

            CommonObj.newPolicyNumber =
              "PL" +
              "" +
              InsuranceCompanyIntials.toUpperCase() +
              "" +
              PolicyInitials.toUpperCase() +
              "" +
              CurrentDate;
            CommonObj.newInsuranceAccountNumber =
              "CA" +
              "" +
              InsuranceCompanyIntials.toUpperCase() +
              "" +
              PolicyInitials.toUpperCase() +
              "" +
              CurrentDate;
          }
        }
      }
    }
    setcommonObj(CommonObj);
  }

  const { register, handleSubmit, formState, setValue, getValues, control } =
    useCustomForm(schema);
  const fetchData = useCallback(async () => {
    try {
      setTableLoader(true);
      const response = await getPolicyAndCoverageDetails({
        claimNumber: claimNumber,
        policyNumber: null,
      });

      setPolicyData(response.data);

      CreateDefaultDetails(response.data);
      console.log("data", response.data);
      const {
        firstName,
        lastName,
        email,
        cellPhone,
        dayTimePhone,
        eveningTimePhone,
        secondaryUserFirstName,
        secondaryUserLastName,
        contactId,
        secondaryEmail,
      } = response.data.policyHolder;
      const insuranceAccountNumber =
        response.data.insuraceAccountDetails.insuranceAccountNumber;
      setInsuranceAccountNumber(insuranceAccountNumber);
      setCategories(response.data.categories ?? []);

      const { city, state, streetAddressOne, streetAddressTwo, zipcode } =
        response.data.policyHolder.address;
      const { secondaryAddress } = response.data.policyHolder;
      console.log("!!!!!", state, secondaryAddress);
      console.log("hii", response.data.policyHolder.address);

      setFirstName(firstName);

      setLastName(lastName);

      // setEmail(email);
      setValue("email", email);

      // setSecondaryEmail(secondaryEmail);
      setValue("secondaryEmail", secondaryEmail ?? "");

      setValue("cellPhone", cellPhone ?? "");
      setValue("dayPhone", dayTimePhone ?? "");
      setValue("eveningPhone", eveningTimePhone ?? "");
      setValue("secondaryUserFirstName", secondaryUserFirstName ?? "");
      setValue("secondaryUserLastName", secondaryUserLastName ?? "");

      setContactId(contactId);
      setAddress(state ?? "");
      setValue("streetAddressOne", streetAddressOne ?? "");
      setValue("streetAddressTwo", streetAddressTwo ?? "");
      setValue("cityTown", city ?? "");
      setValue("zipCode", zipcode ?? "");

      setSecondaryAddress(secondaryAddress?.state ?? "");
      setValue("streetAddressOnes", secondaryAddress?.streetAddressOne ?? "");
      setValue("streetAddressTwos", secondaryAddress?.streetAddressTwo ?? "");
      setValue("cityTowns", secondaryAddress?.city ?? "");
      setValue("zipCodes", secondaryAddress?.zipcode ?? "");
      setTableLoader(false);
    } catch (error) {
      console.error("Error", error);
      setTableLoader(false);
    }
  }, [claimNumber, setValue]);

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
  console.log("errors", errors);
  const columnHelper = createColumnHelper<unknownObjectType>();
  const dispatch = useAppDispatch();

  const columns = [
    columnHelper.accessor("name", {
      header: () => "Category Name",
      id: "name",
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("coverageLimit", {
      header: () => "Coverage Limit",
      id: "coverageLimit",
      cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
    }),
    columnHelper.accessor("individualItemLimit", {
      header: () => "Individual Item Limit",
      id: "individualItemLimit",
      cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
    }),
  ];
  console.log("sdddddd", columns);

  const handleClick = () => {
    setShow(true);
  };

  const handleReset = async (contactId: any) => {
    try {
      const response = await getEmailPlaceholder(contactId);

      setTableLoader(true);
      if (response) {
        dispatch(
          addNotification({
            message: response ?? "Password Reset Successfully.",
            id: "succss_password",
            status: "success",
          })
        );
        setTimeout(() => {
          setTableLoader(false);
        }, 300);
      } else {
        dispatch(
          addNotification({
            message: "Something went wrong",
            id: "wrong",
            status: "error",
          })
        );
      }
    } catch (error) {
      console.error("Error", error);
      dispatch(
        addNotification({
          message: "An error occurred while sending the email.",
          id: "eerrr",
          status: "error",
        })
      );
    } finally {
      setTableLoader(false);
    }
  };

  const handleUpdate = async (data: any) => {
    console.log("ssdsdasas");
    // e.preventDefault();

    // return;
    try {
      setTableLoader(true);
      if (data.email === null || data.email.match(regex) === null) {
        dispatch(
          addNotification({
            message: "Email should not be null or invalid",
            id: "email_update_error",
            status: "error",
          })
        );
        setTableLoader(false);
      } else {
        const payload1 = {
          id: policyData?.policyHolder?.policyHolderId,
          claimNumber: claimNumber,
          cellPhone: data.cellPhone,
          secondaryEmail: data.secondaryEmail,
          contactId: contactId,
          curInsuranceAccountNumber: insuranceAccountNumber,
          curPolicyNumber: policyData?.policyNumber,
          dayTimePhone: data.dayPhone,
          email: data.email,
          eveningTimePhone: data.eveningPhone,
          firstName: firstName,
          lastName: lastName,
          newInsuranceAccountNumber: commonObj?.newInsuranceAccountNumber,
          newPolicyNumber: commonObj?.newPolicyNumber,
          secondaryUserFirstName: data.secondaryUserFirstName,
          secondaryUserLastName: data.secondaryUserLastName,
          registrationNumber: process.env.NEXT_PUBLIC_SPEED_CHECK_VENDOR,
          address: {
            id: policyData?.policyHolder?.address?.id
              ? policyData?.policyHolder?.address?.id
              : "",
            city: data.cityTown,
            streetAddressOne: data.streetAddressOne,
            streetAddressTwo: data.streetAddressTwo,
            state: {
              id: address?.id,
            },
            zipcode: data.zipCode,
          },
          secondaryAddress: {
            id:
              policyData?.policyHolder.secondaryAddress &&
              policyData?.policyHolder.secondaryAddress.id
                ? policyData?.policyHolder.secondaryAddress.id
                : "",

            city: data.cityTowns,
            streetAddressOne: data.streetAddressOnes,
            streetAddressTwo: data.streetAddressTwos,
            state: {
              id: secondaryAddress?.id,
            },
            zipcode: data.zipCodes,
          },
        };

        const response = await updatePolicyAndCoverageDetails(payload1);
        console.log("Update successful", response);
        if (response?.status === 200) {
          setShow(false);
          fetchData();
          dispatch(
            addNotification({
              message: response.message,
              id: "submit_vendor",
              status: "success",
            })
          );
          setTableLoader(false);
        } else {
          setShow(true);
          setTableLoader(false);
          dispatch(
            addNotification({
              message: response.message ?? "something went wrong",
              id: "submit_vendor",
              status: "error",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error updating policy details", error);
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

  const regex: RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    manualFiltering: true,
    enableColumnFilters: false,
  });
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  return (
    <>
      <>
        <div className={`${styles.policyAndCoverageDetails} row`}>
          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12 mt-3">
            <Cards className={styles.cardPolicyData}>
              <GenericComponentHeading title="Policy Coverage Details" />
              {tableLoader && <Loading />}
              <div className={`${styles.policyAndCoverageDetails} mt-5`}>
                {policyData && (
                  <>
                    <div
                      className={`${styles.policyNumber} row align-items-center mt-4 `}
                    >
                      <div className="col-lg-6 col-md-4 col-sm-12 mt-2 text-right">
                        <label className={styles.policyNo}>
                          {
                            translate?.PolicyAndCoverageDetailsTranslate
                              ?.policyAndCoverage?.policyNo
                          }
                        </label>
                      </div>
                      <div className={"col-lg-4 col-md-3 col-sm-12 mt-2"}>
                        <span className={styles.number}>{policyData.policyNumber}</span>
                      </div>
                    </div>
                    <div className={`${styles.policyNumber} row align-items-center`}>
                      <div className="col-lg-6 col-md-4 col-sm-12 mt-2 text-right">
                        <label className={styles.policyNo}>
                          {
                            translate?.PolicyAndCoverageDetailsTranslate
                              ?.policyAndCoverage?.homeownersPolicyType
                          }
                        </label>
                      </div>
                      <div className={clsx("col-lg-4 col-md-3 col-sm-12 mt-2")}>
                        <span className={styles.number}>
                          {policyData?.homeownerPolicyType?.typeName}
                        </span>
                      </div>
                    </div>
                    <div className={`${styles.policyNumber} row align-items-center`}>
                      <div className="col-lg-6 col-md-4 col-sm-12 mt-2 text-right">
                        <label className={styles.policyNo}>
                          {
                            translate?.PolicyAndCoverageDetailsTranslate
                              ?.policyAndCoverage?.totalCoverage
                          }
                        </label>
                      </div>
                      <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                        <span className={styles.number}>
                          {getUSDCurrency(policyData.policyLimit)}
                        </span>
                      </div>
                    </div>
                    <div className={`${styles.policyNumber} row align-items-center`}>
                      <div className="col-lg-6 col-md-4 col-sm-12 mt-2 text-right">
                        <label className={styles.policyNo}>
                          {
                            translate?.PolicyAndCoverageDetailsTranslate
                              ?.policyAndCoverage?.specialLimit
                          }
                        </label>
                      </div>
                      <div className={clsx("col-lg-4 col-md-3 col-sm-12 mt-2")}>
                        <span className={styles.number}>
                          {getUSDCurrency(policyData?.totalSpecialLimit)}
                        </span>
                      </div>
                    </div>
                    <div className={`${styles.policyNumber} row align-items-center`}>
                      <div className="col-lg-6 col-md-4 col-sm-12 mt-2 text-right">
                        <label className={styles.policyNo}>
                          {
                            translate?.PolicyAndCoverageDetailsTranslate
                              ?.policyAndCoverage?.deductibleAmount
                          }
                        </label>
                      </div>
                      <div className={clsx("col-lg-4 col-md-3 col-sm-12 mt-2")}>
                        <span className={styles.number}>
                          {getUSDCurrency(policyData.totalDetuctibleAmount)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Cards>
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12 mt-3">
            <Cards className={styles.cardPolicy}>
              <GenericComponentHeading title={"Policyholder Details"} />
              {show ? (
                <>
                  <div className={styles.editableDiv}>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12 text-right">
                          <label className={styles.policyNo}>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.name
                            }
                          </label>
                        </div>

                        <div className="col-lg-4 col-md-3 col-sm-12 ">
                          <span className={styles.policyHolderName}>
                            {firstName} {lastName}
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12 text-right">
                          <label className={styles.policyNo}>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.email
                            }
                          </label>
                        </div>
                        <div className="col-lg-8 col-md-3 col-sm-12 ">
                          <span className={styles.number}>
                            {" "}
                            <GenericUseFormInput
                              placeholder="E-mail"
                              isFixedError={true}
                              {...register("email")}
                            />{" "}
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12 text-right">
                          <label className={styles.policyNo}>
                            {" "}
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.secondaryEmail
                            }
                          </label>
                        </div>
                        <div className={"col-lg-8 col-md-3 col-sm-12 "}>
                          <span className={styles.number}>
                            <GenericUseFormInput
                              placeholder="E-mail"
                              {...register("secondaryEmail")}
                            />{" "}
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12 text-right">
                          <label className={styles.policyNo}>
                            {" "}
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.cellPhone
                            }
                          </label>
                        </div>
                        <div className="col-lg-8 col-md-3 col-sm-12 ">
                          <span className={styles.number}>
                            <Controller
                              name="cellPhone"
                              control={control}
                              render={({ field: { onChange: cellTimePhone } }) => (
                                <GenericPhoneFormat
                                  placeholder="XXX-XXX-XXXX"
                                  defaultValue={getValues("cellPhone")}
                                  showError={errors["cellPhone"]}
                                  errorMsg={errors?.cellPhone?.message}
                                  handleChange={({ originalValue }) => {
                                    cellTimePhone(originalValue);
                                  }}
                                />
                              )}
                            />
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12 text-right">
                          <label className={styles.policyNo}>
                            {" "}
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.dayPhone
                            }
                          </label>
                        </div>
                        <div className={clsx("col-lg-8 col-md-3 col-sm-12 ")}>
                          <span className={styles.number}>
                            <Controller
                              name="dayPhone"
                              control={control}
                              render={({ field: { onChange: dayTimePhone } }) => (
                                <GenericPhoneFormat
                                  placeholder="XXX-XXX-XXXX"
                                  defaultValue={getValues("dayPhone")}
                                  showError={errors["dayPhone"]}
                                  errorMsg={errors?.dayPhone?.message}
                                  handleChange={({ originalValue }) => {
                                    dayTimePhone(originalValue);
                                  }}
                                />
                              )}
                            />
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12 text-right">
                          <label className={styles.policyNo}>
                            {" "}
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.eveningPhone
                            }
                          </label>
                        </div>
                        <div className={"col-lg-8 col-md-3 col-sm-12 "}>
                          <span className={styles.number}>
                            <Controller
                              name="eveningPhone"
                              control={control}
                              render={({ field: { onChange: eveningTimePhone } }) => (
                                <GenericPhoneFormat
                                  placeholder="XXX-XXX-XXXX"
                                  defaultValue={getValues("eveningPhone")}
                                  showError={errors["eveningPhone"]}
                                  errorMsg={errors?.eveningPhone?.message}
                                  handleChange={({ originalValue }) => {
                                    eveningTimePhone(originalValue);
                                  }}
                                />
                              )}
                            />
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12 mb-5 text-right">
                          <label className={styles.address}>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.address
                            }
                          </label>
                        </div>
                        <div className="col-lg-8 col-md-3 col-sm-12 ">
                          <span className={styles.number}>
                            <GenericUseFormInput
                              placeholder="Street Address 1"
                              {...register("streetAddressOne")}
                            />
                            <GenericUseFormInput
                              placeholder="Street Address 2"
                              {...register("streetAddressTwo")}
                            />
                            <GenericUseFormInput
                              placeholder="City / Town"
                              {...register("cityTown")}
                            />
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                          <label className={styles.policyNo}>
                            {" "}
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.state
                            }
                          </label>
                        </div>
                        <div
                          className={clsx(
                            "col-lg-8 col-md-3 col-sm-12",
                            styles.selectBox
                          )}
                        >
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
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                          <label className={styles.policyNo}>
                            <span style={{ color: "red" }}>*</span>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.zipCode
                            }
                          </label>
                        </div>
                        <div className="col-lg-8 col-md-3 col-sm-12 ">
                          <span className={styles.number}>
                            <GenericUseFormInput
                              placeholder="Zip Code"
                              {...register("zipCode")}
                              maxLength={5}
                            />{" "}
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center `}>
                        <div className="col-lg-4 col-md-4 col-sm-12  text-right">
                          <label className={styles.policyNo}>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.secondaryUserFirstName
                            }
                          </label>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12 ">
                          <span className={styles.number}>
                            {" "}
                            <GenericUseFormInput
                              placeholder=""
                              {...register("secondaryUserFirstName")}
                            />{" "}
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center `}>
                        <div className="col-lg-4 col-md-2 col-sm-12 text-right">
                          <label className={styles.policyNo}>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.secondaryUserLastName
                            }
                          </label>
                        </div>
                        <div className="col-lg-8 col-md-3 col-sm-12 ">
                          <span className={styles.number}>
                            {" "}
                            <GenericUseFormInput
                              placeholder=""
                              {...register("secondaryUserLastName")}
                            />{" "}
                          </span>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12 mb-5 text-right">
                          <label className={styles.policyNo}>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.secondaryAddress
                            }
                          </label>
                        </div>
                        <div className="col-lg-8 col-md-3 col-sm-12 ">
                          <div className={styles.number}>
                            <GenericUseFormInput
                              placeholder="Street Address 1"
                              {...register("streetAddressOnes")}
                            />
                            <GenericUseFormInput
                              placeholder="Street Address 2"
                              {...register("streetAddressTwos")}
                            />
                            <GenericUseFormInput
                              placeholder="City / Town"
                              {...register("cityTowns")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                          <label className={styles.policyNo}>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.state
                            }
                          </label>
                        </div>
                        <div
                          className={clsx(
                            "col-lg-8 col-md-3 col-sm-12",
                            styles.selectBox
                          )}
                        >
                          <div className={styles.number}>
                            <GenericSelect
                              name="state"
                              value={secondaryAddress}
                              // value={address.state}
                              onChange={handleSecondaryStateChange}
                              options={options}
                              getOptionLabel={(option: { state: any }) => option.state}
                              getOptionValue={(option: { id: any }) => option.id}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.policyNumber} row align-items-center`}>
                        <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                          <label className={styles.policyNo}>
                            <span style={{ color: "red" }}>*</span>
                            {
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.zipCode
                            }
                          </label>
                        </div>
                        <div className="col-lg-8 col-md-3 col-sm-12 ">
                          <span className={styles.number}>
                            <GenericUseFormInput
                              placeholder="Zip Code"
                              maxLength={5}
                              {...register("zipCodes")}
                            />{" "}
                          </span>
                        </div>
                      </div>

                      {/* <div className="row align-items-right"> */}
                      <div className={styles.actionBtnContainer}>
                        <div
                          className={clsx(
                            "d-flex justify-content-right ",
                            styles.cancelButton
                          )}
                        >
                          <GenericButton
                            label={
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.cancel
                            }
                            theme="normal"
                            size="medium"
                            onClick={() => handleCancel()}
                          ></GenericButton>
                        </div>
                        <div className="">
                          <GenericButton
                            type="submit"
                            label={
                              translate?.PolicyAndCoverageDetailsTranslate
                                ?.policyAndCoverage?.update
                            }
                            theme="normal"
                            size="medium"
                          ></GenericButton>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <>
                  {console.log("address", address, secondaryAddress)}
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.name
                        }
                      </label>
                    </div>

                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.policyHolderName}>
                        {" "}
                        {firstName} {lastName}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.email
                        }
                      </label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>{getValues("email")} </span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.secondaryEmail
                        }
                      </label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>{getValues("secondaryEmail")}</span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.cellPhone
                        }
                      </label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {phoneFormatHandler(getValues("cellPhone")).formattedInput}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.dayPhone
                        }
                      </label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {phoneFormatHandler(getValues("dayPhone")).formattedInput}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.eveningPhone
                        }
                      </label>
                    </div>
                    <div className={clsx("col-lg-4 col-md-3 col-sm-12 mt-2")}>
                      <span className={styles.number}>
                        {phoneFormatHandler(getValues("eveningPhone")).formattedInput}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.address
                        }
                      </label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {getValues("streetAddressOne") &&
                          `${getValues("streetAddressOne")}, `}
                        {getValues("streetAddressTwo") &&
                          `${getValues("streetAddressTwo")}, `}
                        {getValues("cityTown") && `${getValues("cityTown")}, `}
                        {address?.state && `${address?.state}, `}
                        {getValues("zipCode") && `${getValues("zipCode")}`}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.secondaryUserFirstName
                        }
                      </label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {getValues("secondaryUserFirstName")}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.secondaryUserLastName
                        }
                      </label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {getValues("secondaryUserLastName")}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.policyNumber} row align-items-center`}>
                    <div className="col-lg-4 col-md-4 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>
                        {
                          translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
                            ?.secondaryAddress
                        }
                      </label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {getValues("streetAddressOnes") &&
                          `${getValues("streetAddressOnes")}, `}
                        {getValues("streetAddressTwos") &&
                          `${getValues("streetAddressTwos")}, `}
                        {getValues("cityTowns") && `${getValues("cityTowns")},`}
                        {secondaryAddress?.state && `${secondaryAddress?.state}, `}
                        {getValues("zipCodes") && `${getValues("zipCodes")} `}
                      </span>
                    </div>
                  </div>
                  <div className={clsx("row")}>
                    <div className={styles.editStyle}>
                      <div>
                        <button className={styles.edit} onClick={() => handleClick()}>
                          <FaRegEdit className={styles.editIcon} />
                          {
                            translate?.PolicyAndCoverageDetailsTranslate
                              ?.policyAndCoverage?.edit
                          }
                        </button>
                      </div>
                      <div>
                        <button
                          className={styles.resetPassword}
                          onClick={() => handleReset(contactId)}
                        >
                          <IconContext.Provider value={{ className: styles.Password }}>
                            <ImLoop2 />
                          </IconContext.Provider>
                          {
                            translate?.PolicyAndCoverageDetailsTranslate
                              ?.policyAndCoverage?.sendLinktoPolicyholder
                          }{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Cards>
          </div>
        </div>
      </>
      <div className={styles.categoryLimit}>
        <GenericComponentHeading
          title={
            translate?.PolicyAndCoverageDetailsTranslate?.policyAndCoverage
              ?.categoryLimits
          }
          customHeadingClassname={styles.categoryLimit}
          customTitleClassname={styles.customTitleClassname}
        />
        <div className={styles.table}>
          <CustomReactTable table={table} data={categories} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  claimNumber: selectClaimNumber(state),
  policyNumber: selectPolicyNumber(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(PolicyAndCoverageDetails);
