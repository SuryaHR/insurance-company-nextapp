"use client";
import GenericBreadcrumb from "../common/GenericBreadcrumb";
import GenericComponentHeading from "../common/GenericComponentHeading";
import AllNotesStyle from "./AllNotes.module.scss";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import useTranslation from "@/hooks/useTranslation";

const AllNotesComponent: React.FC = () => {
  const { translate }: { translate: claimDetailsTabTranslateType | undefined } =
    useTranslation("claimDetailsTabTranslate");

  const pathList = [
    {
      name: translate?.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
      // active: true,
    },
    {
      name: "055CLM5122023Avi",
      path: "",
      active: true,
    },
    {
      name: translate?.breadCrumbsHeading?.message,
      path: "",
      active: true,
    },
  ];

  return (
    <div className="row">
      <div className={AllNotesStyle.stickyContainer}>
        <GenericBreadcrumb dataList={pathList} />
        <GenericComponentHeading
          customHeadingClassname={AllNotesStyle.headingContainer}
          customTitleClassname={AllNotesStyle.headingTxt}
          title={translate?.breadCrumbsHeading?.allClaimMessages}
        />
      </div>
    </div>
  );
};

export default AllNotesComponent;
