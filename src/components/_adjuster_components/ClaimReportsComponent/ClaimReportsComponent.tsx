"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import ClaimReportsComponentStyle from "./ClaimReportsComponent.module.scss";

import dayjs from "dayjs";
import { any, object, string } from "valibot";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import useCustomForm from "@/hooks/useCustomForm";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import {
  fetchAllPolicyTypeForReport,
  fetchClaimsforReport,
  fetchStatusListForReport,
} from "@/reducers/_adjuster_reducers/Reports/ClaimsReportSlice";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";
import store from "@/store/store";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

import { claimReportPropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/claim-reports/page";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { exportClaimsforReportPDF } from "@/services/_adjuster_services/ReportServices/exportFunction";

import CheckBoxSelect from "../../common/CheckBoxSelect/CheckBoxSelect";
import CustomLoader from "../../common/CustomLoader/index";
import DateTimePicker from "../../common/DateTimePicker/index";
import GenericButton from "../../common/GenericButton";
import ClaimReportsTableComponent from "./ClaimReportsTableComponent";

export type Option = {
  value: number | string;
  label: string;
};

const ClaimReportsComponent: React.FC = () => {
  const schema = object({
    toSelectedDate: any(),
    fromSelectedDate: any(),
    policyholderName: string(),
    statusLabels: any(),
    policyLabels: any(),
  });

  const defaultValue = {
    toSelectedDate: new Date(),
    fromSelectedDate: new Date(dayjs().startOf("year").toString()),
    policyholderName: "",
    statusLabels: null,
    policyLabels: null,
  };
  const state = store.getState();
  const userId = selectLoggedInUserId(state);

  const [resetPagination, setResetPagination] = React.useState<boolean>(false);
  const [isExportfetching, setIsExportfetching] = useState(false);
  const [statusLabels, setStatusLabels] = useState<Array<any>>();
  const [policyLabels, setPolicyLabels] = useState<Array<any>>();
  const [fromSelectedDate, setFromSelectedDate] = useState<
    React.SetStateAction<null> | Date | any
  >(dayjs().startOf("year"));
  const [toSelectedDate, setToSelectedDate] = useState<
    React.SetStateAction<null> | Date | any
  >(new Date());
  const [apiDataPayload, setAPIDataPayload] = useState<any>(null);
  const [selectedObjects, setSelectedObjects] = useState<Array<any>>();
  const [selectedStatusObjects, setSelectedStatusObjects] = useState<Array<any>>();

  const statusList = useAppSelector(
    (state: any) => state?.claimsReportSlice?.statusListForReport
  );
  const policyList = useAppSelector(
    (state: any) => state?.claimsReportSlice?.policyListForReport
  );
  const dispatch = useAppDispatch();

  const { register, control, reset, setValue, handleSubmit } = useCustomForm(
    schema,
    defaultValue
  );

  useMemo(() => {
    const newStatusLabels: Array<any> = [];
    if (statusList && statusList?.length) {
      statusList.map((item: any) => {
        const got = newStatusLabels.find((element: any) => element.value === item.status);
        if (!got) {
          const obj = {
            id: item.id,
            value: item.status,
            label: item.status,
          };
          newStatusLabels.push(obj);
        }
      });
    }
    setStatusLabels(newStatusLabels);
  }, [statusList]);

  useMemo(() => {
    const newPolicyLabels: Array<any> = [];
    if (policyList && policyList?.length) {
      policyList.map((item: any) => {
        const got = newPolicyLabels.find(
          (element: any) => element.value === item.typeName
        );
        if (!got) {
          const obj = {
            id: item.typeName,
            value: item.typeName,
            label: item.typeName,
          };
          newPolicyLabels.push(obj);
        }
      });
    }
    setPolicyLabels(newPolicyLabels);
  }, [policyList]);

  const callTableData = () => {
    const payload = {
      fromDate: dayjs().startOf("year").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      toDate: dayjs(new Date() ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      pagination: { pageNumber: 1, limit: PAGINATION_LIMIT_20, orderBy: "asc" },
      statusIds: [],
      adjusterIds: [],
      assignedUserId: userId,
      policyTypes: [],
      branchIds: [],
    };
    dispatch(fetchClaimsforReport(payload));
  };

  useEffect(() => {
    dispatch(fetchStatusListForReport(null));
    dispatch(fetchAllPolicyTypeForReport(null));
    const payload = {
      fromDate: dayjs().startOf("year").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      toDate: dayjs(new Date() ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      pagination: { pageNumber: 1, limit: PAGINATION_LIMIT_20, orderBy: "asc" },
      statusIds: [],
      adjusterIds: [],
      assignedUserId: userId,
      policyTypes: [],
      branchIds: [],
    };
    dispatch(fetchClaimsforReport(payload));
  }, [dispatch, userId]);

  const handleExport = async () => {
    const status = await exportClaimsforReportPDF();

    if (status === "success") {
      setIsExportfetching(false);
      dispatch(
        addNotification({
          message: "Successfully download the excel!",
          id: "good",
          status: "success",
        })
      );
    } else if (status === "error") {
      setIsExportfetching(false);
      dispatch(
        addNotification({
          message: "Failed to export the details. Please try again..",
          id: "error",
          status: "error",
        })
      );
    }
  };

  const handleFromDateChange = (date: React.SetStateAction<null> | Date) => {
    setFromSelectedDate(date);
  };

  const handleToDateChange = (date: React.SetStateAction<null> | Date) => {
    setToSelectedDate(date);
  };

  const onFormSubmit = (data: any) => {
    const selectedStatusList = selectedStatusObjects
      ? selectedStatusObjects.reduce((prev: any, curr: any) => {
          prev.push(curr.id);
          return prev;
        }, [])
      : [];

    const selectedPolicyList = selectedObjects
      ? selectedObjects?.map((item) => item.value)
      : [];

    const payload = {
      fromDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      toDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      pagination: {
        pageNumber: 1,
        limit: "20",
        orderBy: "asc",
      },
      statusIds: selectedStatusList,
      searchKeyword: data.policyholderName,
      adjusterIds: [],
      assignedUserId: userId,
      policyTypes: selectedPolicyList,
      branchIds: [],
    };
    setAPIDataPayload({
      selectedStatusList: selectedStatusList,
      searchKeyword: data.policyholderName,
      selectedPolicyList: selectedPolicyList,
    });

    dispatch(fetchClaimsforReport(payload));
  };

  const handleReset = () => {
    reset();
    setValue("toSelectedDate", new Date());
    setValue("fromSelectedDate", new Date(dayjs().startOf("year").toString()));
    setValue("statusLabels", null);
    setValue("policyLabels", null);
    setSelectedObjects([]);
    setSelectedStatusObjects([]);
    setAPIDataPayload({
      selectedStatusList: [],
      searchKeyword: "",
      selectedPolicyList: [],
    });
    callTableData();
  };

  const { translate } =
    useContext<TranslateContextData<claimReportPropType>>(TranslateContext);

  const handleStatusChange = (selected: Option[]) => {
    setSelectedStatusObjects(selected);
  };

  const handleChange = (selected: Option[]) => {
    setSelectedObjects(selected);
  };

  return (
    <div className="pb-5">
      <div className={ClaimReportsComponentStyle.container}>
        <div className="col mx-4 mt-4">
          <span className={ClaimReportsComponentStyle.headingText}>
            {translate?.claimReportTranslate?.claimReport?.claimReports}
          </span>
          <hr />
        </div>
      </div>
      <div className={`col mx-4 mt-1 ${ClaimReportsComponentStyle.filterContainer}`}>
        <div className="col-12 p-3">
          <h4 className={ClaimReportsComponentStyle.filterText}>
            {translate?.claimReportTranslate?.claimReport?.filters}
          </h4>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className={`col-12 my-2, ${ClaimReportsComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={ClaimReportsComponentStyle.label}>
                {translate?.claimReportTranslate?.claimReport?.createdDateBetween}
              </label>
            </div>
            <div className={`${ClaimReportsComponentStyle.filterBtns} col-9 mx-4`}>
              <Controller
                control={control}
                name="fromSelectedDate"
                rules={{ required: true }}
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                  return (
                    <div className={ClaimReportsComponentStyle.datePickerInput}>
                      <DateTimePicker
                        name="fromSelectedDate"
                        placeholderText="From"
                        showError={true}
                        errorMsg="kkkk"
                        errorMsgClassname="erressage"
                        labelClassname="labeext"
                        formControlClassname={ClaimReportsComponentStyle.DatePickerZindex}
                        value={fromSelectedDate}
                        onChange={(e) => {
                          fieldOnChange(e);
                          handleFromDateChange(e);
                        }}
                        dateFormat="MM/dd/yyyy"
                        enableTime={true}
                        time_24hr={true}
                        minDate={null}
                        maxDate={toSelectedDate || new Date()}
                        {...rest}
                      />
                    </div>
                  );
                }}
              />
              <div className={ClaimReportsComponentStyle.btwMargin}>
                <label className={ClaimReportsComponentStyle.label}>
                  {translate?.claimReportTranslate?.claimReport?.to}
                </label>
              </div>
              <Controller
                control={control}
                name="toSelectedDate"
                rules={{ required: true }}
                defaultValue={new Date()}
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                  return (
                    <div className={ClaimReportsComponentStyle.datePickerInputRight}>
                      <DateTimePicker
                        name="toSelectedDate"
                        placeholderText="To"
                        showError={true}
                        errorMsg="kkkk"
                        errorMsgClassname="erressage"
                        labelClassname="labeext"
                        formControlClassname={ClaimReportsComponentStyle.DatePickerZindex}
                        value={toSelectedDate}
                        onChange={(e) => {
                          fieldOnChange(e);
                          handleToDateChange(e);
                        }}
                        dateFormat="MM/dd/yyyy"
                        enableTime={true}
                        time_24hr={true}
                        minDate={fromSelectedDate}
                        maxDate={new Date()}
                        {...rest}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </div>

          <div className={`col-12 my-2 ${ClaimReportsComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={ClaimReportsComponentStyle.label}>
                {translate?.claimReportTranslate?.claimReport?.claimStatus}
              </label>
            </div>
            <div className={`${ClaimReportsComponentStyle.claimInput} col-9 mx-4`}>
              <Controller
                control={control}
                name="statusLabels"
                render={({ field: { value, onChange, ...rest } }: any) => (
                  <CheckBoxSelect
                    key="status_labels"
                    options={statusLabels}
                    onChange={(selectedOptions: any) => {
                      onChange(selectedOptions);
                      handleStatusChange(selectedOptions);
                    }}
                    value={selectedStatusObjects}
                    isSelectAll={true}
                    placeholder={""}
                    capture={value}
                    {...rest}
                  />
                )}
              />
            </div>
          </div>
          <div className={`col-12 my-2 ${ClaimReportsComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={ClaimReportsComponentStyle.label}>
                {translate?.claimReportTranslate?.claimReport?.claimPolicyholderName}
              </label>
            </div>
            <div className={`${ClaimReportsComponentStyle.claimInput} col-9 mx-4`}>
              <GenericUseFormInput
                placeholder="Enter Claim # / Policyholder name"
                {...register("policyholderName")}
              />
            </div>
          </div>

          <div className={`col-12 my-2 ${ClaimReportsComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={ClaimReportsComponentStyle.label}>
                {translate?.claimReportTranslate?.claimReport?.policyType}
              </label>
            </div>
            <div className={`${ClaimReportsComponentStyle.claimInput} col-9 mx-4`}>
              <Controller
                control={control}
                name="policyLabels"
                render={({ field: { value, onChange, ...rest } }: any) => (
                  <CheckBoxSelect
                    key="status_policy"
                    options={policyLabels}
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
          <div className={`col-9 my-2, ${ClaimReportsComponentStyle.showSection}`}>
            <div className={`${ClaimReportsComponentStyle.buttonDiv} col-9 mx-2`}>
              <GenericButton
                type="submit"
                label={translate?.claimReportTranslate?.claimReport?.submit}
                size="small"
                btnClassname="mx-1"
              />
              <GenericButton
                type="reset"
                label={translate?.claimReportTranslate?.claimReport?.reset}
                size="small"
                onClick={handleReset}
                btnClassname="mx-1"
              />
            </div>
          </div>
        </form>
      </div>
      <div className={`${ClaimReportsComponentStyle.tableTopsection} col mx-4 mt-2`}>
        <GenericButton
          btnClassname={`${ClaimReportsComponentStyle.exportBtn} my-1`}
          label={translate?.claimReportTranslate?.claimReport?.exportAsExcel}
          size="small"
          onClick={handleExport}
        />
      </div>
      <div className="col mx-4">
        <ClaimReportsTableComponent
          resetPagination={resetPagination}
          setResetPagination={setResetPagination}
          fromSelectedDate={fromSelectedDate}
          toSelectedDate={toSelectedDate}
          apiDataPayload={apiDataPayload}
        />
      </div>
      {isExportfetching && <CustomLoader />}
    </div>
  );
};

export default ClaimReportsComponent;
