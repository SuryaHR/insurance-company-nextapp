import React from "react";
import UploadCsvContainerStyle from "./uploadItemsFromCsvContainer.module.scss";
import UploadItemsFromCsvComponent from "@/components/UploadItemsFromCsvComponent";

function UploadItemsFromCsvContainer() {
  return (
    <div className={UploadCsvContainerStyle.uploadContainer}>
      <div className="container-fluid p-0 pt-3">
        <div className="row m-0">
          <UploadItemsFromCsvComponent />
        </div>
      </div>
    </div>
  );
}

export default UploadItemsFromCsvContainer;
