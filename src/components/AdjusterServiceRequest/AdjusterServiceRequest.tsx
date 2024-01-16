"use client";
// import CustomLoader from "../common/CustomLoader/index";
import GenericBreadcrumb from "../common/GenericBreadcrumb";
import GenericComponentHeading from "../common/GenericComponentHeading/index";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import useTranslation from "@/hooks/useTranslation";

type propsTypes = {
  claimId: string;
};

const AdjusterServiceRequest: React.FC<propsTypes> = ({ claimId }) => {
  const claimNumber = sessionStorage.getItem("claimNumber") || "claimNumber";

  const { translate }: { translate: claimDetailsTabTranslateType | undefined } =
    useTranslation("claimDetailsTabTranslate");

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
      name: translate?.breadCrumbsHeading?.newServiceRequest,
      path: "/adjuster-service-request",
      active: true,
    },
  ];

  return (
    <div className="row">
      <GenericBreadcrumb dataList={pathList} />
      <div className="p-3">
        <GenericComponentHeading
          customTitleClassname="mt-2"
          title={translate?.breadCrumbsHeading?.newServiceRequest}
        />
      </div>
    </div>
  );
  // return <CustomLoader />;
};
export default AdjusterServiceRequest;
