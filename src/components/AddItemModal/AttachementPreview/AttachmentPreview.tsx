import React from "react";

interface AttachementPreviewProps {
  url: string;
  imgType: string;
  zoomLevel: any;
}

const AttachementPreview: React.FC<AttachementPreviewProps> = ({
  url,
  imgType,
  zoomLevel,
}) => {
  console.log(imgType, "imagePreviewUrl");

  return imgType === "pdf" ? (
    <div
      style={{
        width: "100%",
        height: "300px",
        overflow: "hidden",
      }}
    >
      <iframe
        style={{
          zoom: `${zoomLevel + "%"}`,
          display: "inline-block",
          objectFit: "cover",
          height: "400px",
          aspectRatio: 600 / 600,
        }}
        src={url}
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
      <img
        style={{
          zoom: `${zoomLevel + "%"}`,
          display: "inline-block",
          objectFit: "cover",
          height: "400px",
          aspectRatio: 600 / 600,
        }}
        src={url}
      />
    </div>
  );
};

export default AttachementPreview;
