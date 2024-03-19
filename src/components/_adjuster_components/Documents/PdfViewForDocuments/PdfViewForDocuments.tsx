import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import styles from "../documents.module.scss";
import { convertToCurrentTimezone } from "@/utils/helper";
import pdfImg from "@/assets/images/pdf-img.png";
import { CgDanger } from "react-icons/cg";
import {
  exportInvoicePdf,
  exportQuotePdf,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import Image from "next/image";

interface PdfViewForDocumentsProps {
  docData: any;
  removeLoader: () => void;
  addLoader: () => void;
  noDocMessage?: any;
  titleHead: any;
}

const PdfViewForDocuments: React.FC<PdfViewForDocumentsProps> = ({
  docData,
  titleHead,
  noDocMessage,
  addLoader,
  removeLoader,
}) => {
  const [docs, setDocs] = useState<string[]>(docData?.attachments);
  const prevProps = useRef();

  useEffect(() => {
    if (prevProps.current !== docData) {
      setDocs(docData?.attachments);
    }
  }, [docData]);

  const downloadDoc = async (data: any, type: any) => {
    addLoader();
    if (type == "invoice") {
      const content = await exportInvoicePdf({
        claimNumber: sessionStorage.getItem("claimNumber"),
        claimId: sessionStorage.getItem("claimId"),
        id: data?.id,
        invoiceNumber: data?.invoiceNumber,
      });
      const blob = new Blob([content], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice--" + data.invoiceNumber + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const content = await exportQuotePdf({
        profile: "Contents",
        vendorQuoteId: data.quoteId,
      });
      const blob = new Blob([content], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "QUOT-" + sessionStorage.getItem("claimNumber") + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    removeLoader();
  };

  return (
    <>
      <div className={styles.mainDiv}>
        <div className="col-md-12 col-12 mt-3 p-1">
          <div className={clsx("col-12 caption font-gray-sharp", styles.SubHeadingDiv)}>
            <span>{`${titleHead} (${docs?.length})`}</span>
          </div>
        </div>
        <div className={`row ${styles.pdfCont}`}>
          {docs?.length === 0 && (
            <div className={clsx(styles.contentCenter, "row p-3")}>
              <div className={clsx("col-lg-4", styles.noAvailable)}>
                <div className={styles.noDocumentText}>
                  <CgDanger className={styles.danger} />
                  <span className={styles.documentAavailable}>
                    {noDocMessage || "No documents available"}
                  </span>
                </div>
              </div>
            </div>
          )}
          {docs?.map((elem: any, index: number) => {
            const placeHolderImg: any = pdfImg.src;
            return (
              <div className={styles.docListViewCont} key={index}>
                <div>
                  <div>
                    <Image
                      key={index}
                      src={placeHolderImg}
                      alt={`Image ${index}`}
                      className={`${styles.image} ${styles.showImgCls}`}
                      width={90}
                      height={90}
                    />
                  </div>
                  <div>
                    <span className={styles.descCont} title={elem.description}>
                      {elem.description}
                    </span>
                    <a
                      title={elem.name}
                      className={clsx("col", styles.textEllipsis1)}
                      onClick={() => downloadDoc(elem, docData?.type)}
                      key={index}
                    >
                      {docData?.type == "invoice"
                        ? elem?.invoiceNumber
                        : elem?.quoteNumber}
                    </a>
                    <span className={styles.docTimeDate}>
                      {convertToCurrentTimezone(elem.uploadDate, "MMM DD, YYYY h:mm A")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PdfViewForDocuments;
