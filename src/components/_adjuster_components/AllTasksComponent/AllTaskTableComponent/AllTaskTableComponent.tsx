"use client";
import React from "react";
import { useState } from "react";
import AllTaskButton from "./AllTaskButton";
import AllTaskComponentStyleTable from "./AllTaskTable.module.scss";
import AllTaskTable from "./AllTaskTable/index";
import Modal from "@/components/common/ModalPopups";
import CreatePolicyHolderTaskModalComponent from "@/components/common/CreatePolicyHolderTaskModalComponent";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { allTaskTranslatePropType } from "@/app/[lang]/(adjuster)/all-tasks/[claimId]/page";
import selectPolicyHolderTypeParticipant from "@/reducers/_adjuster_reducers/CommonData/Selectors/selectPolicyHolderTypeParticipant";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import NoRecordComponent from "@/components/common/NoRecordComponent";

interface allTaskType {
  claimId: string;
  policyHolderUser: any;
}

const AllTaskTableComponent: React.FC<connectorType & allTaskType> = ({
  claimId,
  policyHolderUser,
}) => {
  const [tableLoader, setTableLoader] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showErrorCreateNewTask, setShowErrorCreateNewTask] = useState(false);

  const { translate } =
    useContext<TranslateContextData<allTaskTranslatePropType>>(TranslateContext);

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
        overlayClassName={AllTaskComponentStyleTable.modalContainer}
        modalWidthClassName={AllTaskComponentStyleTable.modalContent}
        childComp={
          <CreatePolicyHolderTaskModalComponent
            handleOpenModal={handleOpenModal}
            claimId={claimId}
          />
        }
        headingName={
          translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.modalHeading
        }
      />
      <div className={AllTaskComponentStyleTable.claimContainer}>
        <div className={`row ${AllTaskComponentStyleTable.claimContentContainer}`}>
          <div className="col-lg-8 col-md-6 col-sm-12 col-12 d-flex mb-2">
            <AllTaskButton handleOpenModal={handleOpenModal} />
          </div>
        </div>
      </div>
      {showErrorCreateNewTask && (
        <div className="row">
          <NoRecordComponent
            textLeftClass={true}
            message={
              translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.errorMessage
            }
          />
        </div>
      )}

      <div className="row">
        <AllTaskTable
          claimId={claimId}
          setTableLoader={setTableLoader}
          tableLoader={tableLoader}
        />
      </div>
    </>
  );
};
const mapStateToProps = (state: RootState) => ({
  policyHolderUser: selectPolicyHolderTypeParticipant(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AllTaskTableComponent);
