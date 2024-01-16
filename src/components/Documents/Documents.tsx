import React from "react";
import GenericComponentHeading from "../common/GenericComponentHeading/index";

import document from "./documents.module.scss";
import LineItemDocuments from "./LineItemDocuments";
import AllReceipts from "./AllReceipts";
import InvoiceAttachements from "./InvoiceAttachements";
import Others from "./Others";
import PolicyAndClaimDocument from "./PolicyAndClaimDocument";
import OpenClaimsSearchBox from "../OpenClaimsTableComponent/OpenClaimsSearchBox/OpenClaimsSearchBox";
import useTranslation from "@/hooks/useTranslation";
import { claimDocumentsTranslateType } from "@/translations/claimDocumentsTranslate/en";

export default function Documents() {
  const {
    translate,
    loading,
  }: { translate: claimDocumentsTranslateType | undefined; loading: boolean } =
    useTranslation("claimDocumentsTranslate");
  console.log("transalte", translate);
  if (loading) {
    return null;
  }

  return (
    <div className={document.mainDiv}>
      <div>
        <div className={document.search}>
          <OpenClaimsSearchBox setTableLoader={() => {}} />
        </div>
        <GenericComponentHeading
          title={translate?.claimHeading ?? ""}
          customHeadingClassname={document.headingLine}
          customTitleClassname={document.heading}
        />
      </div>
      <div>
        <PolicyAndClaimDocument />
      </div>

      <div>
        <LineItemDocuments />
      </div>
      <div>
        <AllReceipts />
      </div>
      <div>
        <InvoiceAttachements />
      </div>
      <div>
        <Others />
      </div>
    </div>
  );
}
