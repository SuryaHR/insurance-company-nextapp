"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import AdjusterSalvageReportsComponentStyle from "./AdjusterSalvageReportsComponent.module.scss";

import dayjs from "dayjs";
import { any, object } from "valibot";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import useCustomForm from "@/hooks/useCustomForm";
import {
  fetchSalvageReportforReport,
  fetchSalvageStatusListForReport,
} from "@/reducers/_adjuster_reducers/Reports/SalvageReportSlice";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

import { slavageReportProp } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-salvage-reports/page";
import GenericSelect from "@/components/common/GenericSelect";

import DateTimePicker from "../../common/DateTimePicker/index";
import GenericButton from "../../common/GenericButton";
import AdjusterSalvageSearchBox from "./AdjusterSalvageReportsSearchComponent";
import AdjusterSalvageReportsTableComponent from "./AdjusterSalvageReportsTableComponent";
import CheckBoxSelect from "@/components/common/CheckBoxSelect/CheckBoxSelect";

export type Option = {
  value: number | string;
  label: string;
};

const staticRetainedLabels = [
  { label: "All", value: "All" },
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];
const AdjusterSalvageReportsComponent: React.FC = () => {
  const schema = object({
    toSelectedDate: any(),
    fromSelectedDate: any(),
    statusLabels: any(),
    retainedLabels: any(),
  });

  const defaultValue = {
    toSelectedDate: new Date(),
    fromSelectedDate: new Date(dayjs().startOf("year").toString()),
    statusLabels: null,
    retainedLabels: null,
  };

  const [tableLoader, setTableLoader] = React.useState<boolean>(false);
  const [fromSelectedDate, setFromSelectedDate] = useState<
    React.SetStateAction<null> | Date | any
  >(dayjs().startOf("year"));
  const [toSelectedDate, setToSelectedDate] = useState<
    React.SetStateAction<null> | Date | any
  >(new Date());
  const [resetPagination, setResetPagination] = React.useState<boolean>(false);
  const [statusLabels, setStatusLabels] = useState<Array<any>>();
  const [retainedLabels] = useState<Array<any>>(staticRetainedLabels);
  const [selectedObjects, setSelectedObjects] = useState<Array<any>>();

  const statusList = useAppSelector(
    (state: any) => state?.salvageReportSlice?.salvageStatuslist
  );
  const dispatch = useAppDispatch();

  const { control, reset, setValue, handleSubmit } = useCustomForm(schema, defaultValue);

  useMemo(() => {
    if (statusList && statusList?.length) {
      const statusLabels = statusList.map((item: any) => ({
        ...item,
        label: item.status,
        value: item.status,
        id: item.id,
      }));
      setStatusLabels(statusLabels);
    }
  }, [statusList]);

  const callTableData = () => {
    const payload = {
      reportStartDate: dayjs().startOf("year").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      reportEndDate: dayjs(new Date() ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      orderBy: "0",
      keyword: "",
      salvageStatus: [],
      ownerRetained: "0",
    };
    dispatch(fetchSalvageReportforReport(payload));
  };

  useEffect(() => {
    dispatch(fetchSalvageStatusListForReport());
    callTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleFromDateChange = (date: React.SetStateAction<null> | Date) => {
    setFromSelectedDate(date);
  };

  const handleToDateChange = (date: React.SetStateAction<null> | Date) => {
    setToSelectedDate(date);
  };

  const onFormSubmit = (data: any) => {
    const selectedStatusList = data?.statusLabels
      ? data?.statusLabels?.reduce((prev: any, curr: any) => {
          const gotObj = statusLabels?.filter((item: any) => item.status === curr.label);
          if (gotObj) {
            prev.push(gotObj[0]?.id);
          }
          return prev;
        }, [])
      : [];

    const selectedOwnerRetained = "0";

    const payload = {
      reportStartDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      reportEndDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
      orderBy: "0",
      keyword: "",
      salvageStatus: selectedStatusList,
      ownerRetained: selectedOwnerRetained,
    };
    dispatch(fetchSalvageReportforReport(payload));
  };

  const handleReset = () => {
    reset();
    setValue("toSelectedDate", new Date());
    setValue("fromSelectedDate", new Date(dayjs().startOf("year").toString()));
    setValue("statusLabels", null);
    setValue("retainedLabels", null);
    callTableData();
  };

  const handleChange = (selected: Option[]) => {
    setSelectedObjects(selected);
  };

  const { translate } =
    useContext<TranslateContextData<slavageReportProp>>(TranslateContext);

  return (
    <>
      <div className={AdjusterSalvageReportsComponentStyle.container}>
        <div className="col mx-4 mt-4">
          <span className={AdjusterSalvageReportsComponentStyle.headingText}>
            {translate?.slavageReportTranslate?.slavagereport?.slavageReports}
          </span>
          <hr />
        </div>
      </div>
      <div
        className={`col mx-4 mt-1 ${AdjusterSalvageReportsComponentStyle.filterContainer}`}
      >
        <div className="col-12 p-3">
          <h4 className={AdjusterSalvageReportsComponentStyle.filterText}>
            {" "}
            {translate?.slavageReportTranslate?.slavagereport?.filters}
          </h4>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div
            className={`col-12 my-2, ${AdjusterSalvageReportsComponentStyle.showSection}`}
          >
            <div className="col-3 text-right">
              <label className={AdjusterSalvageReportsComponentStyle.label}>
                {translate?.slavageReportTranslate?.slavagereport?.dateRange}
              </label>
            </div>
            <div
              className={`${AdjusterSalvageReportsComponentStyle.filterBtns} col-9 mx-4`}
            >
              <Controller
                control={control}
                name="fromSelectedDate"
                rules={{ required: true }}
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                  return (
                    <div className={AdjusterSalvageReportsComponentStyle.datePickerInput}>
                      <DateTimePicker
                        name="fromSelectedDate"
                        placeholderText="From"
                        showError={true}
                        errorMsg="kkkk"
                        errorMsgClassname="erressage"
                        labelClassname="labeext"
                        formControlClassname={
                          AdjusterSalvageReportsComponentStyle.DatePickerZindex
                        }
                        value={fromSelectedDate}
                        onChange={(e) => {
                          fieldOnChange(e);
                          handleFromDateChange(e);
                        }}
                        dateFormat="MM/dd/yyyy"
                        enableTime={true}
                        time_24hr={true}
                        minDate={null}
                        maxDate={toSelectedDate}
                        {...rest}
                      />
                    </div>
                  );
                }}
              />
              <div className={AdjusterSalvageReportsComponentStyle.btwMargin}>
                <label className={AdjusterSalvageReportsComponentStyle.label}>
                  {" "}
                  {translate?.slavageReportTranslate?.slavagereport?.to}
                </label>
              </div>
              <Controller
                control={control}
                name="toSelectedDate"
                rules={{ required: true }}
                defaultValue={new Date()}
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                  return (
                    <div
                      className={
                        AdjusterSalvageReportsComponentStyle.datePickerInputRight
                      }
                    >
                      <DateTimePicker
                        name="toSelectedDate"
                        placeholderText="To"
                        showError={true}
                        errorMsg="kkkk"
                        errorMsgClassname="erressage"
                        labelClassname="labeext"
                        formControlClassname={
                          AdjusterSalvageReportsComponentStyle.DatePickerZindex
                        }
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

          <div
            className={`col-12 my-2 ${AdjusterSalvageReportsComponentStyle.showSection}`}
          >
            <div className="col-3 text-right">
              <label className={AdjusterSalvageReportsComponentStyle.label}>
                {translate?.slavageReportTranslate?.slavagereport?.salvageStatus}
              </label>
            </div>
            <div
              className={`${AdjusterSalvageReportsComponentStyle.claimInput} col-9 mx-4`}
            >
              {statusLabels && (
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
              )}
            </div>
          </div>
          <div
            className={`col-12 my-2 ${AdjusterSalvageReportsComponentStyle.showSection}`}
          >
            <div className="col-3 text-right">
              <label className={AdjusterSalvageReportsComponentStyle.label}>
                {translate?.slavageReportTranslate?.slavagereport?.ownerRetained}
              </label>
            </div>
            <div
              className={`${AdjusterSalvageReportsComponentStyle.claimInput} col-9 mx-4`}
            >
              <Controller
                control={control}
                name="retainedLabels"
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                  <GenericSelect
                    options={retainedLabels}
                    name="retainedLabels"
                    placeholder={""}
                    getOptionLabel={(option: { label: any }) => option.label}
                    getOptionValue={(option: { value: any }) => option.value}
                    formControlClassname={
                      AdjusterSalvageReportsComponentStyle.selectBoxZindex
                    }
                    onChange={(e: any) => {
                      fieldOnChange(e);
                    }}
                    isModalPopUp={true}
                    {...rest}
                  />
                )}
              />
            </div>
          </div>

          <div
            className={`col-9 my-2, ${AdjusterSalvageReportsComponentStyle.showSection}`}
          >
            <div
              className={`${AdjusterSalvageReportsComponentStyle.buttonDiv} col-9 mx-2`}
            >
              <GenericButton
                type="submit"
                label={translate?.slavageReportTranslate?.slavagereport?.submit}
                size="small"
                btnClassname="mx-1"
              />
              <GenericButton
                type="reset"
                label={translate?.slavageReportTranslate?.slavagereport?.reset}
                size="small"
                onClick={handleReset}
                btnClassname="mx-1"
              />
            </div>
          </div>
        </form>
      </div>
      <div
        className={`${AdjusterSalvageReportsComponentStyle.tableTopsection} col mx-4 mt-2`}
      >
        <div className="col-3">
          <GenericButton btnClassname="mx-4 my-1" label="Export As Excel" size="small" />
        </div>
        <div
          className={`${AdjusterSalvageReportsComponentStyle.alignItemCenter} col-4 mx-4 my-2`}
        >
          <AdjusterSalvageSearchBox setTableLoader={setTableLoader} />
        </div>
      </div>
      <div className="col mx-4">
        <AdjusterSalvageReportsTableComponent
          resetPagination={resetPagination}
          setResetPagination={setResetPagination}
          fromSelectedDate={fromSelectedDate}
          toSelectedDate={toSelectedDate}
          tableLoader={tableLoader}
        />
      </div>
    </>
  );
};

export default AdjusterSalvageReportsComponent;
