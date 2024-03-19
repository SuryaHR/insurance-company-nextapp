import React, { useState } from "react";
import AttachementPreview from "./AttachementPreview";
import ImagePreviewModal from "./ImagePreviewModal";

function PreviewMedia(props) {
  const { isOpen, onClose, prevSelected, imagePreviewType, showDelete } = props;

  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 5);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel - 5);
  };

  const handleZoomMid = () => {
    setZoomLevel(100);
  };

  return (
    <div>
      <ImagePreviewModal
        isOpen={isOpen}
        onClose={onClose}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleZoomMid={handleZoomMid}
        prevSelected={prevSelected}
        showDelete={showDelete}
        childComp={
          <AttachementPreview
            prevSelected={prevSelected}
            imgType={imagePreviewType}
            zoomLevel={zoomLevel}
          />
        }
        modalClassName={true}
        headingName={prevSelected?.name || "Image preview model"}
      />
    </div>
  );
}

export default PreviewMedia;
