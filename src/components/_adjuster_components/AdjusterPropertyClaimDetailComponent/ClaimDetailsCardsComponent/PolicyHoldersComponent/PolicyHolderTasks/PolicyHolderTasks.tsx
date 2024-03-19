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
        className={`${PolicyHolderTasksStyle.Container} col-12 p-2`}
        onClick={handleOpenTaskModal}
      >
        <div className={`${PolicyHolderTasksStyle.labelStyle} col-5`}>
          {pendingTask?.taskName}
        </div>
        <div className={`${PolicyHolderTasksStyle.labelStatus} col-3`}>
          {pendingTask?.status?.status}
        </div>
        <div className={`${PolicyHolderTasksStyle.labelStyle} col-4`}>
          {convertToCurrentTimezone(pendingTask?.assignedDate, dateFormate)}
        </div>
      </div>
    </>
  );
};

export default PolicyHolderTasks;
