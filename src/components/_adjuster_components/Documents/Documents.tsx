import React, { useCallback, useEffect, useState } from "react";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import {
  getDocumentsDetails,
  getQuoteByAssData,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import document from "./documents.module.scss";
import DocumentSearch from "./DocumentSearch/DocumentSearch";
import CustomLoader from "@/components/common/CustomLoader";
import { ConnectedProps, connect } from "react-redux";
import DocumentList from "./DocumentList/DocumentList";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import PdfViewForDocuments from "./PdfViewForDocuments/PdfViewForDocuments";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";

const Documents: React.FC<connectorType> = ({ searchDocumentKeyword }) => {
  const docPage: number = 1;
  const docLimit: number = 14;
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [docDetails, setDocDetails] = useState<any>({});
  const [totalDocCount, setTotalDocCount] = useState<number>(0);

  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);
  const newDocumentObj: object = {
    totalAttachments: 0,
    attachments: [],
  };

  const init = useCallback(async () => {
    try {
      setIsLoader(true);

      const claimNumber = sessionStorage.getItem("claimNumber");
      const payload = {
        claimNumber,
        page: docPage,
        limit: docLimit,
        type: "All",
        keyword: searchDocumentKeyword,
      };

      const [res, ListRes] = await Promise.all([
        getDocumentsDetails(payload),
        getQuoteByAssData(),
      ]);

      if (res?.status === 200 && ListRes.status === 200) {
        const {
          claimAttachments,
          claimItemsAttachments,
          receiptAttachments,
          invoiceAttachments,
          otherAttachments,
          invoiceDTOS: originalInvoiceDTOS,
        } = res.data;

        const invoiceDTOS = {
          attachments: originalInvoiceDTOS,
          totalAttachments: originalInvoiceDTOS?.length || 0,
          type: "invoice",
        };

        const quoteAttachments = {
          attachments: ListRes?.data,
          totalAttachments: ListRes?.data?.length || 0,
          type: "quote",
        };

        const attachmentArrays = [
          claimAttachments,
          claimItemsAttachments,
          receiptAttachments,
          invoiceAttachments,
          otherAttachments,
          quoteAttachments,
          invoiceDTOS,
        ];

        res.data["invoiceDTOS"] = invoiceDTOS;
        res.data["quoteAttachments"] = quoteAttachments;

        const totalDocLength = attachmentArrays.reduce((total, attachment) => {
          return total + (attachment?.attachments?.length || 0);
        }, 0);

        setDocDetails(res.data);
        setTotalDocCount(totalDocLength);
      } else {
        console.error("Failed to fetch document details:", res.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoader(false);
    }
  }, [docLimit, docPage, searchDocumentKeyword]);

  useEffect(() => {
    init();
  }, [searchDocumentKeyword, init]);

  const addLoader = () => {
    setIsLoader(true);
  };

  const removeLoader = () => {
    setIsLoader(false);
  };

  console.log("docDetails===>", docDetails);

  return (
    <div className={document.mainDiv}>
      {isLoader && <CustomLoader loaderType="spinner1" />}
      <div>
        <div className={document.search}>
          <DocumentSearch setTableLoader={() => {}} />
        </div>
        <GenericComponentHeading
          title={
            translate?.claimDocumentsTranslate?.document?.claimHeading +
            `(${totalDocCount})`
          }
          customHeadingClassname={document.headingLine}
          customTitleClassname={document.heading}
        />
      </div>
      <div>
        <DocumentList
          init={init}
          addLoader={addLoader}
          removeLoader={removeLoader}
          docData={
            docDetails?.claimAttachments ? docDetails?.claimAttachments : newDocumentObj
          }
          filePurpose="CLAIM"
          titleHead={translate?.claimDocumentsTranslate?.document?.policyClaimDocuments}
          translate={translate}
        />
      </div>

      <div>
        <DocumentList
          init={init}
          addLoader={addLoader}
          removeLoader={removeLoader}
          docData={
            docDetails?.claimItemsAttachments
              ? docDetails?.claimItemsAttachments
              : newDocumentObj
          }
          filePurpose="CLAIM_ITEM"
          titleHead={translate?.claimDocumentsTranslate?.document?.lineItemDocumnet}
          translate={translate}
        />
      </div>
      <div>
        <DocumentList
          init={init}
          addLoader={addLoader}
          removeLoader={removeLoader}
          docData={
            docDetails?.receiptAttachments
              ? docDetails?.receiptAttachments
              : newDocumentObj
          }
          filePurpose="CLAIM_RECEIPT"
          titleHead={translate?.claimDocumentsTranslate?.document?.allReceipts}
          noDocMessage={translate?.claimDocumentsTranslate?.document?.noDocumentAvailable}
          allowOnlyDocType=".pdf"
          translate={translate}
        />
      </div>

      {docDetails?.invoiceDTOS?.attachments && (
        <div>
          <PdfViewForDocuments
            addLoader={addLoader}
            removeLoader={removeLoader}
            docData={docDetails?.invoiceDTOS}
            titleHead="Invoices"
          />
        </div>
      )}
      {docDetails?.quoteAttachments?.attachments?.length > 0 && (
        <div>
          <PdfViewForDocuments
            addLoader={addLoader}
            removeLoader={removeLoader}
            docData={docDetails?.quoteAttachments}
            titleHead="Replacement Quotes"
          />
        </div>
      )}
      <div>
        <DocumentList
          init={init}
          addLoader={addLoader}
          removeLoader={removeLoader}
          docData={
            docDetails?.invoiceAttachments
              ? docDetails?.invoiceAttachments
              : newDocumentObj
          }
          filePurpose="CLAIM_INVOICE"
          titleHead={translate?.claimDocumentsTranslate?.document?.invoicesAttachements}
          translate={translate}
        />
      </div>
      <div>
        <DocumentList
          init={init}
          addLoader={addLoader}
          removeLoader={removeLoader}
          docData={
            docDetails?.otherAttachments ? docDetails?.otherAttachments : newDocumentObj
          }
          filePurpose="CLAIM_OTHER"
          titleHead={translate?.claimDocumentsTranslate?.document?.others}
          translate={translate}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ claimdata }: any) => ({
  searchDocumentKeyword: claimdata.searchDocumentKeyword,
});

const connector = connect(mapStateToProps, {});
type connectorType = ConnectedProps<typeof connector>;
export default connector(Documents);
