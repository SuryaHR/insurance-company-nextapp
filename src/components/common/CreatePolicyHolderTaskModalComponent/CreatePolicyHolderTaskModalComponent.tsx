"use-client";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import modalStyle from "./CreatePolicyHolderTaskModalComponent.module.scss";
import GenericSelect from "@/components/common/GenericSelect";
import GenericButton from "@/components/common/GenericButton";
import { RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import selectLoggedInUserEmail from "@/reducers/Session/Selectors/selectLoggedInUserEmail";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";
import { Controller } from "react-hook-form";
import useCustomForm from "@/hooks/useCustomForm";
import GenericTextArea from "@/components/common/GenericTextArea";
import { number, object, string } from "valibot";
import selectPolicyHolderTypeParticipant from "@/reducers/_adjuster_reducers/CommonData/Selectors/selectPolicyHolderTypeParticipant";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import CustomLoader from "@/components/common/CustomLoader";
import { addPendingTasks } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import {
  createTask,
  getPendingTaskList,
  getTaskList,
} from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { allTaskTranslatePropType } from "@/app/[lang]/(adjuster)/all-tasks/[claimId]/page";

interface CreatePolicyHolderTaskModalComponentProps {
  handleOpenModal: () => void;
  claimId: string;
}

const CreatePolicyHolderTaskModalComponent: React.FC<
  connectorType & CreatePolicyHolderTaskModalComponentProps
> = ({ handleOpenModal, claimId, id, email, policyHolderUser }) => {
  console.log("policyHolderUser", policyHolderUser);

  const dispatch = useAppDispatch();
  const [taskList, setTaskList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const fetchTaskList = async () => {
      const taskListResp = await getTaskList();
      if (taskListResp?.data) {
        setTaskList(taskListResp?.data);
      }
    };
    fetchTaskList();
  }, []);

  const taskOptions: { label: any; value: any }[] = [];
  if (taskList.length > 0) {
    taskList.map((task: any) => {
      taskOptions.push({
        label: task?.taskName,
        value: task?.taskId,
      });
    });
  }
  const schema = object({
    task: object(
      {
        label: string(),
        value: number(),
      },
      "Please select task"
    ),
    description: string(),
  });

  const fetchPendingTask = async () => {
    const pendingTakResp = await getPendingTaskList({ claimId }, true);
    if (Array.isArray(pendingTakResp?.data)) {
      dispatch(addPendingTasks(pendingTakResp?.data));
    } else {
      dispatch(addPendingTasks([]));
    }
  };

  const { register, handleSubmit, formState, control } = useCustomForm(schema);
  const { errors } = formState;
  const submitHandler = async (data: any) => {
    setShowLoader(true);
    handleOpenModal();
    const payload = {
      claimId,
      claimParticipantDTO: policyHolderUser,
      registrationNumber: process.env.NEXT_PUBLIC_SPEED_CHECK_VENDOR,
      claimPendingTasks: [{ taskId: data?.task?.value, comment: data?.description }],
      adjusterDetails: { id, email },
    };
    const createTaskResp = await createTask(payload);
    if (createTaskResp?.status === 200) {
      setShowLoader(false);
      dispatch(
        addNotification({
          message: createTaskResp?.message,
          id: "task-created-success",
          status: "success",
        })
      );
      fetchPendingTask();
    } else {
      setShowLoader(false);
      dispatch(
        addNotification({
          message: createTaskResp?.message,
          id: "task-created-failure",
          status: "error",
        })
      );
    }
  };

  const { translate } =
    useContext<TranslateContextData<allTaskTranslatePropType>>(TranslateContext);

  return (
    <>
      {showLoader && <CustomLoader />}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className={clsx(modalStyle.upperContainer, "p-2")}>
          <div className="row col-12 m-2">
            <div className={clsx(modalStyle.inputBoxAlign, "col-3")}>
              <label className={modalStyle.labelStyle}>
                {
                  translate?.claimDetailsTabTranslate?.policyHolderTaskCard
                    ?.createTaskModal?.assignedTo
                }
              </label>
            </div>
            <div className={clsx(modalStyle.labelStyle, "col-7 mx-3")}>
              {policyHolderUser?.lastName}
              {policyHolderUser?.lastName && ","} {policyHolderUser?.firstName}
            </div>
          </div>

          <div className="row col-12 m-2">
            <div className={clsx(modalStyle.inputBoxAlign, "col-3")}>
              <label className={modalStyle.labelStyle}>
                {
                  translate?.claimDetailsTabTranslate?.policyHolderTaskCard
                    ?.createTaskModal?.formName
                }
              </label>
            </div>
            <div className="col-7 mx-3">
              <Controller
                control={control}
                name="task"
                render={({ field: { onChange: fieldOnChange, ...rest } }: any) => (
                  <GenericSelect
                    placeholder={"Select task"}
                    options={taskOptions}
                    showError={errors["task"]}
                    errorMsg={errors?.task?.message}
                    isModalPopUp={true}
                    onChange={(e: any) => {
                      fieldOnChange(e);
                    }}
                    {...rest}
                  />
                )}
              />
            </div>
          </div>

          <div className="row col-12 m-2">
            <div className={clsx(modalStyle.inputBoxAlign, "col-3")}>
              <label className={modalStyle.labelStyle}>
                {
                  translate?.claimDetailsTabTranslate?.policyHolderTaskCard
                    ?.createTaskModal?.description
                }
              </label>
            </div>
            <div className="col-7 mx-3">
              <GenericTextArea
                showError={errors["description"]}
                errorMsg={errors?.description?.message}
                id="description"
                placeholder=""
                {...register("description")}
              />
            </div>
          </div>
        </div>

        <div className={clsx(modalStyle.alignRight, "row col-12 mt-2")}>
          <div className={"row col-7"}>
            <div className={clsx("row col-6", modalStyle.centerAlign)}>
              <GenericButton
                label={
                  translate?.claimDetailsTabTranslate?.policyHolderTaskCard
                    ?.createTaskModal?.cancelBtn
                }
                size="medium"
                onClick={handleOpenModal}
              />
            </div>
            <div className="row col-6">
              <GenericButton
                label={
                  translate?.claimDetailsTabTranslate?.policyHolderTaskCard
                    ?.createTaskModal?.addformBtn
                }
                size="medium"
                type="submit"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  id: selectLoggedInUserId(state),
  email: selectLoggedInUserEmail(state),
  policyHolderUser: selectPolicyHolderTypeParticipant(state),
});

const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(CreatePolicyHolderTaskModalComponent);
