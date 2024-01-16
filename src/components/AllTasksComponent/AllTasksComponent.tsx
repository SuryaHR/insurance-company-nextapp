"use client";
import GenericBreadcrumb from "../common/GenericBreadcrumb";
import GenericComponentHeading from "../common/GenericComponentHeading";
import AllTasksStyle from "./AllTasks.module.scss";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";
import useTranslation from "@/hooks/useTranslation";

const AllTasksComponent: React.FC = () => {
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
      name: translate?.breadCrumbsHeading?.tasks,
      path: "",
      active: true,
    },
  ];

  return (
    <div className="row">
      <div className={AllTasksStyle.stickyContainer}>
        <GenericBreadcrumb dataList={pathList} />
        <GenericComponentHeading
          customHeadingClassname={AllTasksStyle.headingContainer}
          customTitleClassname={AllTasksStyle.headingTxt}
          title={translate?.breadCrumbsHeading?.allClaimTasks}
        />
      </div>
    </div>
  );
};

export default AllTasksComponent;
