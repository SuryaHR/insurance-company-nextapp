"use client";
// import CustomLoader from "../common/CustomLoader/index";
import GenericBreadcrumb from "../common/GenericBreadcrumb";
import GenericComponentHeading from "../common/GenericComponentHeading/index";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import useTranslation from "@/hooks/useTranslation";

type propsTypes = {
  serviceRequestId: string;
};

const AdjusterAssignServiceRequestComponent: React.FC<propsTypes> = ({
  serviceRequestId,
}) => {
  const { translate }: { translate: claimDetailsTabTranslateType | undefined } =
    useTranslation("claimDetailsTabTranslate");

  const claimId = sessionStorage.getItem("claimId") || "";
  const claimNumber = sessionStorage.getItem("claimNumber") || "";

  const pathList = [
    {
      name: translate?.breadCrumbsHeading?.home,
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
      name: translate?.breadCrumbsHeading?.assignServiceRequest,
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
          title={translate?.breadCrumbsHeading?.serviceRequestedNewConstruction}
        />
      </div>
    </div>
  );
  // return <CustomLoader />;
};
export default AdjusterAssignServiceRequestComponent;
