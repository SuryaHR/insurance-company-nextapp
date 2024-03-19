import ClaimParticipants from "@/components/_adjuster_components/ClaimParticipants/ClaimParticipants";
import ActivityLog from "@/components/_adjuster_components/ActivityLog/ActivityLog";
import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import PolicyAndCoverageDetails from "@/components/_adjuster_components/PolicyAndCoverageDeatils/PolicyAndCoverageDetails";
import ClaimDetailContentTopButtonsComponent from "../ClaimDetailContentTopButtonsComponent";
import ContentsEvaluationContentTopButtonsComponent from "../ContentsEvaluationContentTopButtonsComponent/ContentsEvaluationContentTopButtonsComponent";
import VendorAssignments from "@/components/_adjuster_components/VendorAssignments/index";
import Documents from "@/components/_adjuster_components/Documents/Documents";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

type propTypes = {
  claimId: string;
};

const ClaimDetailTabsComponent: React.FC<propTypes> = (props: propTypes) => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  const tabsArray = [
    {
      name: translate?.claimDetailsTabTranslate?.tabsComponent?.claimDetail,
      content: <ClaimDetailContentTopButtonsComponent claimId={props.claimId} />,
    },
    {
      name: translate?.claimDetailsTabTranslate?.tabsComponent?.contentsEvaluation,
      content: <ContentsEvaluationContentTopButtonsComponent />,
    },
    {
      name: translate?.claimDetailsTabTranslate?.tabsComponent?.vendorAssignments,
      content: <VendorAssignments />,
    },
    {
      name: translate?.claimDetailsTabTranslate?.tabsComponent?.documents,
      content: <Documents />,
    },
    {
      name: translate?.claimDetailsTabTranslate?.tabsComponent?.claimParticipants,
      content: <ClaimParticipants claimId={props.claimId} />,
    },
    {
      name: translate?.claimDetailsTabTranslate?.tabsComponent?.activityLog,
      content: <ActivityLog />,
    },
    {
      name: translate?.claimDetailsTabTranslate?.tabsComponent?.policyCoverageDetails,
      content: <PolicyAndCoverageDetails />,
    },
  ];

  return <TabsButtonComponent tabData={tabsArray} />;
};
export default ClaimDetailTabsComponent;
