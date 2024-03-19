"use client";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import PaymentComponentStyle from "./PaymentsComponent.module.scss";

import dayjs from "dayjs";
import { any, object, string } from "valibot";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import useCustomForm from "@/hooks/useCustomForm";
import {
  fetchVendorPayments,
  fetchVendorPaymentsRegVendors,
  fetchVendorPaymentsStatus,
} from "@/reducers/_adjuster_reducers/VendorInvoicePayments/VendorPaymentsSlice";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

import { PayementTranslateProp } from "@/app/[lang]/(adjuster)/(dashboardLayout)/vendor-payments/page";
import DateTimePicker from "@/components/common/DateTimePicker";
import GenericButton from "@/components/common/GenericButton";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericSelect from "@/components/common/GenericSelect";

import PaymentsTableComponent from "./PaymentsTableComponent";

const PaymentsComponent: React.FC = () => {
  const schema = object({
    claimNumber: string(),
    statusLabels: any(),
    toSelectedDate: any(),
    fromSelectedDate: any(),
    vendorLabels: any(),
  });

  const defaultValue = {
    claimNumber: "",
    statusLabels: null,
    toSelectedDate: new Date(),
    fromSelectedDate: new Date(dayjs().startOf("year").toString()),
    vendorLabels: null,
  };
  const [statusLabels, setStatusLabels] = useState<Array<any>>();
  const [vendorLabels, setVendorLabels] = useState<Array<any>>();
  const [view, setView] = useState<any>({
    isClaimWise: true,
  });

  const [fromSelectedDate, setFromSelectedDate] = useState<
    React.SetStateAction<null> | Date | any
  >(dayjs().startOf("year"));
  const [toSelectedDate, setToSelectedDate] = useState<
    React.SetStateAction<null> | Date | any
  >(new Date());

  const statusList = useAppSelector(
    (state: any) => state?.vendorPaymentsSlice?.vendorPaymentsStatus
  );
  const vendorList = useAppSelector(
    (state: any) => state?.vendorPaymentsSlice?.vendorPaymentsRegVendors
  );

  const dispatch = useAppDispatch();
  const { register, control, reset, setValue, handleSubmit } = useCustomForm(
    schema,
    defaultValue
  );
  useMemo(() => {
    if (statusList && statusList?.length) {
      const statusLabels = statusList.map((item: any) => ({
        ...item,
        label: item.name,
        value: item.name,
        id: item.id,
      }));
      setStatusLabels(statusLabels);
    }
  }, [statusList]);

  useMemo(() => {
    const newVendorLabels: Array<any> = [];
    if (vendorList.companyVendors && vendorList?.companyVendors.length) {
      vendorList.companyVendors.map((item: any) => {
        if (item) {
          newVendorLabels.push({ label: item.name, value: item.name, id: item.id });
        }
      });
    }
    setVendorLabels(newVendorLabels);
  }, [vendorList]);

  const callTableData = useCallback(() => {
    const payload = {
      claimNumber: "",
      invoicesStatus: [],
      limit: "20",
      page: 1,
      reportEndDate: dayjs(toSelectedDate ?? "").format("YYYY-MM-DD"),
      reportStartDate: dayjs(fromSelectedDate ?? "").format("YYYY-MM-DD"),
      vendor: [],
      ...view,
    };
    dispatch(fetchVendorPayments(payload));
  }, [dispatch, toSelectedDate, fromSelectedDate, view]);

  useEffect(() => {
    dispatch(fetchVendorPaymentsStatus(null));
    dispatch(fetchVendorPaymentsRegVendors(null));
    callTableData();
  }, [callTableData, dispatch]);

  const handleFromDateChange = (date: React.SetStateAction<null> | Date) => {
    setFromSelectedDate(date);
  };

  const handleToDateChange = (date: React.SetStateAction<null> | Date) => {
    setToSelectedDate(date);
  };

  const onFormSubmit = (data: any) => {
    const selectedStatusList = data?.statusLabels
      ? data?.statusLabels?.reduce((prev: any, curr: any) => {
          const gotObj = statusLabels?.filter((item: any) => item.name === curr.label);
          if (gotObj) {
            prev.push(gotObj[0]?.id);
          }
          return prev;
        }, [])
      : [];
    const selectedVendorList = data.vendorLabels
      ? data.vendorLabels.reduce((prev: any, curr: any) => {
          const gotObj = vendorLabels?.findIndex(
            (item: any) => item.value === curr.label
          );

          if (gotObj && gotObj > 0) {
            prev.push(gotObj);
          }
          return prev;
        }, [])
      : [];

    const payload = {
      claimNumber: data.claimNumber,
      invoicesStatus: selectedStatusList,
      limit: "20",
      page: 1,
      reportEndDate: dayjs(toSelectedDate ?? "").format("YYYY-MM-DD"),
      reportStartDate: dayjs(fromSelectedDate ?? "").format("YYYY-MM-DD"),
      vendor: selectedVendorList,
      ...view,
    };

    dispatch(fetchVendorPayments(payload));
  };

  const handleReset = () => {
    reset();
    setValue("toSelectedDate", new Date());
    setValue("fromSelectedDate", new Date(dayjs().startOf("year").toString()));
    setValue("statusLabels", null);
    setValue("vendorLabels", null);
    callTableData();
  };

  const handleViewWise = (type: string) => {
    if (type === "claim")
      setView({
        isClaimWise: true,
      });
    if (type === "vendor")
      setView({
        isVendorWise: true,
      });
  };
  const { translate } =
    useContext<TranslateContextData<PayementTranslateProp>>(TranslateContext);

  return (
    <>
      <div className={PaymentComponentStyle.container}>
        <div className="col mx-4 mt-4">
          <span className={PaymentComponentStyle.headingText}>
            {translate?.PayementsTranslate?.payements?.payements}{" "}
          </span>
          <hr />
        </div>
      </div>

      <div className={`col mx-4 mt-1 ${PaymentComponentStyle.filterContainer}`}>
        <div className="col-12 p-3">
          <h4 className={PaymentComponentStyle.filterText}>
            {translate?.PayementsTranslate?.payements?.filters}
          </h4>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className={`col-12 my-2 ${PaymentComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={PaymentComponentStyle.label}>
                {translate?.PayementsTranslate?.payements?.Status}
              </label>
            </div>
            <div className={`${PaymentComponentStyle.claimInput} col-9 mx-4`}>
              <Controller
                control={control}
                name="statusLabels"
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                  <GenericSelect
                    options={statusLabels}
                    placeholder={"Select Status"}
                    formControlClassname={PaymentComponentStyle.selectStatusBoxZindex}
                    isMulti={true}
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

          <div className={`col-12 my-2, ${PaymentComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={PaymentComponentStyle.label}>
                {translate?.PayementsTranslate?.payements?.createdDate}
              </label>
            </div>
            <div className={`${PaymentComponentStyle.filterBtns} col-9 mx-4`}>
              <Controller
                control={control}
                name="fromSelectedDate"
                rules={{ required: true }}
                defaultValue={new Date()}
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                  return (
                    <div className={PaymentComponentStyle.datePickerInput}>
                      <DateTimePicker
                        name="fromSelectedDate"
                        placeholderText="From"
                        showError={true}
                        errorMsg="kkkk"
                        errorMsgClassname="erressage"
                        labelClassname="labeext"
                        formControlClassname={PaymentComponentStyle.DatePickerZindex}
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
              <Controller
                control={control}
                name="toSelectedDate"
                rules={{ required: true }}
                defaultValue={new Date()}
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                  return (
                    <div className={PaymentComponentStyle.datePickerInputRight}>
                      <DateTimePicker
                        name="toSelectedDate"
                        placeholderText="To"
                        showError={true}
                        errorMsg="kkkk"
                        errorMsgClassname="erressage"
                        labelClassname="labeext"
                        formControlClassname={PaymentComponentStyle.DatePickerZindex}
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

          <div className={`col-12 my-2 ${PaymentComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={PaymentComponentStyle.label}>
                {translate?.PayementsTranslate?.payements?.Vendor}
              </label>
            </div>
            <div className={`${PaymentComponentStyle.claimInput} col-9 mx-4`}>
              <Controller
                control={control}
                name="vendorLabels"
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                  <GenericSelect
                    name="vendorLabels"
                    options={vendorLabels}
                    placeholder={"Select Vendor"}
                    formControlClassname={PaymentComponentStyle.selectBoxZindex}
                    isMulti={true}
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

          <div className={`col-12 my-2 ${PaymentComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={PaymentComponentStyle.label}>
                {translate?.PayementsTranslate?.payements?.claimNumber}
              </label>
            </div>
            <div className={`${PaymentComponentStyle.claimInput} col-9 mx-4`}>
              <GenericUseFormInput
                placeholder="Claim Number"
                {...register("claimNumber")}
              />
            </div>
          </div>

          <div className={`col-9 my-2, ${PaymentComponentStyle.showSection}`}>
            <div className={`${PaymentComponentStyle.buttonDiv} col-9 mx-2`}>
              <GenericButton
                type="submit"
                label={translate?.PayementsTranslate?.payements?.Search}
                size="small"
                btnClassname="mx-1"
              />
              <GenericButton
                type="reset"
                label={translate?.PayementsTranslate?.payements?.clearAll}
                size="small"
                onClick={handleReset}
                btnClassname="mx-1"
              />
            </div>
          </div>
        </form>
      </div>
      <div className={`col-8 mx-4 ${PaymentComponentStyle.viewBysection}`}>
        <div className="col-2">
          <GenericButton
            label={translate?.PayementsTranslate?.payements?.viewByClaim}
            onClick={() => handleViewWise("claim")}
            theme="linkBtn"
          />
        </div>
        <div className="col-2">
          <GenericButton
            label={translate?.PayementsTranslate?.payements?.viewByVendor}
            theme="linkBtn"
            onClick={() => handleViewWise("vendor")}
          />
        </div>
      </div>
      <div className={`${PaymentComponentStyle.tableTopsection} col mx-4 mt-2`}></div>
      <div className="col mx-4">
        <PaymentsTableComponent />
      </div>
    </>
  );
};

export default PaymentsComponent;
