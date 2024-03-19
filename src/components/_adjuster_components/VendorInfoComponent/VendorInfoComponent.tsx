"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./vendorInfoStyle.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { useParams } from "next/navigation";
import { getVendorDetail } from "@/services/_adjuster_services/globalSearchService";
import CustomLoader from "@/components/common/CustomLoader";
import { unknownObjectType } from "@/constants/customTypes";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { vendorInfoPropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/vendor-info/[id]/page";

function VendorInfoComponent() {
  const param = useParams();
  const { translate } =
    useContext<TranslateContextData<vendorInfoPropType>>(TranslateContext);
  const [data, setData] = useState<unknownObjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = param;

  const fetchVendorDetail = useCallback(async () => {
    try {
      const res = await getVendorDetail({ id: +id });
      if (res?.data) {
        setData(res?.data);
        setLoading(false);
      }
    } catch (error) {
      setData(null);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendorDetail();
  }, [fetchVendorDetail]);

  const RowDetail = ({ labelText, desc }: { labelText: string; desc: string }) => {
    return (
      <>
        <label htmlFor="" className={`col-md-2 col-sm-2 ${styles.label}`}>
          {labelText}
        </label>
        <div className="col-md-3 col-sm-4">{desc}</div>
      </>
    );
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className={styles.root}>
      <GenericComponentHeading
        title={translate?.vendorInfoTranslate?.heading}
        customTitleClassname={styles.heading}
      />
      <div className={`row ${styles.detailsWrapper}`}>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.detail?.vendorName}
            desc={data?.vendorCompanyName ?? ""}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.detail?.companyWeb}
            desc={data?.website ?? ""}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.detail?.officeAddress}
            desc={`${data?.shippingAddressData?.streetAddressOne} ${data?.shippingAddressData?.streetAddressTwo} ${data?.shippingAddressData?.city} ${data?.shippingAddressData?.state?.stateName} ${data?.shippingAddressData?.zipcode}`}
          />
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.detail?.billingAddress}
            desc={`${data?.billingAddressData?.streetAddressOne} ${data?.billingAddressData?.streetAddressTwo} ${data?.billingAddressData?.city} ${data?.billingAddressData?.state?.stateName} ${data?.billingAddressData?.zipcode}`}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.detail?.phone}
            desc={data?.phoneNumber}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.detail?.fax}
            desc={data?.faxNumber ?? translate?.vendorInfoTranslate?.notAvailable}
          />
        </div>
      </div>
      <GenericComponentHeading title={translate?.vendorInfoTranslate?.subHeading} />
      <div className={`row ${styles.detailsWrapper}`}>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.contact?.firstName}
            desc={data?.contactPersons[0]?.firstName ?? "-"}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.contact?.lastName}
            desc={data?.contactPersons[0]?.lastName ?? "-"}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.contact?.email}
            desc={data?.contactPersons[0]?.email ?? "-"}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.contact?.fax}
            desc={data?.contactPersons[0]?.faxNumber ?? "-"}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.contact?.phoneWork}
            desc={data?.contactPersons[0]?.workPhoneNumber ?? "-"}
          />
        </div>
        <div className="col-md-12 col-sm-12 row">
          <RowDetail
            labelText={translate?.vendorInfoTranslate?.contact?.phoneMobile}
            desc={data?.contactPersons[0]?.mobilePhoneNumber ?? "-"}
          />
        </div>
      </div>
    </div>
  );
}

export default VendorInfoComponent;
