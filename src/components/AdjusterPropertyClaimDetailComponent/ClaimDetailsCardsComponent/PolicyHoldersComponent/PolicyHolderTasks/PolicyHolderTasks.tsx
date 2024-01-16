import clsx from "clsx";
import PolicyHolderTasksStyle from "./PolicyHolderTasks.module.scss";
import { convertToCurrentTimezone } from "@/utils/helper";

interface PolicyHolderTasksProps {
  pendingTask: any;
  handleOpenTaskModal: any;
}

const PolicyHolderTasks = ({
  pendingTask,
  handleOpenTaskModal,
}: PolicyHolderTasksProps) => {
  const dateFormate = "MMM DD YYYY, h:mm A";
  return (
    <>
      <div
        className={clsx(PolicyHolderTasksStyle.Container, "col-12 p-2")}
        onClick={handleOpenTaskModal}
      >
        <div className={clsx(PolicyHolderTasksStyle.labelStyle, "col-5")}>
          {pendingTask?.taskName}
        </div>
        <div className={clsx(PolicyHolderTasksStyle.labelStatus, "col-3")}>
          {pendingTask?.status?.status}
        </div>
        <div className={clsx(PolicyHolderTasksStyle.labelStyle, "col-4")}>
          {convertToCurrentTimezone(pendingTask?.assignedDate, dateFormate)}
        </div>
      </div>
    </>
  );
};

export default PolicyHolderTasks;
