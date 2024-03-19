"use client";
import TabsButtonComponent from "@/components/common/TabsButtonComponent";
import style from "./index.module.scss";
import Assignments from "./Assignments/Assignments";
import QuoteByAssignments from "./QuoteByAssignments/QuoteByAssignments";
import Invoices from "./Invoices/Invoices";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

const VendorAssignments: React.FC = () => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const tabsArray = [
    {
      name: translate?.vendorAssignmentTranslate?.assignmentTabTitle || "",
      content: <Assignments />,
    },
    {
      name: translate?.vendorAssignmentTranslate?.quoteByAssignmentTabTitle || "",
      content: <QuoteByAssignments />,
    },
    {
      name: translate?.vendorAssignmentTranslate?.invoicesTabTitle || "",
      content: <Invoices />,
    },
  ];

  return (
    <div className={style.vendorCont}>
      <TabsButtonComponent tabData={tabsArray} />
    </div>
  );
};
export default VendorAssignments;
