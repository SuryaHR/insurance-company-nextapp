"use client";
import React from "react";
import ServiceRequestTableStyle from "./ServiceRequestTable.module.scss";
import { ConnectedProps, connect } from "react-redux";
import {
  fetchServiceRequestList,
  deleteServiceRequestItem,
} from "@/services/ClaimServiceRequestListService";
import { convertToCurrentTimezone } from "@/utils/helper";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { TABLE_LIMIT_5 } from "@/constants/constants";
import { useParams, useRouter } from "next/navigation";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { addNotification } from "@/reducers/Notification/NotificationSlice";

interface typeProps {
  setTableLoader: React.SetStateAction<any>;
  tableLoader: boolean;
}
const ServiceRequestTable: React.FC<connectorType & typeProps> = (props) => {
  const { claimId }: { claimId: string } = useParams();

  const {
    currentPageNumber = 1,
    setTableLoader,
    totalClaims,
    tableLoader,
    claimErrorMsg,
    claimServiceRequestList,
    addNotification,
  }: React.SetStateAction<any> = props;

  const router = useRouter();

  const pageLimit = TABLE_LIMIT_5;

  interface ServiceRequestData {
    [key: string | number]: any;
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [deletePayload, setDelete] = React.useState<React.SetStateAction<any>>(null);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: currentPageNumber - 1,
    pageSize: pageLimit,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const columnHelper = createColumnHelper<ServiceRequestData>();

  const columns = [
    columnHelper.accessor("serviceNumber", {
      id: "serviceNumber",
      header: () => `Service Number`,
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),

    columnHelper.accessor("description", {
      id: "description",
      header: () => `Request Description`,
      cell: (info) => info.renderValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("vendorDetails", {
      header: () => `Vendor`,
      cell: (info) => info.renderValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("assignedDate", {
      id: "assignedDate",
      header: () => `Assign Date`,
      cell: (info) => {
        if (info.renderValue()) {
          const unixDate = Date.parse(info.renderValue().replace("T", " "));
          const formatedDate = convertToCurrentTimezone(unixDate, "MM/DD/YYYY h:mm A");
          return formatedDate;
        }
        return info.renderValue();
      },
      enableSorting: true,
    }),
    columnHelper.accessor("targetDate", {
      id: "targetDate",
      header: "Target Completion Date",
      cell: (info) => {
        if (info.renderValue()) {
          const unixDate = Date.parse(info.renderValue().replace("T", " "));
          const formatedDate = convertToCurrentTimezone(unixDate, "MM/DD/YYYY h:mm A");
          return formatedDate;
        }
        return info.renderValue();
      },
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row?.status?.statusName, {
      id: "Status",
      header: () => <span>Status</span>,
      enableSorting: true,
      size: 100,
    }),
    columnHelper.accessor("", {
      id: "Action",
      header: "Action",
      cell: ({ row }) => (
        <>
          <a
            href=""
            className={ServiceRequestTableStyle.AssignText}
            onClick={(e) => assignService(e, row.original)}
          >
            Assign
          </a>
          <span>|</span>
          <a
            href=""
            className={ServiceRequestTableStyle.DeleteText}
            onClick={(e) => deleteAction(e, row.original)}
          >
            Delete
          </a>
        </>
      ),
      enableSorting: false,
    }),
  ];

  const assignService = (e: React.MouseEvent<HTMLElement>, rowData: any) => {
    e.preventDefault();
    e.stopPropagation();

    sessionStorage.setItem("claimNumber", rowData.claimNumber);
    sessionStorage.setItem("serviceRequestId", rowData.serviceRequestId);
    sessionStorage.setItem("claimId", claimId);

    router.push(`/adjuster-assign-service-request/${rowData?.serviceRequestId}`);
  };
  const deleteAction = (e: React.MouseEvent<HTMLElement>, rowData: any) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      serviceId: rowData.serviceRequestId,
    };
    setDelete(payload);
  };

  const ModalMsg = () => {
    return (
      <div>
        Are you sure you want to delete the service request?<b> Please Confirm!</b>
      </div>
    );
  };
  const handleDeleteClose = () => {
    setDelete(null);
  };

  const handleDelete = async () => {
    setTableLoader(true);

    const id = deletePayload?.id;
    const res = await deleteServiceRequestItem(deletePayload);
    setDelete(null);
    console.log("deleteServiceRequestClaimItem res", res);

    if (res) {
      setTableLoader(false);

      addNotification({
        message: res ?? "Successfully deleted item.",
        id,
        status: "success",
      });
    } else {
      setTableLoader(false);

      addNotification({
        message: "Something went wrong.",
        id,
        status: "error",
      });
    }
  };
  const handleSorting = async (sortingUpdater: any) => {
    setTableLoader(true);

    const newSortVal = sortingUpdater(sorting);
    setSorting(newSortVal);

    if (newSortVal.length > 0) {
      const orderBy = newSortVal[0].desc ? "desc" : "asc";
      const sortBy = newSortVal[0].id;
      const result = await fetchServiceRequestList(
        pagination.pageIndex,
        pageLimit,
        sortBy,
        orderBy
      );
      if (result) {
        setTableLoader(false);
      }
    } else if (newSortVal.length === 0 && claimServiceRequestList.length > 0) {
      const result = await fetchServiceRequestList(pagination.pageIndex, pageLimit);
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const handlePagination = async (updaterFunction: any) => {
    setTableLoader(true);

    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    const pageNumber = newPaginationValue.pageIndex;

    if (sorting.length > 0) {
      const orderBy = sorting[0].desc ? "desc" : "asc";
      const sortBy = sorting[0].id;
      const result = await fetchServiceRequestList(
        pageNumber,
        pageLimit,
        sortBy,
        orderBy
      );
      if (result) {
        setTableLoader(false);
      }
    } else if (sorting.length === 0 && claimServiceRequestList.length > 0) {
      const result = await fetchServiceRequestList(pageNumber, pageLimit);
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const handleRowClick = (rowData: any) => {
    sessionStorage.setItem("claimNumber", rowData.claimNumber);
    sessionStorage.setItem("serviceRequestId", rowData.serviceRequestId);
    sessionStorage.setItem("claimId", claimId);
    router.push(`/adjuster-service-request-edit/${rowData?.serviceRequestId}`);
  };
  const table = useReactTable({
    data: claimServiceRequestList,
    columns,
    pageCount: Math.ceil(totalClaims / pageLimit),
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: handlePagination,
    onSortingChange: handleSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableColumnFilters: false,
  });

  return (
    <>
      {deletePayload && (
        <div>
          <ConfirmModal
            showConfirmation={true}
            closeHandler={handleDeleteClose}
            submitBtnText="Yes"
            closeBtnText="No"
            childComp={<ModalMsg />}
            modalHeading="Service request"
            submitHandler={handleDelete}
          />
        </div>
      )}
      <div className={ServiceRequestTableStyle.claimTableContainer}>
        <CustomReactTable
          table={table}
          totalDataCount={totalClaims}
          pageLimit={totalClaims > 5 ? pageLimit : null}
          loader={tableLoader}
          tableDataErrorMsg={claimErrorMsg}
          handleRowClick={handleRowClick}
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ claimServiceRequestdata }: any) => ({
  claimServiceRequestListTotalData:
    claimServiceRequestdata.claimServiceRequestListTotalData,
  claimServiceRequestList: claimServiceRequestdata.claimServiceRequestList,
  totalClaims: claimServiceRequestdata.totalClaims,
  claimErrorMsg: claimServiceRequestdata.claimErrorMsg,
});
const mapDispatchToProps = {
  addNotification,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ServiceRequestTable);
