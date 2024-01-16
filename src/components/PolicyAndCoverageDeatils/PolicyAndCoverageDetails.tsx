"use client";

import React, { useState } from "react";
import styles from "./policyAndCoverageDetails.module.scss";
import Cards from "../common/Cards/index";
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

import GenericComponentHeading from "../common/GenericComponentHeading/index";
import CustomReactTable from "../common/CustomReactTable/index";
import { unknownObjectType } from "@/constants/customTypes";
import GenericButton from "../common/GenericButton/index";
import GenericInput from "../common/GenericInput/index";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import GenericSelect from "../common/GenericSelect/index";

export default function PolicyAndCoverageDetails() {
  const [show, setShow] = useState(false);
  const [coverageValue, setCoverageValue] = useState("(324) -878-7853");
  const [email, setEmail] = useState<any>(null);
  const [secondaryEmail, setSecondaryEmail] = useState(null);
  const [dayPhone, setDayPhone] = useState(null);
  const [eveningPhone, setEveningPhone] = useState(null);
  const [address, setAddress] = useState({
    addressOne: null,
    addressTwo: null,
    city: null,
    state: "CA",
    zipcode: null,
  });
  const [secondaryAddress, setSecondaryAddress] = useState({
    addressOne: null,
    addressTwo: null,
    city: null,
    state: "Ia",
    zipcode: null,
  });

  const columnHelper = createColumnHelper<unknownObjectType>();
  const dispatch = useAppDispatch();

  const columns = [
    columnHelper.accessor("categoryName", {
      header: () => "Category Name	",
      id: "Category Name",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("aggregateLimit", {
      header: () => "Aggregate Limit	",
      id: "Aggregate Limit",
    }),
    columnHelper.accessor("individualItemLimit", {
      header: () => "Individual Item Limit",
      id: "Individual Item Limit",
    }),
  ];
  const handleClick = () => {
    setShow(true);
  };
  const handleCancel = () => {
    setShow(false);
  };
  const handleReset = () => {
    if (email === null) {
      dispatch(
        addNotification({
          message:
            " Password reset successful. An email has been sent to  with details to reset password.",
          id: "email_upadte_null",
          status: "success",
        })
      );
    }
  };
  const handleUpdate = () => {
    if (email === null) {
      dispatch(
        addNotification({
          message: "Email should not null",
          id: "email_upadte_null",
          status: "error",
        })
      );
    } else if (email.match(regex) != null) {
      dispatch(
        addNotification({
          message: "Policyholder details has been updated successfully",
          id: "email_upadte_null",
          status: "success",
        })
      );
    } else {
      dispatch(
        addNotification({
          message: "Email should not null",
          id: "email_upadte_null",
          status: "error",
        })
      );
    }
  };

  const regex: RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const claimResult = [
    {
      categoryName: "Others	",
      aggregateLimit: "$1,500.00	",
      individualItemLimit: "$500.00",
    },
    {
      categoryName: "Clothing and Accessories		",
      aggregateLimit: "$1,500.00	",
      individualItemLimit: "$1,500.00	",
    },
    {
      categoryName: "Personal Care and Beauty",
      aggregateLimit: "$2,500.00",
      individualItemLimit: "$2,500.00 ",
    },
    {
      categoryName: "Office Equipment	",
      aggregateLimit: "$1,500.00",
      individualItemLimit: "$1,500.00",
    },
  ];
  const table = useReactTable({
    data: claimResult,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    manualFiltering: true,
    enableColumnFilters: false,
  });

  return (
    <>
      <>
        <div className={clsx("row", styles.policyAndCoverageDetails)}>
          <div className={styles.card1}>
            <Cards className={styles.cardPolicy}>
              <GenericComponentHeading title="Policy Coverage Details" />
              <div className={styles.policyCoverageDetails}>
                <div className={clsx("row align-items-center", styles.policyNumber)}>
                  <div className="col-lg-6 col-md-2 col-sm-12 mt-2 text-right">
                    <label className={styles.policyNo}>Policy No :</label>
                  </div>
                  <div className={"col-lg-4 col-md-3 col-sm-12 mt-2"}>
                    <span className={styles.number}>PLEICGS051920231101</span>
                  </div>
                </div>
                <div className={clsx("row align-items-center", styles.policyNumber)}>
                  <div className="col-lg-6 col-md-2 col-sm-12 mt-2 text-right">
                    <label className={styles.policyNo}>Homeowners Policy Type:</label>
                  </div>
                  <div className={clsx("col-lg-4 col-md-3 col-sm-12 mt-2")}>
                    <span className={styles.number}>HO-3</span>
                  </div>
                </div>
                <div className={clsx("row align-items-center", styles.policyNumber)}>
                  <div className="col-lg-6 col-md-2 col-sm-12 mt-2 text-right">
                    <label className={styles.policyNo}>Total Coverage :</label>
                  </div>
                  <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                    <span className={styles.number}>$300,000.00</span>
                  </div>
                </div>
                <div className={clsx("row align-items-center", styles.policyNumber)}>
                  <div className="col-lg-6 col-md-2 col-sm-12 mt-2 text-right">
                    <label className={styles.policyNo}>Special Limit :</label>
                  </div>
                  <div className={clsx("col-lg-4 col-md-3 col-sm-12 mt-2")}>
                    <span className={styles.number}>$25,000.00</span>
                  </div>
                </div>
                <div className={clsx("row align-items-center", styles.policyNumber)}>
                  <div className="col-lg-6 col-md-2 col-sm-12 mt-2 text-right">
                    <label className={styles.policyNo}>Deductible Amount :</label>
                  </div>
                  <div className={clsx("col-lg-4 col-md-3 col-sm-12 mt-2")}>
                    <span className={styles.number}>$200.00</span>
                  </div>
                </div>
              </div>
            </Cards>
          </div>
          <div className={styles.card2}>
            <Cards className={styles.cardPolicy}>
              <GenericComponentHeading title={"Category Limits"} />
              {show ? (
                <>
                  <div className={styles.editableDiv}>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>Name</label>
                      </div>

                      <div className="col-lg-4 col-md-3 col-sm-12 ">
                        <span className={styles.graceSmith}>Grace Smith</span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>Email</label>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-12 ">
                        <span className={styles.number}>
                          {" "}
                          <GenericInput
                            placeholder="E-mail"
                            isFixedError={true}
                            value={email}
                            onChange={(e: any) => {
                              setEmail(e.target.value);
                            }}
                          />{" "}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>Secondary Email</label>
                      </div>
                      <div className={"col-lg-8 col-md-3 col-sm-12 "}>
                        <span className={styles.number}>
                          <GenericInput
                            placeholder="E-mail"
                            isFixedError={true}
                            value={secondaryEmail}
                            onChange={(e: any) => {
                              setSecondaryEmail(e.target.value);
                            }}
                          />{" "}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>Cell Phone</label>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-12 ">
                        <span className={styles.number}>
                          <GenericInput
                            value={coverageValue}
                            onChange={(e: {
                              target: { value: React.SetStateAction<string> };
                            }) => setCoverageValue(e.target.value)}
                            maxLength="10"
                          />
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>Day Phone</label>
                      </div>
                      <div className={clsx("col-lg-8 col-md-3 col-sm-12 ")}>
                        <span className={styles.number}>
                          <GenericInput
                            placeholder="XXX-XXX-XXXX"
                            value={dayPhone}
                            onChange={(e: any) => setDayPhone(e.target.value)}
                          />
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>Evening Phone</label>
                      </div>
                      <div className={"col-lg-8 col-md-3 col-sm-12 "}>
                        <span className={styles.number}>
                          <GenericInput
                            placeholder="XXX-XXX-XXXX"
                            value={eveningPhone}
                            onChange={(e: any) => setEveningPhone(e.target.value)} // pattern={pattern}
                          />{" "}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12 mb-5 text-right">
                        <label className={styles.address}>Address</label>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-12 ">
                        <span className={styles.number}>
                          <GenericInput
                            placeholder="Street Address 1"
                            value={address.addressOne}
                            onChange={(e: any) =>
                              setAddress((prev) => ({
                                ...prev,
                                addressOne: e.target.value,
                              }))
                            } // pattern={pattern}
                          />
                          <GenericInput
                            placeholder="Street Address 2"
                            value={address.addressTwo}
                            onChange={(e: any) =>
                              setAddress((prev) => ({
                                ...prev,
                                addressTwo: e.target.value,
                              }))
                            } // pattern={pattern}
                          />
                          <GenericInput
                            placeholder="City / Town"
                            value={address.city}
                            onChange={(e: any) =>
                              setAddress((prev) => ({ ...prev, city: e.target.value }))
                            } // pattern={pattern}
                          />
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>State</label>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-12 ">
                        <span className={styles.number}>
                          <GenericSelect
                            name="state"
                            getOptionLabel={(option: { state: any }) => option.state}
                            getOptionValue={(option: { id: any }) => option.id}
                          />
                          {/* )}
/> */}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>
                          <span style={{ color: "red" }}>*</span>Zip Code
                        </label>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-12 ">
                        <span className={styles.number}>
                          <GenericInput
                            placeholder="Zip Code"
                            value={address.zipcode}
                            onChange={(e: any) =>
                              setAddress((prev) => ({ ...prev, zipcode: e.target.value }))
                            }
                            maxLength="5"
                          />{" "}
                        </span>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12 mb-5 text-right">
                        <label className={styles.policyNo}>Secondary Address</label>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-12 ">
                        <div className={styles.number}>
                          <GenericInput
                            placeholder="Street Address 1"
                            value={secondaryAddress.addressOne}
                            onChange={(e: any) =>
                              setSecondaryAddress((prev) => ({
                                ...prev,
                                addressOne: e.target.value,
                              }))
                            }
                          />
                          <GenericInput
                            placeholder="Street Address 2"
                            value={secondaryAddress.addressTwo}
                            onChange={(e: any) =>
                              setSecondaryAddress((prev) => ({
                                ...prev,
                                addressTwo: e.target.value,
                              }))
                            }
                          />
                          <GenericInput
                            placeholder="City / Town"
                            value={secondaryAddress.city}
                            onChange={(e: any) =>
                              setSecondaryAddress((prev) => ({
                                ...prev,
                                addressTwo: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>State</label>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-12 ">
                        <div className={styles.number}>
                          <GenericSelect
                            name="state"
                            value={secondaryAddress.state}
                            onChange={(e: any) =>
                              setSecondaryAddress((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            getOptionLabel={(option: { state: any }) => option.state}
                            getOptionValue={(option: { id: any }) => option.id}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={clsx("row align-items-center", styles.policyNumber)}>
                      <div className="col-lg-4 col-md-2 col-sm-12  text-right">
                        <label className={styles.policyNo}>
                          <span style={{ color: "red" }}>*</span>Zip Code
                        </label>
                      </div>
                      <div className="col-lg-8 col-md-3 col-sm-12 ">
                        <span className={styles.number}>
                          <GenericInput
                            placeholder="Zip Code"
                            // type="number"
                            maxLength="5"
                            value={secondaryAddress.zipcode}
                            onChange={(e: any) =>
                              setSecondaryAddress((prev) => ({
                                ...prev,
                                zipcode: e.target.value,
                              }))
                            } // pattern={pattern}
                          />{" "}
                        </span>
                      </div>
                    </div>
                    <div className="row align-items-right">
                      <div
                        className={clsx(
                          "col-lg-10 col-md-4 col-sm-12 mt-2 d-flex justify-content-right ",
                          styles.cancelButton
                        )}
                      >
                        <GenericButton
                          label={"Cancel"}
                          theme="normal"
                          size="medium"
                          onClick={() => handleCancel()}
                        ></GenericButton>
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-12 mt-2">
                        <GenericButton
                          label={"update"}
                          theme="normal"
                          size="medium"
                          onClick={() => handleUpdate()}
                        ></GenericButton>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={clsx("row align-items-center", styles.policyNumber)}>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>Name</label>
                    </div>

                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>Grace Smith</span>
                    </div>
                  </div>
                  <div className={clsx("row align-items-center", styles.policyNumber)}>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>Email</label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>{email} </span>
                    </div>
                  </div>
                  <div className={clsx("row align-items-center", styles.policyNumber)}>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>Secondary Email</label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>{secondaryEmail} </span>
                    </div>
                  </div>
                  <div className={clsx("row align-items-center", styles.policyNumber)}>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>Cell Phone</label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {coverageValue ?? "(324) -878-7853"}
                      </span>
                    </div>
                  </div>
                  <div className={clsx("row align-items-center", styles.policyNumber)}>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>Day Phone</label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>{dayPhone ?? "$200.00"}</span>
                    </div>
                  </div>
                  <div className={clsx("row align-items-center", styles.policyNumber)}>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>Evening Phone</label>
                    </div>
                    <div className={clsx("col-lg-4 col-md-3 col-sm-12 mt-2")}>
                      <span className={styles.number}>{eveningPhone} </span>
                    </div>
                  </div>
                  <div className={clsx("row align-items-center", styles.policyNumber)}>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>Address</label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {address.addressOne ? `${address.addressOne},` : ""}
                        {address.addressTwo ? `${address.addressTwo},` : ""}
                        {address.city ? `${address.city},` : ""}
                        {address.state ? `${address.state}` : ""}
                        {address.zipcode ? `,${address.zipcode}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className={clsx("row align-items-center", styles.policyNumber)}>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-2 text-right">
                      <label className={styles.policyNo}>Secondary Address</label>
                    </div>
                    <div className="col-lg-4 col-md-3 col-sm-12 mt-2">
                      <span className={styles.number}>
                        {secondaryAddress.addressOne
                          ? `${secondaryAddress.addressOne},`
                          : ""}
                        {secondaryAddress.addressTwo
                          ? `${secondaryAddress.addressTwo},`
                          : ""}
                        {secondaryAddress.city ? `${secondaryAddress.city},` : ""}
                        {secondaryAddress.state ? `${secondaryAddress.state}` : ""}
                        {secondaryAddress.zipcode ? `,${secondaryAddress.zipcode}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className={clsx("row align-items-center")}>
                    <div className="col-lg-8 col-md-2 col-sm-12 mt-3 text-right">
                      <button className={styles.edit} onClick={() => handleClick()}>
                        <FaRegEdit className={styles.editIcon} />
                        Edit
                      </button>
                    </div>
                    <div className="col-lg-4 col-md-2 col-sm-12 mt-3">
                      <button
                        className={styles.resetPassword}
                        onClick={() => handleReset()}
                      >
                        <IconContext.Provider value={{ className: styles.Password }}>
                          <ImLoop2 />
                        </IconContext.Provider>
                        Reset Password
                      </button>
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
          title={"Category Limits"}
          customHeadingClassname={styles.categoryLimit}
          customTitleClassname={styles.customTitleClassname}
        />
        <div className={styles.table}>
          <CustomReactTable table={table} />
        </div>
      </div>
    </>
  );
}
