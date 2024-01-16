"use client";
import React from "react";
import NewClaimWizardStyle from "./newClaimWizardFormArrow.module.scss";
interface NewClaimWizardFormArrowProps {
  activeSection: number;
  handleSectionClick: (index: number) => void;
}

const NewClaimWizardFormArrow: React.FC<NewClaimWizardFormArrowProps> = ({
  activeSection,
  handleSectionClick,
}) => {
  const sectionsTabs = [
    {
      name: "1) Claim and Policy Information",
      color:
        activeSection === 0
          ? NewClaimWizardStyle.orange
          : activeSection > 0
          ? NewClaimWizardStyle.green
          : NewClaimWizardStyle.grey,
    },
    {
      name: "2) Add Items",
      color:
        activeSection === 1
          ? NewClaimWizardStyle.orange
          : activeSection > 1
          ? NewClaimWizardStyle.green
          : NewClaimWizardStyle.grey,
    },
    {
      name: "3) Assign Items",
      color:
        activeSection === 2
          ? NewClaimWizardStyle.orange
          : activeSection > 2
          ? NewClaimWizardStyle.green
          : NewClaimWizardStyle.grey,
    },
  ];

  return (
    <>
      <div className={`container ${NewClaimWizardStyle.tabsAllStyle}`}>
        {sectionsTabs.map((sectionsTabs, index) => (
          <div
            key={index}
            className={`col-12 col-sm-6 col-md-4 col-lg-3 ${NewClaimWizardStyle.arrowContainer} ${sectionsTabs.color}`}
            onClick={() => handleSectionClick(index)}
          >
            <span className={NewClaimWizardStyle.tabText}>{sectionsTabs.name}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default NewClaimWizardFormArrow;
