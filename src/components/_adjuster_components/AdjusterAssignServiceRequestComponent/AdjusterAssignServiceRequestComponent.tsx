"use client";
import { breadCrumbTranslateProp } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-assign-service-request/[serviceRequestId]/page";

import GenericBreadcrumb from "../../common/GenericBreadcrumb";
import GenericComponentHeading from "../../common/GenericComponentHeading/index";

import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

import { useContext } from "react";

type propsTypes = {
  serviceRequestId: string;
};

const AdjusterAssignServiceRequestComponent: React.FC<propsTypes> = ({
  serviceRequestId,
}) => {
  const { translate } =
    useContext<TranslateContextData<breadCrumbTranslateProp>>(TranslateContext);
  const claimId = sessionStorage.getItem("claimId") || "";
  const claimNumber = sessionStorage.getItem("claimNumber") || "";

  const pathList = [
    {
      name: translate?.breadCrumbTranslate?.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
      // active: true,
    },
    {
      name: claimNumber,
      path: `/adjuster-property-claim-details/${claimId}`,
    },

    {
      name: serviceRequestId,
      path: "/adjuster-service-request-edit",
    },

    {
      name: translate?.breadCrumbTranslate?.breadCrumbsHeading?.assignServiceRequest,
      path: `/adjuster-assign-service-request/${serviceRequestId}`,
      active: true,
    },
  ];

  return (
    <div className="row">
      <GenericBreadcrumb dataList={pathList} />
      <div className="p-3">
        <GenericComponentHeading
          customTitleClassname="mt-2"
          title={
            translate?.breadCrumbTranslate?.breadCrumbsHeading
              ?.serviceRequestedNewConstruction
          }
        />
      </div>
    </div>
  );
  // return <CustomLoader />;
};
export default AdjusterAssignServiceRequestComponent;
