/* eslint-disable @next/next/no-img-element */
import { downloadFileFromUrl } from "@/utils/utitlity";
import React from "react";

interface AttachementPreviewProps {
  prevSelected: any;
  zoomLevel: any;
}

const AttachementPreview: React.FC<AttachementPreviewProps> = ({
  prevSelected,
  zoomLevel,
}) => {
  function getFileExtension() {
    const extension =
      (prevSelected &&
        prevSelected.name &&
        prevSelected.name.substring(
          prevSelected.name.lastIndexOf(".") + 1,
          prevSelected.name.length
        )) ||
      prevSelected.name;
    return extension;
  }
  return getFileExtension() === "pdf" ? (
    <div
      style={{
        width: "100%",
        height: "400px",
        overflow: "hidden",
      }}
    >
      <iframe
        style={{
          zoom: `${zoomLevel + "%"}`,
          display: "inline-block",
          objectFit: "cover",
          height: "525px",
          aspectRatio: 600 / 600,
        }}
        src={prevSelected?.url}
      />
    </div>
  ) : (
    <div
      style={{
        width: "100%",
        height: "400px",
        // overflow: "auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#333",
          fontWeight: "500",
          display: "none",
        }}
        id="error_div"
      >
        File type does not support preview option. <br />
        File will start downloading..
      </div>
      <img
        style={{
          zoom: `${zoomLevel + "%"}`,
          display: "inline-block",
          objectFit: "cover",
          aspectRatio: 600 / 600,
        }}
        alt="prev-image"
        src={prevSelected.url}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          const errorRef = document.getElementById("error_div");
          if (errorRef) {
            errorRef.style.display = "block";
          }
          downloadFileFromUrl(prevSelected?.url);
        }}
      />
    </div>
  );
};

export default AttachementPreview;
