"use client";
import React, { useEffect, useMemo, useState } from "react";

import VendorInvoiceDetailsStyle from "./VendorInvoiceDetails.module.scss";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import { fetchVendorInvoiceLineItem } from "@/reducers/_adjuster_reducers/VendorInvoicePayments/VendorInvoiceSlice";

import { getUSDCurrency } from "@/utils/utitlity";

import CustomLoader from "../../common/CustomLoader/index";
import GenericButton from "../../common/GenericButton/index";
import LinesTable from "./LinesTable/LinesTable";
import { dataMapping } from "./VendorInvoiceData";

interface ContentLayoutProps {
  label: string;
  value: string | JSX.Element | any;
}

const ContentLayout1: React.FC<ContentLayoutProps> = ({
  label,
  value,
}: ContentLayoutProps) => {
  return (
    <div className="row my-2 gap-5">
      <label className={`col control-label ${VendorInvoiceDetailsStyle.labelStyle}`}>
        {label}
      </label>
      <span
        className={` col control-label ${
          label === "Customer's Name" || label === "Insurance Company"
            ? `${VendorInvoiceDetailsStyle.textStyle}  ${VendorInvoiceDetailsStyle.fw600}`
            : VendorInvoiceDetailsStyle.textStyle
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const ContentLayoutInput: React.FC<ContentLayoutProps> = ({
  label,
  value,
}: ContentLayoutProps) => {
  return (
    <div className="row my-2 gap-2">
      <label className={`col control-label ${VendorInvoiceDetailsStyle.labelStyle}`}>
        {label}
      </label>
      {value ? (
        <input
          className="col control-label mx-4"
          disabled={true}
          type="text"
          value={getUSDCurrency(value)}
        />
      ) : (
        ""
      )}
    </div>
  );
};

const ContentLayout2: React.FC<ContentLayoutProps> = ({
  label,
  value,
}: ContentLayoutProps) => {
  return (
    <div className="row my-2 gap-5">
      {label === "Vendor Company" && (
        <div
          className={`col-2 col-sm-2 col-lg-3 ${VendorInvoiceDetailsStyle.labelStyle}`}
        >
          From
        </div>
      )}
      {label === "Insurance Company" && (
        <div
          className={`col-2 col-sm-2 col-lg-3 ${VendorInvoiceDetailsStyle.labelStyle}`}
        >
          To
        </div>
      )}
      {label !== "Vendor Company" && label !== "Insurance Company" && (
        <div className="col-2 col-sm-2 col-lg-3"></div>
      )}
      <label className={`col control-label ${VendorInvoiceDetailsStyle.labelStyle}`}>
        {label}
      </label>
      <span
        className={` col control-label ${
          label === "Customer's Name" || label === "Insurance Company"
            ? `${VendorInvoiceDetailsStyle.textStyle}  ${VendorInvoiceDetailsStyle.fw600}`
            : VendorInvoiceDetailsStyle.textStyle
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const VendorInvoiceDetailsComponent: React.FC = () => {
  const [apiData, setAPIData] = useState<any>(null);

  const handleCloseClaim = () => {};

  const handleDeleteClaim = () => {};
  const buttonsArray = [
    {
      label: "Supervisor Review",
      clickHandler: null,
    },
    {
      label: "Void",
      clickHandler: null,
    },
    {
      label: "Pay",
      clickHandler: handleCloseClaim,
    },
    {
      label: "Download as PDF",
      clickHandler: handleDeleteClaim,
    },
  ];
  const dispatch = useAppDispatch();

  const invoiceNumber = useAppSelector(
    ({ vendorInvoiceSlice }: any) => vendorInvoiceSlice?.invoiceNumber
  );
  const vendorInvoiceLineItemfetching = useAppSelector(
    ({ vendorInvoiceSlice }: any) => vendorInvoiceSlice?.vendorInvoiceLineItemfetching
  );
  const vendorInvoiceLineItem = useAppSelector(
    ({ vendorInvoiceSlice }: any) => vendorInvoiceSlice?.vendorInvoiceLineItem
  );

  useEffect(() => {
    const recvinvoiceNumber = invoiceNumber || localStorage.getItem("invoiceNumber");
    dispatch(fetchVendorInvoiceLineItem({ invoiceNumber: recvinvoiceNumber }));
  }, [dispatch, invoiceNumber]);

  useMemo(() => {
    const mappedData = dataMapping(vendorInvoiceLineItem);
    setAPIData({
      ...mappedData,
    });
  }, [vendorInvoiceLineItem]);

  const buttons =
    buttonsArray &&
    buttonsArray.map((buttonObj, i) => {
      return (
        <div key={i}>
          <GenericButton
            label={buttonObj.label}
            onClickHandler={buttonObj && buttonObj?.clickHandler}
            size="small"
          />
        </div>
      );
    });

  if (vendorInvoiceLineItemfetching) return <CustomLoader />;

  return (
    <div className={VendorInvoiceDetailsStyle.invoiceDetailContainer}>
      <span className={VendorInvoiceDetailsStyle.title}>
        Invoice# {invoiceNumber || localStorage.getItem("invoiceNumber")}
      </span>
      <hr className={VendorInvoiceDetailsStyle.hrLine} />
      <div className={VendorInvoiceDetailsStyle.buttonRowContainer}>{buttons}</div>
      <div className={`container ${VendorInvoiceDetailsStyle.infoContainer}`}>
        <div className={`row ${VendorInvoiceDetailsStyle.row}`}>
          <div className="col-md-6">
            <div>
              <>
                {apiData &&
                  Object.entries(apiData?.TopLeft).map(([key, value]) => (
                    <ContentLayout1 key={key} label={key} value={value} />
                  ))}
              </>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <>
                {apiData &&
                  Object.entries(apiData?.TopRight).map(([key, value]) => (
                    <div key={key}>
                      <ContentLayout2 key={key} label={key} value={value} />
                    </div>
                  ))}
              </>
            </div>
          </div>
        </div>
      </div>
      <hr className={VendorInvoiceDetailsStyle.hrLine2} />
      <span>Lines</span>
      <hr className={VendorInvoiceDetailsStyle.hrLine} />
      <div className="row">
        <div className="col-md-12 my-2 p-0">
          {vendorInvoiceLineItem && (
            <LinesTable data={vendorInvoiceLineItem?.invoiceItems} />
          )}
        </div>
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-sm-12 col-lg-6">
                <div className="row">
                  {apiData &&
                    Object.entries(apiData?.BottomLeft).map(([key, value]) => (
                      <ContentLayout1 key={key} label={key} value={value} />
                    ))}
                </div>
              </div>
              <div className="col">
                <div className="row">
                  {apiData &&
                    Object.entries(apiData?.BottomRight).map(([key, value]) => (
                      <ContentLayoutInput key={key} label={key} value={value} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className={VendorInvoiceDetailsStyle.hrLine} />
      <div className={`${VendorInvoiceDetailsStyle.buttonRowContainer}`}>{buttons}</div>
    </div>
  );
};

export default VendorInvoiceDetailsComponent;
