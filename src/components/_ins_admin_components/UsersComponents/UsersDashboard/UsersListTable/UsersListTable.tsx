"use client";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usersTranslateTranslatePropsType } from "@/app/[lang]/(ins_admin)/users/page";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { connect, useDispatch } from "react-redux";
import CustomLoader from "@/components/common/CustomLoader";
import {
  getCompanyEmployees,
  removeUser,
} from "@/services/_ins_admin_services/usersService";
import { useAppSelector } from "@/hooks/reduxCustomHook";
import selectCompanyId from "@/reducers/Session/Selectors/selectCompanyId";
import { convertToCurrentTimezone } from "@/utils/helper";
import style from "./userListTableStyle.module.scss";
import { addCompanyEmployees } from "@/reducers/_ins_admin_reducers/UsersSlice";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import DeleteUserConfirmModal from "@/components/common/ConfirmModal";

interface tableDataType {
  [key: string | number]: any;
}

function UsersListTable(props: any) {
  const { addNotification } = props;
  const { translate } =
    useContext<TranslateContextData<usersTranslateTranslatePropsType>>(TranslateContext);
  const companyId = useAppSelector(selectCompanyId);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [resetPagination, setResetPagination] = React.useState<boolean>(false);

  const pageLimit = PAGINATION_LIMIT_20;

  const dispatch = useDispatch();
  const [isModalConfirm, setIsModalConfirm] = useState<boolean>(false);
  const [userRowData, setUserRowData] = useState<any>();

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageLimit,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const fetchData = useCallback(
    async (param: any) => {
      setLoading(true);
      getCompanyEmployees(param)
        .then((res) => {
          dispatch(addCompanyEmployees(res?.data));
        })
        .catch((error) => console.log("USER list", error))
        .finally(() => {
          setLoading(false);
        });
    },
    [dispatch]
  );

  React.useEffect(() => {
    const defaultData = [...props.users];
    setData([...defaultData]);
  }, [props.users]);

  useEffect(() => {
    const param = {
      companyId: companyId,
      pageSize: pageSize,
      pageNumber: pageIndex,
    };
    fetchData(param);
  }, [companyId, fetchData, pageIndex, pageSize]);

  const deleteAdminContact = async (item: any) => {
    setLoading(true);
    const param = {
      id: item.userId,
      status: item.accountStatus,
    };
    const res: any = await removeUser(param);
    setLoading(false);
    if (!item.accountStatus) {
      setUserRowData([]);
      setIsModalConfirm(false);
    }

    if (res.status === 200) {
      addNotification({
        message:
          res.message || "Your request has been submitted or updated successfully.",
        id: item?.userId,
        status: "success",
      });
      const param = {
        companyId: companyId,
        pageSize: pageSize,
        pageNumber: pageIndex + 1,
      };
      fetchData(param);
    } else {
      addNotification({
        message: res.errorMessage ?? "Falied deleted item.",
        id: item?.userId,
        status: "error",
      });
    }
  };

  React.useEffect(() => {
    if (resetPagination) {
      setPagination({ pageIndex: 0, pageSize: PAGINATION_LIMIT_20 });
      setResetPagination(false);
    }
  }, [resetPagination]);

  const columnHelper = createColumnHelper<tableDataType>();
  const columns = [
    columnHelper.accessor("userId", {
      header: () => translate.usersListTranslate?.id,
      enableSorting: true,
    }),
    columnHelper.accessor("lastName", {
      header: () => translate.usersListTranslate?.userName,
      enableSorting: true,
      enableColumnFilter: false,
      cell: (info) => `${info.row.original?.lastName} ${info.row.original?.firstName}`,
    }),
    columnHelper.accessor("accountStatus", {
      header: () => translate.usersListTranslate?.accountStatus,
      enableSorting: true,
      cell: (info) => `${info.getValue() ? "Active" : "In-Active"}`,
    }),
    columnHelper.accessor("designation", {
      header: () => translate.usersListTranslate?.designation,
      enableSorting: true,
      cell: (info) => info.getValue()?.name,
    }),
    columnHelper.accessor("role", {
      header: translate.usersListTranslate?.role,
      cell: (info) =>
        info.getValue() && info.getValue()[0] && info.getValue()[0].roleName,
    }),

    columnHelper.accessor("branchDetails", {
      header: () => translate.usersListTranslate?.branch,
      enableSorting: true,
      cell: (info) => `${info.getValue()?.companyName}`,
    }),
    columnHelper.accessor("lastLogin", {
      header: () => translate.usersListTranslate?.lastaccess,
      enableSorting: true,
      cell: (info) =>
        (info.getValue() && convertToCurrentTimezone(info.getValue())) || "",
    }),
    columnHelper.accessor("action", {
      header: () => translate.usersListTranslate?.action,
      enableSorting: true,
      cell: (info) => {
        return (
          <div className="d-flex">
            <div className={`${style.actionBtn} pe-1`}>
              {translate.usersListTranslate?.edit}
            </div>{" "}
            |
            <div
              className={`${style.actionBtn} ps-1`}
              onClick={() => {
                if (!info.getValue()) {
                  setUserRowData(info.row.original);
                  setIsModalConfirm(true);
                } else {
                  deleteAdminContact(info.row.original);
                }
              }}
            >
              {info.getValue()
                ? translate.usersListTranslate?.inActive
                : translate.usersListTranslate?.delete}
            </div>
          </div>
        );
      },
    }),
  ];

  const handlePagination = async (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    const pageNumber = newPaginationValue.pageIndex + 1;

    const param = {
      companyId: companyId,
      pageSize: pageSize,
      pageNumber: pageNumber,
    };
    await fetchData(param);
  };

  const table = useReactTable({
    data: data,
    columns,
    pageCount: Math.ceil(props?.usersTotalCount / pageLimit),
    state: {
      pagination,
    },
    onPaginationChange: handlePagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    manualPagination: true,
    enableColumnFilters: false,
  });

  return (
    <div>
      {loading && <CustomLoader />}
      <CustomReactTable
        table={table}
        data={data}
        pageLimit={props?.usersTotalCount > pageLimit ? pageLimit : false}
        totalDataCount={props?.usersTotalCount}
        tableDataErrorMsg={props?.usersTotalCount === 0 && "No Data Found"}
      />

      <DeleteUserConfirmModal
        showConfirmation={isModalConfirm}
        closeHandler={() => setIsModalConfirm(false)}
        submitBtnText="Yes"
        closeBtnText="No"
        childComp={`Are you sure you want to delete the user?`}
        modalHeading="Delete Employee"
        submitHandler={() => deleteAdminContact(userRowData)}
      />
    </div>
  );
}

const mapStateToProps = ({ users }: any) => ({
  users: users?.companyEmployees?.contactDTOs || [],
  usersTotalCount: users?.companyEmployees?.totalUser || 0,
});

const mapDispatchToProps = {
  addNotification,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(UsersListTable);
