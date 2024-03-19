import { vendorInfoPropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/vendor-info/[id]/page";
import VendorInfoComponent from "@/components/_adjuster_components/VendorInfoComponent";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb";
import React from "react";

function VendorInfoContainer({ translate }: { translate: vendorInfoPropType }) {
  const pathList = [
    {
      name: translate?.breadCrumbTranslate?.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: translate?.breadCrumbTranslate?.breadCrumbsHeading?.searchResult,
      path: "/adjuster-global-search",
    },
    {
      name: translate?.breadCrumbTranslate?.breadCrumbsHeading?.vendorDetail,
      path: "",
      active: true,
    },
  ];
  return (
    <div className="row">
      <GenericBreadcrumb dataList={pathList} />
      <VendorInfoComponent />
    </div>
  );
}

export default VendorInfoContainer;
