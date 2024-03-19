"use client";
import GenericBreadcrumb from "../../common/GenericBreadcrumb";
import GenericComponentHeading from "../../common/GenericComponentHeading";
import AllTasksStyle from "./AllTasks.module.scss";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import AllTaskTableComponent from "./AllTaskTableComponent";
import { useEffect, useState } from "react";
import CustomLoader from "../../common/CustomLoader";
import { useDispatch } from "react-redux";
import {
  getClaimParticipantsList,
  getPendingTaskList,
} from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import {
  addParticipants,
  addPendingTasks,
} from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { allTaskTranslatePropType } from "@/app/[lang]/(adjuster)/all-tasks/[claimId]/page";

interface propsTypes {
  claimId: string;
}

const AllTasksComponent: React.FC<propsTypes> = (props) => {
  const { claimId } = props;
  const [claimNumber, setClaimNumber] = useState<unknown>("");
  const [isLoading, setIsLoading] = useState(true);

  const { translate } =
    useContext<TranslateContextData<allTaskTranslatePropType>>(TranslateContext);

  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClaimNumber(window.sessionStorage.getItem("claimNumber"));
    }
    const payload = {
      claimId: claimId,
    };
    const init = async () => {
      setIsLoading(true);
      try {
        const pendingTaskListRes: any = await getPendingTaskList(payload, true);
        const claimParticipantsRes: any = await getClaimParticipantsList(payload, true);

        if (Array.isArray(pendingTaskListRes?.data)) {
          dispatch(addPendingTasks(pendingTaskListRes?.data));
        } else {
          dispatch(addPendingTasks([]));
        }

        if (Array.isArray(claimParticipantsRes?.data)) {
          dispatch(addParticipants(claimParticipantsRes?.data));
        } else {
          dispatch(addParticipants([]));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [claimId, dispatch]);

  const pathList = [
    {
      name: translate?.claimDetailsTabTranslate?.breadCrumbsHeading?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: `${claimNumber}`,
      path: `/adjuster-property-claim-details/${claimId}`,
    },
    {
      name: translate?.claimDetailsTabTranslate?.breadCrumbsHeading?.tasks,
      path: "",
      active: true,
    },
  ];
  if (!isLoading) {
    return (
      <div className="row">
        <div className={AllTasksStyle.stickyContainer}>
          <GenericBreadcrumb dataList={pathList} />
          <GenericComponentHeading
            customHeadingClassname={AllTasksStyle.headingContainer}
            customTitleClassname={AllTasksStyle.headingTxt}
            title={translate?.claimDetailsTabTranslate?.breadCrumbsHeading?.allClaimTasks}
          />
          <AllTaskTableComponent claimId={claimId} />
        </div>
      </div>
    );
  }
  return <CustomLoader />;
};

export default AllTasksComponent;
