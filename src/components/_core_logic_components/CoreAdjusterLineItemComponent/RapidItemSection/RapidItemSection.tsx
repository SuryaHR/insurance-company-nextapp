import React from "react";
import rapidItemSectionStyle from "./rapidItemSection.module.scss";
import OriginalItemRapidSection from "./OriginalItemRapidSection";
import ReplacementItemRapidSection from "./ReplacementItemRapidSection";

function RapidItemSection() {
  return (
    <div className={rapidItemSectionStyle.root}>
      <OriginalItemRapidSection />
      <ReplacementItemRapidSection />
    </div>
  );
}

export default RapidItemSection;
