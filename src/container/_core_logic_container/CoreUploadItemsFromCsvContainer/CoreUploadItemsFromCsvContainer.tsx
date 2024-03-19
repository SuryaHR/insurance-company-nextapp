import React from "react";
import UploadCsvContainerStyle from "./uploadItemsFromCsvContainer.module.scss";
import CoreUploadItemsFromCsvComponent from "@/components/_core_logic_components/CoreUploadItemsFromCsvComponent/CoreUploadItemsFromCsvComponent";

const CoreUploadItemsFromCsvContainer = () => {
  return (
    <div className={UploadCsvContainerStyle.uploadContainer}>
      <div className="container-fluid p-0 pt-3">
        <div className="row m-0">
          <CoreUploadItemsFromCsvComponent />
        </div>
      </div>
    </div>
  );
};

export default CoreUploadItemsFromCsvContainer;
