"use client";
import React, { useState } from "react";
import AllTaskTableStyle from "./AllTaskTable.module.scss";
import { convertToCurrentTimezone } from "@/utils/helper";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { ConnectedProps, connect, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  addSelectedClaimId,
  addFilterValues,
} from "@/reducers/_adjuster_reducers/ClaimData/ClaimSlice";
import NoRecordComponent from "@/components/common/NoRecordComponent/index";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import DeleteOrCancelAllCliamTask from "@/components/common/ConfirmModal";
import {
  canclePolicyholderTask,
  deletePolicyholderTask,
  getPendingTaskList,
} from "@/services/_adjuster_services/CommonDataServices/CommonDataSerive";
import { addPendingTasks } from "@/reducers/_adjuster_reducers/CommonData/CommonDataSlice";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import CustomLoader from "@/components/common/CustomLoader";
import clsx from "clsx";
import NewTaskModal from "@/components/_adjuster_components/AdjusterPropertyClaimDetailComponent/ClaimDetailsCardsComponent/PolicyHoldersComponent/NewTaskModal";
import { allTaskTranslatePropType } from "@/app/[lang]/(adjuster)/all-tasks/[claimId]/page";

interface typeProps {
  [key: string | number]: any;
}
const AllTaskTable: React.FC<connectorType & typeProps> = (props) => {
  const { translate } =
    useContext<TranslateContextData<allTaskTranslatePropType>>(TranslateContext);

  const { tableLoader, claimErrorMsg } = props;
  const { pendingTaskList } = props;

  const [isModalShow, setIsModalShow] = useState<boolean>(false);
  const [isModalCancelShow, setIsModalCancelShow] = useState<boolean>(false);

  const [isModalTaskView, setIsModalTaskView] = useState<boolean>(false);

  const [showLoader, setShowLoader] = useState<boolean>(false);

  const [selectedRow, setSelectedRow] = useState<any>([]);

  const dispatch = useDispatch();

  interface ClaimData {
    [key: string | number]: any;
  }

  const handleLoader = () => setShowLoader((prevState) => !prevState);
  const showModalDelete = () => setIsModalShow((prevState: boolean) => !prevState);
  const showModalCancel = () => setIsModalCancelShow((prevState: boolean) => !prevState);
  const showModalTaskView = () => {
    setIsModalTaskView((prevState: boolean) => !prevState);
    !isModalTaskView && setSelectedRow([]);
  };

  const columnHelper = createColumnHelper<ClaimData>();

  const columns = [
    columnHelper.accessor("taskId", {
      id: "Form_Id",
      header: () =>
        translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks?.formID,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("taskName", {
      id: "Form_Name",
      header: () => (
        <span>
          {
            translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
              ?.formName
          }
        </span>
      ),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("comment", {
      id: "description",
      header: () =>
        translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
          ?.description,
      cell: (info) => info.renderValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor((row) => row.status?.status, {
      id: "Status",
      header: () => (
        <span>
          {
            translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
              ?.status
          }
        </span>
      ),
      size: 100,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("createdBy", {
      header: () =>
        translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
          ?.createdBy,
      cell: (info) => info.renderValue(),
      enableColumnFilter: false,
    }),

    columnHelper.accessor("assignedTo", {
      header:
        translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
          ?.assignedTo,
      enableSorting: false,
      size: 100,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("assignedDate", {
      id: "Assigned_Date",
      header:
        translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
          ?.assignedDate,
      cell: (info) => {
        if (info.renderValue()) {
          const dateVal = info.renderValue().replace("T", " ");
          const unixDate = Date.parse(dateVal);
          const formatedDate = convertToCurrentTimezone(unixDate, "MM/DD/YYYY h:mm A");
          return formatedDate;
        }
        return null;
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("action", {
      header:
        translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks?.action,
      id: "Action",
      enableColumnFilter: false,
      cell: (props) => {
        const isCompCanc =
          props.row.original?.status.status === "COMPLETED" ||
          props.row.original?.status.status === "CANCELLED";
        return (
          <div
            className={AllTaskTableStyle.actionButtons}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div
              onClick={() => {
                if (!isCompCanc) {
                  showModalDelete();
                  setSelectedRow(props.row.original);
                }
              }}
            >
              <span
                className={clsx(
                  isCompCanc && AllTaskTableStyle.notAllowed,
                  AllTaskTableStyle.deleteButton
                )}
              >
                {
                  translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
                    ?.dlt
                }
              </span>
            </div>
            <div
              onClick={() => {
                if (!isCompCanc) {
                  setSelectedRow(props.row.original);
                  showModalCancel();
                }
              }}
            >
              <span
                className={clsx(
                  isCompCanc && AllTaskTableStyle.notAllowed,
                  AllTaskTableStyle.cancelButton
                )}
              >
                {
                  translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
                    ?.cnl
                }
              </span>
            </div>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: pendingTaskList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
  });

  const handleDeleteCliamTaskSubmit = async () => {
    handleLoader();
    showModalDelete();
    const res: any = await deletePolicyholderTask(selectedRow.taskId);
    setSelectedRow([]);
    if (res?.status == 200) {
      const pendingTaskListRes = await getPendingTaskList(
        { claimId: props.claimId },
        true
      );
      dispatch(addPendingTasks(pendingTaskListRes?.data));
      handleLoader();
      props.addNotification({
        message: res?.message,
        id: "mark_delete_success",
        status: "success",
      });
    } else {
      handleLoader();
      props.addNotification({
        message: res?.errorMessage || "Failed to delete",
        id: "mark_delete_failure",
        status: "error",
      });
    }
  };

  const handleCancelCliamTaskSubmit = async () => {
    handleLoader();
    showModalCancel();
    const param = {
      claimNumber: props.claimId,
      formId: selectedRow.taskId,
      xOriginator: process.env.NEXT_PUBLIC_SPEED_CHECK_VENDOR,
    };
    const res = await canclePolicyholderTask(param);
    setSelectedRow([]);
    if (res.status == 200) {
      const pendingTaskListRes = await getPendingTaskList(
        { claimId: props.claimId },
        true
      );
      dispatch(addPendingTasks(pendingTaskListRes?.data));
      handleLoader();
      props.addNotification({
        message: res.message,
        id: "mark_ca_success",
        status: "success",
      });
    } else {
      handleLoader();
      props.addNotification({
        message: res?.errorMessage || "Failed to delete",
        id: "mark_delete_failure",
        status: "error",
      });
    }
  };

  const handleRowClick = (data: any) => {
    showModalTaskView();
    setSelectedRow(data);
  };

  return (
    <div className={AllTaskTableStyle.claimTableContainer}>
      {showLoader && <CustomLoader />}
      <CustomReactTable
        table={table}
        data={pendingTaskList}
        showStatusColor={true}
        loader={tableLoader}
        tableDataErrorMsg={claimErrorMsg}
        handleRowClick={handleRowClick}
      />
      {pendingTaskList?.length === 0 && (
        <NoRecordComponent
          message={
            translate?.claimDetailsTabTranslate?.policyHolderTaskCard?.allClaimTasks
              ?.noTask
          }
        />
      )}
      <DeleteOrCancelAllCliamTask
        showConfirmation={isModalShow}
        closeHandler={showModalDelete}
        submitBtnText="Yes"
        closeBtnText="No"
        childComp="Are you sure you want to delete this claim form? Please Confirm"
        modalHeading="Delete Claim Form"
        submitHandler={handleDeleteCliamTaskSubmit}
      />
      <DeleteOrCancelAllCliamTask
        showConfirmation={isModalCancelShow}
        closeHandler={showModalCancel}
        submitBtnText="Yes"
        closeBtnText="No"
        childComp="Are you sure you want to cancel this claim form? Please Confirm"
        modalHeading="Cancel Claim Form"
        submitHandler={handleCancelCliamTaskSubmit}
      />
      <NewTaskModal
        isOpen={isModalTaskView}
        onClose={showModalTaskView}
        headingName="test"
        taskViewData={selectedRow}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  pendingTaskList: state.commonData.pendingTaskList,
});

const mapDispatchToProps = {
  addSelectedClaimId,
  addFilterValues,
  addNotification,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AllTaskTable);
