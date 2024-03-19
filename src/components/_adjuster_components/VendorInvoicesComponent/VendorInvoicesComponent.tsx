"use client";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import VendorInvoicesComponentStyle from "./VendorInvoicesComponent.module.scss";

import dayjs from "dayjs";
import { any, object, string } from "valibot";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import useCustomForm from "@/hooks/useCustomForm";
import {
  fetchVendorInvoice,
  fetchVendorInvoiceAdjusters,
  fetchVendorInvoiceRegVendors,
  fetchVendorInvoiceStatus,
} from "@/reducers/_adjuster_reducers/VendorInvoicePayments/VendorInvoiceSlice";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

import { InvoiceTranslateProp } from "@/app/[lang]/(adjuster)/(dashboardLayout)/bills-and-payments/page";
import GenericUseFormInput from "@/components/common/GenericInput/GenericUseFormInput";
import GenericSelect from "@/components/common/GenericSelect";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";

import DateTimePicker from "../../common/DateTimePicker/index";
import GenericButton from "../../common/GenericButton";
import InvoiceTableComponent from "./InvoiceTableComponent";

interface FormData {
  [key: string | number]: any;
}

const VendorInvoicesComponent: React.FC = () => {
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
  // useState
  const [statusLabels, setStatusLabels] = useState<Array<any>>();
  const [vendorLabels, setVendorLabels] = useState<Array<any>>();
  const [apiParams, setApiParams] = useState<any>();
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
    (state: any) => state?.vendorInvoiceSlice?.vendorInvoiceStatus
  );
  const vendorList = useAppSelector(
    (state: any) => state?.vendorInvoiceSlice?.vendorInvoiceRegVendors
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
      limit: PAGINATION_LIMIT_20,
      page: 1,
      reportEndDate: dayjs(toSelectedDate ?? "").format("YYYY-MM-DD"),
      reportStartDate: dayjs().startOf("year").format("YYYY-MM-DD"),
      vendor: [],
      ...view,
    };
    dispatch(fetchVendorInvoice(payload));
  }, [dispatch, toSelectedDate, view]);

  // useEffect
  useEffect(() => {
    dispatch(fetchVendorInvoiceStatus(null));
    dispatch(fetchVendorInvoiceAdjusters({ companyId: "1" }));
    dispatch(fetchVendorInvoiceRegVendors(null));
    const payload = {
      claimNumber: "",
      invoicesStatus: [],
      limit: PAGINATION_LIMIT_20,
      page: 1,
      reportEndDate: dayjs(toSelectedDate ?? "").format("YYYY-MM-DD"),
      reportStartDate: dayjs().startOf("year").format("YYYY-MM-DD"),
      vendor: [],
      ...view,
    };
    dispatch(fetchVendorInvoice(payload));
  }, [dispatch, toSelectedDate, view]);

  const handleFromDateChange = (date: React.SetStateAction<null> | Date) => {
    setFromSelectedDate(date);
  };

  const handleToDateChange = (date: React.SetStateAction<null> | Date) => {
    setToSelectedDate(date);
  };

  const onFormSubmit = (data: FormData) => {
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
      ? data.vendorLabels.map((item: any) => item.id)
      : [];
    setApiParams({
      claimNumber: data.claimNumber,
      invoicesStatus: selectedStatusList,
      vendor: selectedVendorList,
    });
    const payload = {
      claimNumber: data.claimNumber,
      invoicesStatus: selectedStatusList,
      limit: PAGINATION_LIMIT_20,
      page: 1,
      reportEndDate: dayjs(toSelectedDate ?? "").format("YYYY-MM-DD"),
      reportStartDate: dayjs(fromSelectedDate ?? "").format("YYYY-MM-DD"),
      vendor: selectedVendorList,
      ...view,
    };

    dispatch(fetchVendorInvoice(payload));
  };

  const fetchOnViewChange = (recvView: string) => {
    let view: any = { isClaimWise: true };
    if (recvView === "vendor") {
      view = { isVendorWise: true };
    }
    const payload = {
      claimNumber: apiParams?.claimNumber,
      invoicesStatus: apiParams?.invoicesStatus,
      limit: PAGINATION_LIMIT_20,
      page: 1,
      reportEndDate: dayjs(toSelectedDate ?? "").format("YYYY-MM-DD"),
      reportStartDate: dayjs(fromSelectedDate ?? "").format("YYYY-MM-DD"),
      vendor: apiParams?.vendor,
      ...view,
    };

    dispatch(fetchVendorInvoice(payload));
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
    fetchOnViewChange(type);
  };
  const { translate } =
    useContext<TranslateContextData<InvoiceTranslateProp>>(TranslateContext);

  return (
    <div className="pb-5">
      <div className={VendorInvoicesComponentStyle.container}>
        <div className="col mx-4 mt-4">
          <span className={VendorInvoicesComponentStyle.headingText}>
            {translate?.InvoiceTranslate?.invoicereport?.invoices}
          </span>
          <hr />
        </div>
      </div>

      <div className={`col mx-4 mt-1 ${VendorInvoicesComponentStyle.filterContainer}`}>
        <div className="col-12 p-3">
          <h4 className={VendorInvoicesComponentStyle.filterText}>
            {translate?.InvoiceTranslate?.invoicereport?.filters}
          </h4>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className={`col-12 my-2 ${VendorInvoicesComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={VendorInvoicesComponentStyle.label}>
                {translate?.InvoiceTranslate?.invoicereport?.Status}
              </label>
            </div>
            <div className={`${VendorInvoicesComponentStyle.claimInput} col-9 mx-4`}>
              <Controller
                control={control}
                name="statusLabels"
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                  <GenericSelect
                    options={statusLabels}
                    placeholder={"Select Status"}
                    formControlClassname={
                      VendorInvoicesComponentStyle.selectStatusBoxZindex
                    }
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

          <div className={`col-12 my-2, ${VendorInvoicesComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={VendorInvoicesComponentStyle.label}>
                {translate?.InvoiceTranslate?.invoicereport?.createdDate}
              </label>
            </div>
            <div className={`${VendorInvoicesComponentStyle.filterBtns} col-9 mx-4`}>
              <Controller
                control={control}
                name="fromSelectedDate"
                rules={{ required: true }}
                defaultValue={new Date()}
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                  return (
                    <div className={VendorInvoicesComponentStyle.datePickerInput}>
                      <DateTimePicker
                        name="fromSelectedDate"
                        placeholderText="From"
                        showError={true}
                        errorMsg="kkkk"
                        errorMsgClassname="erressage"
                        labelClassname="labeext"
                        formControlClassname={
                          VendorInvoicesComponentStyle.DatePickerZindex
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
              <Controller
                control={control}
                name="toSelectedDate"
                rules={{ required: true }}
                defaultValue={new Date()}
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => {
                  return (
                    <div className={VendorInvoicesComponentStyle.datePickerInputRight}>
                      <DateTimePicker
                        name="toSelectedDate"
                        placeholderText="To"
                        showError={true}
                        errorMsg="kkkk"
                        errorMsgClassname="erressage"
                        labelClassname="labeext"
                        formControlClassname={
                          VendorInvoicesComponentStyle.DatePickerZindex
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

          <div className={`col-12 my-2 ${VendorInvoicesComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={VendorInvoicesComponentStyle.label}>
                {translate?.InvoiceTranslate?.invoicereport?.Vendor}
              </label>
            </div>
            <div className={`${VendorInvoicesComponentStyle.claimInput} col-9 mx-4`}>
              <Controller
                control={control}
                name="vendorLabels"
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                  <GenericSelect
                    name="vendorLabels"
                    options={vendorLabels}
                    placeholder={"Select Vendor"}
                    formControlClassname={VendorInvoicesComponentStyle.selectBoxZindex}
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

          <div className={`col-12 my-2 ${VendorInvoicesComponentStyle.showSection}`}>
            <div className="col-3 text-right">
              <label className={VendorInvoicesComponentStyle.label}>
                {translate?.InvoiceTranslate?.invoicereport?.claimNumber}
              </label>
            </div>
            <div className={`${VendorInvoicesComponentStyle.claimInput} col-9 mx-4`}>
              <GenericUseFormInput
                placeholder="Claim Number"
                {...register("claimNumber")}
              />
            </div>
          </div>

          <div className={`col-9 my-2, ${VendorInvoicesComponentStyle.showSection}`}>
            <div className={`${VendorInvoicesComponentStyle.buttonDiv} col-9 mx-2`}>
              <GenericButton
                type="submit"
                label={translate?.InvoiceTranslate?.invoicereport?.Search}
                size="small"
                btnClassname="mx-1"
              />
              <GenericButton
                type="reset"
                label={translate?.InvoiceTranslate?.invoicereport?.clearAll}
                size="small"
                onClick={handleReset}
                btnClassname="mx-1"
              />
            </div>
          </div>
        </form>
      </div>
      <div className={`col-8 mx-4 ${VendorInvoicesComponentStyle.viewBysection}`}>
        <div className="col-2">
          {view.isClaimWise ? (
            <span className={`${VendorInvoicesComponentStyle.selectedLink}`}>
              {translate?.InvoiceTranslate?.invoicereport?.viewByClaim}
            </span>
          ) : (
            <GenericButton
              label={translate?.InvoiceTranslate?.invoicereport?.viewByClaim}
              onClick={() => handleViewWise("claim")}
              theme="linkBtn"
            />
          )}
        </div>
        <div className="col-2">
          {view.isVendorWise ? (
            <span className={`${VendorInvoicesComponentStyle.selectedLink}`}>
              {translate?.InvoiceTranslate?.invoicereport?.viewByVendor}
            </span>
          ) : (
            <GenericButton
              label={translate?.InvoiceTranslate?.invoicereport?.viewByVendor}
              theme="linkBtn"
              onClick={() => handleViewWise("vendor")}
            />
          )}
        </div>
      </div>
      <div
        className={`${VendorInvoicesComponentStyle.tableTopsection} col mx-4 mt-2`}
      ></div>
      <div className="col mx-4">
        <InvoiceTableComponent apiParams={apiParams} view={view} />
      </div>
    </div>
  );
};

export default VendorInvoicesComponent;
