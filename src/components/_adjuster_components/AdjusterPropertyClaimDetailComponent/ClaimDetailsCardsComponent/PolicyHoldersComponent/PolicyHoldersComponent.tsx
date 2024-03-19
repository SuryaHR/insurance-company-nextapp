"use client";
import { useContext, useState } from "react";
import Cards from "@/components/common/Cards";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import PolicyHolderTasks from "./PolicyHolderTasks";
import Link from "next/link";
import PolicyHolderCradStyle from "./PolicyHolderCard.module.scss";
import Modal from "@/components/common/ModalPopups";
import CreatePolicyHolderTaskModalComponent from "@/components/common/CreatePolicyHolderTaskModalComponent";
import PolicyHolderTaskDetailsModal from "@/components/common/PolicyHolderTaskDetailsModal";
import clsx from "clsx";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import GenericButton from "@/components/common/GenericButton";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import selectPolicyHolderTypeParticipant from "@/reducers/_adjuster_reducers/CommonData/Selectors/selectPolicyHolderTypeParticipant";

interface PolicyHoldersComponentType {
  claimId: string;
}

const PolicyHoldersComponent: React.FC<
  connectorType & PolicyHoldersComponentType
> = (props: { pendingTaskList: any; claimId: string; policyHolderUser: any }) => {
  const { pendingTaskList, claimId, policyHolderUser } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [showErrorCreateNewTask, setShowErrorCreateNewTask] = useState(false);

  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const handleOpenTaskModal = () => {
    setOpenTaskModal(!openTaskModal);
    !openTaskModal && setSelectedRow([]);
  };
  console.log("selectedRow", selectedRow);

  const handleOpenModal = () => {
    if (policyHolderUser && policyHolderUser !== null) {
      setIsOpen(!isOpen);
    } else {
      setShowErrorCreateNewTask(true);
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleOpenModal}
        childComp={
          <CreatePolicyHolderTaskModalComponent
            handleOpenModal={handleOpenModal}
            claimId={claimId}
          />
        }
        headingName={
          translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.modalHeading
        }
        overlayClassName={PolicyHolderCradStyle.modalContainer}
        modalWidthClassName={PolicyHolderCradStyle.modalContent}
      />

      <Cards className={PolicyHolderCradStyle.policyHolderCradContainer}>
        <GenericComponentHeading
          title={
            translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.policyHolderTask
          }
        >
          <div className="text-right">
            <GenericButton
              btnClassname={PolicyHolderCradStyle.linkBtnStyle}
              theme="linkBtn"
              label={
                translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.createNewTask
              }
              onClickHandler={handleOpenModal}
            />
          </div>
        </GenericComponentHeading>
        <div className={PolicyHolderCradStyle.taskContentContainer}>
          {showErrorCreateNewTask && (
            <div>
              <NoRecordComponent
                message={
                  translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.errorMessage
                }
              />
            </div>
          )}
          {pendingTaskList?.length > 0 && (
            <div className={clsx(PolicyHolderCradStyle.formNameContainer, "col-12 p-2")}>
              <div className={clsx(PolicyHolderCradStyle.labelStyle, "col-5")}>
                {translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.formName}
              </div>
              <div className={clsx(PolicyHolderCradStyle.labelStyle, "col-3")}>
                {translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.status}
              </div>
              <div className={clsx(PolicyHolderCradStyle.labelStyle, "col-4")}>
                {translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.assignedDate}
              </div>
            </div>
          )}
          {pendingTaskList?.length > 0 ? (
            pendingTaskList?.slice(0, 5)?.map((pendingTask: any, index: any) => (
              <PolicyHolderTasks
                pendingTask={pendingTask}
                key={index}
                handleOpenTaskModal={() => {
                  handleOpenTaskModal();
                  setSelectedRow({ ...pendingTask, ...{ sno: index + 1 } });
                }}
              />
            ))
          ) : (
            <NoRecordComponent
              message={translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.noTask}
            />
          )}
          <div>
            <PolicyHolderTaskDetailsModal
              isOpen={openTaskModal}
              onClose={handleOpenTaskModal}
              taskViewData={selectedRow}
            />
          </div>
        </div>
        <div className="text-right">
          <Link href={`/all-tasks/${claimId}`}>
            {translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.viewAll}
          </Link>
        </div>
      </Cards>
    </>
  );
};
const mapStateToProps = (state: RootState) => ({
  pendingTaskList: state.commonData.pendingTaskList,
  policyHolderUser: selectPolicyHolderTypeParticipant(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(PolicyHoldersComponent);
