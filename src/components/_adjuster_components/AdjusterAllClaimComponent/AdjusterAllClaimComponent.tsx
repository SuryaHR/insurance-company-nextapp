"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { connect } from "react-redux";

import AdjusterAllClaimComponentStyle from "./AdjusterAllClaimComponent.module.scss";

import dayjs from "dayjs";
import { any, array, object, string } from "valibot";

import { useAppSelector } from "@/hooks/reduxCustomHook";
import useCustomForm from "@/hooks/useCustomForm";
import { fetchClaimListDataAction } from "@/reducers/_adjuster_reducers/ClaimData/ClaimSlice";

import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";

import CheckBoxSelect from "../../common/CheckBoxSelect/CheckBoxSelect";
import DateTimePicker from "../../common/DateTimePicker/index";
import GenericButton from "../../common/GenericButton";
import AllClaimTableComponent from "./AllClaimTableComponent";

export type Option = {
  value: number | string;
  label: string;
};

const AdjusterAllClaimComponent: React.FC = (props: any) => {
  const { fetchClaimListDataAction } = props;
  const schema = object({
    claimDate: any(),
    policyholderName: string("policyholderName"),
    statusLabels: array(
      object({
        label: string(),
        value: string(),
      })
    ),
    startClaimDate: any(),
    endClaimDate: any(),
  });

  const defaultValue = {
    startClaimDate: "",
    endClaimDate: "",
    policyholderName: "",
    statusLabels: "",
  };

  const { register, control, reset, handleSubmit, watch, setValue } = useCustomForm(
    schema,
    defaultValue
  );
  const startDateTime: any = watch("startClaimDate");
  const endDateTime: any = watch("endClaimDate");
  const searchedPolicyname = watch("policyholderName");
  const [resetPagination, setResetPagination] = React.useState<boolean>(false);
  const [sendStartDate, setSendStartDate] = useState<React.SetStateAction<any>>(null);
  const [sendEndDate, setSendEndDate] = useState<React.SetStateAction<any>>(null);
  const [statusIds, setstatusIds] = useState<React.SetStateAction<any>>();
  const [startDate, setStartSelectedDate] = useState<React.SetStateAction<null> | Date>(
    null
  );
  const [endDate, setEndSelectedDate] = useState<React.SetStateAction<null> | Date | any>(
    null
  );
  const [selectedObjects, setSelectedObjects] = useState<Array<any>>();

  const handleStartDateChange = (date: React.SetStateAction<null> | Date | any) => {
    setStartSelectedDate(date);
  };

  const handleEndDateChange = (date: React.SetStateAction<null> | Date | any) => {
    setEndSelectedDate(date);
  };
  const statusList = useAppSelector((state: any) => state?.claimdata?.statusList);

  const [activeButton, setActiveButton] = useState("allClaim");
  const [statusLabels, setStatusLabels] = useState<Array<any>>();

  useMemo(() => {
    const statusToInclude: Array<string> = [
      "Work In Progress",
      "Created",
      "Supervisor Approval",
      "Closed",
    ];
    const newStatusLabels: Array<any> = [];
    if (statusList && statusList?.length) {
      statusList.map((item: any) => {
        if (statusToInclude.includes(item.status)) {
          const got = newStatusLabels.find(
            (element: any) => element.value === item.status
          );
          if (!got) {
            const obj = {
              id: item.id,
              value: item.status,
              label: item.status,
            };
            newStatusLabels.push(obj);
          }
        }
      });
    }
    setStatusLabels(newStatusLabels);
  }, [statusList]);

  const onFormSubmit = () => {
    reset();
    setActiveButton("allClaim");
  };

  const handlebtnSubmit = (e: any) => {
    e.preventDefault();
    let startDate = null;
    let endDate = null;
    let statusIds = [];
    if (startDateTime) {
      startDate = dayjs(startDateTime).format("MM-DD-YYYY[T]HH:mm:ss[Z]");
    }
    if (endDateTime) {
      endDate = dayjs(endDateTime).format("MM-DD-YYYY[T]HH:mm:ss[Z]");
    }
    if (selectedObjects) {
      statusIds = selectedObjects
        ? selectedObjects.reduce((prev: any, curr: any) => {
            prev.push(curr.id);
            return prev;
          }, [])
        : [];
    }
    setResetPagination(true);
    setSendStartDate(startDate);
    setSendEndDate(endDate);
    setstatusIds(statusIds);
    const params = {
      filter: { startDate, endDate },
      pagination: {
        pageNumber: 1,
        limit: PAGINATION_LIMIT_20,
        sortBy: "createDate",
        orderBy: "desc",
      },
      searchKeyword: searchedPolicyname,
      statusIds: statusIds,
    };

    fetchClaimTableData(params);
  };

  const handleButtonClick = (buttonName: any) => {
    setActiveButton(buttonName);
    if (buttonName === "thisMonth") {
      const currentDate = dayjs();
      const startDate = currentDate.startOf("month");
      const endDate = currentDate;
      setValue("startClaimDate", new Date(startDate.format("MM/DD/YYYY")));
      setValue("endClaimDate", new Date(endDate.format("MM/DD/YYYY")));
    }
    if (buttonName === "lastThreeMonth") {
      const currentDate = dayjs();
      const startDate = currentDate.add(-3, "month").startOf("month");
      const endDate = currentDate;
      setValue("startClaimDate", new Date(startDate.format("MM/DD/YYYY")));
      setValue("endClaimDate", new Date(endDate.format("MM/DD/YYYY")));
    }
    if (buttonName === "allClaim") {
      reset();
    }
  };

  const handleClear = () => {
    reset();
    setActiveButton("allClaim");
    const params = {
      pagination: {
        pageNumber: 1,
        limit: PAGINATION_LIMIT_20,
        sortBy: "createDate",
        orderBy: "desc",
      },
      searchKeyword: "",
      statusIds: null,
    };
    setResetPagination(true);
    setSelectedObjects([]);
    setSendStartDate(null);
    setSendEndDate(null);
    fetchClaimTableData(params);
  };

  const fetchClaimTableData = (params: any) => {
    fetchClaimListDataAction(params);
  };

  useEffect(() => {}, [startDate, endDate]);

  const handleChange = (selected: Option[]) => {
    setSelectedObjects(selected);
  };

  return (
    <>
      <div className={AdjusterAllClaimComponentStyle.container}>
        <div className="col mx-4 mt-4">
          <span className={AdjusterAllClaimComponentStyle.headingText}> All Claims</span>
          <hr />
        </div>
      </div>
      <div className={`col mx-4 mt-1 ${AdjusterAllClaimComponentStyle.filterContainer}`}>
        <div className="col-12 p-3">
          <h4 className={AdjusterAllClaimComponentStyle.filterText}>Filters</h4>
        </div>
        <div className={`col-12 my-2 ${AdjusterAllClaimComponentStyle.showSection}`}>
          <div className="col-3 text-right">
            <label className={AdjusterAllClaimComponentStyle.label}>Show</label>
          </div>
          <div className={`${AdjusterAllClaimComponentStyle.filterBtns} col-9 mx-4`}>
            <GenericButton
              label="All Claims"
              size="medium"
              className={
                activeButton == "allClaim" ? AdjusterAllClaimComponentStyle.myButton : ""
              }
              onClick={() => handleButtonClick("allClaim")}
            />
            <GenericButton
              label="This Month"
              size="medium"
              className={
                activeButton == "thisMonth" ? AdjusterAllClaimComponentStyle.myButton : ""
              }
              onClick={() => handleButtonClick("thisMonth")}
            />
            <GenericButton
              label="Last 3 Months"
              size="medium"
              className={
                activeButton == "lastThreeMonth"
                  ? AdjusterAllClaimComponentStyle.myButton
                  : ""
              }
              onClick={() => handleButtonClick("lastThreeMonth")}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className={`col-12 my-2, ${AdjusterAllClaimComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={AdjusterAllClaimComponentStyle.label}>Claim Date</label>
            </div>
            <div className={`${AdjusterAllClaimComponentStyle.claimInput} col-9 mx-4`}>
              <div className={`${AdjusterAllClaimComponentStyle.dateFields}`}>
                <div>
                  <Controller
                    control={control}
                    name="startClaimDate"
                    rules={{ required: true }}
                    render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                      return (
                        <DateTimePicker
                          placeholderText="From"
                          showError={true}
                          errorMsg="Error"
                          errorMsgClassname="Not a vaild"
                          labelClassname="labeext"
                          value={startDate}
                          customDateClassName={AdjusterAllClaimComponentStyle.datePic}
                          formControlClassname={`${AdjusterAllClaimComponentStyle.zIndex2}`}
                          onChange={(e) => {
                            fieldOnChange(e);
                            handleStartDateChange(e);
                          }}
                          dateFormat="MM/dd/yyyy"
                          enableTime={true}
                          time_24hr={true}
                          minDate={null}
                          maxDate={endDateTime || new Date()}
                          {...rest}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="endClaimDate"
                    rules={{ required: true }}
                    render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                      return (
                        <DateTimePicker
                          placeholderText="To"
                          showError={true}
                          errorMsg="Error"
                          errorMsgClassname="Not a vaild"
                          labelClassname="labeext"
                          customDateClassName={AdjusterAllClaimComponentStyle.datePic}
                          formControlClassname={`${AdjusterAllClaimComponentStyle.zIndex2}`}
                          value={endDate}
                          onChange={(e) => {
                            fieldOnChange(e);
                            handleEndDateChange(e);
                          }}
                          dateFormat="MM/dd/yyyy"
                          enableTime={true}
                          time_24hr={true}
                          minDate={startDateTime}
                          maxDate={new Date()}
                          {...rest}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`col-12 my-2 ${AdjusterAllClaimComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={AdjusterAllClaimComponentStyle.label}>Claim status</label>
            </div>
            <div className={`${AdjusterAllClaimComponentStyle.claimInput} col-9 mx-4`}>
              <Controller
                control={control}
                name="statusLabels"
                render={({ field: { value, onChange, ...rest } }: any) => (
                  <CheckBoxSelect
                    key="status-id"
                    options={statusLabels}
                    onChange={(selectedOptions: any) => {
                      onChange(selectedOptions);
                      handleChange(selectedOptions);
                    }}
                    value={selectedObjects}
                    isSelectAll={true}
                    placeholder={""}
                    capture={value}
                    {...rest}
                  />
                )}
              />
            </div>
          </div>

          <div className={`col-12 my-2 ${AdjusterAllClaimComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={AdjusterAllClaimComponentStyle.label}>
                Claim # / Policyholder name
              </label>
            </div>
            <div className={`${AdjusterAllClaimComponentStyle.claimInput} col-9 mx-4`}>
              <GenericUseFormInput
                placeholder="Enter Claim # or Policyholder name"
                {...register("policyholderName")}
              />
            </div>
            <div className="row"></div>
          </div>
          <div className="row">
            <div className={`col-9 my-4, ${AdjusterAllClaimComponentStyle.showSection}`}>
              <div className={`${AdjusterAllClaimComponentStyle.buttonDiv} col-9 mx-4`}>
                <GenericButton
                  label="Search"
                  size="small"
                  type="submit"
                  btnClassname="mx-2"
                  onClick={(e: any) => handlebtnSubmit(e)}
                />
                <GenericButton
                  onClick={handleClear}
                  label="Clear All"
                  size="small"
                  btnClassname="mx-2"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="col mx-4 mt-2 pb-4">
        <AllClaimTableComponent
          searchedPolicyname={searchedPolicyname}
          statusIds={statusIds}
          startDate={sendStartDate}
          endDate={sendEndDate}
          resetPagination={resetPagination}
          setResetPagination={setResetPagination}
        />
      </div>
    </>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  fetchClaimListDataAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AdjusterAllClaimComponent);
