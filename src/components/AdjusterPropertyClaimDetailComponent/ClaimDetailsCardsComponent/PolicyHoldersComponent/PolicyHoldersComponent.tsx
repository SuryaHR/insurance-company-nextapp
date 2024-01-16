"use client";
import { useState } from "react";
import Cards from "@/components/common/Cards";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import PolicyHolderTasks from "./PolicyHolderTasks";
import Link from "next/link";
import PolicyHolderCradStyle from "./PolicyHolderCard.module.scss";
import Modal from "@/components/common/ModalPopups";
import PolicyCreateTaskModalComponent from "./PolicyCreateTaskModalComponent";
import NewTaskModal from "./NewTaskModal.tsx";
import clsx from "clsx";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import { claimDetailsTranslateType } from "@/translations/claimDetailsTranslate/en";
import useTranslation from "@/hooks/useTranslation";

interface PolicyHoldersComponentType {
  claimId: string;
}

const PolicyHoldersComponent: React.FC<
  connectorType & PolicyHoldersComponentType
> = (props: { pendingTaskList: any; claimId: string }) => {
  const { pendingTaskList, claimId } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const { translate }: { translate: claimDetailsTranslateType | undefined } =
    useTranslation("claimDetailsTranslate");

  const handleOpenTaskModal = () => {
    setOpenTaskModal(!openTaskModal);
  };

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleOpenModal}
        childComp={
          <PolicyCreateTaskModalComponent
            handleOpenModal={handleOpenModal}
            claimId={claimId}
          />
        }
        headingName={translate?.policyHolderTaskCard?.modalHeading}
        overlayClassName={PolicyHolderCradStyle.modalContainer}
        modalWidthClassName={PolicyHolderCradStyle.modalContent}
      />

      <Cards className={PolicyHolderCradStyle.policyHolderCradContainer}>
        <GenericComponentHeading
          title={translate?.policyHolderTaskCard?.policyHolderTask}
        >
          <div className="text-right">
            <Link href="#" onClick={handleOpenModal}>
              {translate?.policyHolderTaskCard?.createNewTask}
            </Link>
          </div>
        </GenericComponentHeading>
        <div className={PolicyHolderCradStyle.taskContentContainer}>
          {pendingTaskList?.length > 0 && (
            <div className={clsx(PolicyHolderCradStyle.formNameContainer, "col-12 p-2")}>
              <div className={clsx(PolicyHolderCradStyle.labelStyle, "col-5")}>
                {translate?.policyHolderTaskCard?.formName}
              </div>
              <div className={clsx(PolicyHolderCradStyle.labelStyle, "col-3")}>
                {translate?.policyHolderTaskCard?.status}
              </div>
              <div className={clsx(PolicyHolderCradStyle.labelStyle, "col-4")}>
                {translate?.policyHolderTaskCard?.assignedDate}
              </div>
            </div>
          )}
          {pendingTaskList?.length > 0 ? (
            pendingTaskList
              ?.slice(0, 5)
              ?.map((pendingTask: any, index: any) => (
                <PolicyHolderTasks
                  pendingTask={pendingTask}
                  key={index}
                  handleOpenTaskModal={handleOpenTaskModal}
                />
              ))
          ) : (
            <NoRecordComponent message={translate?.policyHolderTaskCard?.noTask} />
          )}
          <div>
            <Modal
              isOpen={openTaskModal}
              onClose={handleOpenTaskModal}
              headingName="#4 List of scheduled items lost/damaged"
              childComp={<NewTaskModal handleOpenTaskModal={handleOpenTaskModal} />}
              overlayClassName={PolicyHolderCradStyle.modalContainer}
              modalWidthClassName={PolicyHolderCradStyle.modalContent}
            />
          </div>
        </div>
        <div className="text-right">
          <Link href="/all-tasks">{translate?.policyHolderTaskCard?.viewAll}</Link>
        </div>
      </Cards>
    </>
  );
};
const mapStateToProps = (state: RootState) => ({
  pendingTaskList: state.claimDetail.pendingTaskList,
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(PolicyHoldersComponent);
