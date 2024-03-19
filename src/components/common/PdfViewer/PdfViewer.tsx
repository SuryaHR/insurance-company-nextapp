"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import clsx from "clsx";

import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";

import pdfViewerStyle from "./pdfViewer.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface propTypes {
  [key: string | number]: any;
}

const PdfViewer: React.FC<propTypes> = (props) => {
  const {
    fileUrl,
    handlePointClick = "",
    scale = 1,
    pdfCustomClassname = "",
    pageNumber = 1,
    setPageNumber = null,
  } = props;
  const [numPages, setNumPages] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <>
      <div className={pdfViewerStyle.pageNumberDiv}>
        <div onClick={handlePrevPage}>
          <BiSolidLeftArrow />
        </div>
        <div>
          {" "}
          Page ({pageNumber}/{numPages})
        </div>
        <div onClick={handleNextPage}>
          <BiSolidRightArrow />
        </div>
      </div>

      <div
        className={clsx({
          [pdfViewerStyle.pdfPages]: true,
          [pdfCustomClassname]: pdfCustomClassname,
        })}
      >
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} onClick={handlePointClick} />
        </Document>
      </div>
    </>
  );
};
export default PdfViewer;
