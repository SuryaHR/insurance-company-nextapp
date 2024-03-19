"use client";
import { breadCrumbTranslateProp } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-assign-service-request/[serviceRequestId]/page";

import GenericBreadcrumb from "../../common/GenericBreadcrumb";
import GenericComponentHeading from "../../common/GenericComponentHeading/index";

import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { useContext } from "react";

type propsTypes = {
  claimId: string;
};

const AdjusterServiceRequest: React.FC<propsTypes> = ({ claimId }) => {
  const claimNumber = sessionStorage.getItem("claimNumber") || "claimNumber";

  const { translate } =
    useContext<TranslateContextData<breadCrumbTranslateProp>>(TranslateContext);
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
      name: translate?.breadCrumbTranslate?.breadCrumbsHeading?.newServiceRequest,
      path: "",
      active: true,
    },
  ];

  return (
    <div className="row">
      <GenericBreadcrumb dataList={pathList} />
      <div className="p-3">
        <GenericComponentHeading
          customTitleClassname="mt-2"
          title={translate?.breadCrumbTranslate?.breadCrumbsHeading?.newServiceRequest}
        />
      </div>
    </div>
  );
  // return <CustomLoader />;
};
export default AdjusterServiceRequest;
