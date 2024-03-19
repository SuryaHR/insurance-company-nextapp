"use client";
import React, { useEffect } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./SupervisorClaimReportsTableComponent.module.scss";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxCustomHook";
import { addSelectedClaimId } from "@/reducers/_adjuster_reducers/ClaimData/ClaimSlice";
import { fetchClaimsforReport } from "@/reducers/_adjuster_reducers/Reports/ClaimsReportSlice";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";
import store from "@/store/store";

import CustomLoader from "@/components/common/CustomLoader/index";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { convertToCurrentTimezone } from "@/utils/helper";
import { getUSDCurrency } from "@/utils/utitlity";
// import { arrangeData } from "./ClaimReportTableFunc";

interface typeProps {
  [key: string | number]: any;
}

interface ClaimData {
  [key: string | number]: any;
}

const SupervisorClaimReportsTableComponent: React.FC<typeProps> = (props) => {
  const {
    tableLoader,
    resetPagination,
    // setResetPagination,
    fromSelectedDate,
    toSelectedDate,
    apiDataPayload,
  } = props;
  const router = useRouter();

  const claimsforReportList = useAppSelector(
    ({ claimsReportSlice }: any) => claimsReportSlice?.claimsforReport
  );
  const claimsforReportfetching = useAppSelector(
    ({ claimsReportSlice }: any) => claimsReportSlice?.claimsforReportfetching
  );

  const dispatch = useAppDispatch();
  const state = store.getState();
  const userId = selectLoggedInUserId(state);
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);
  //   const [finalData, setFinalData] = React.useState<any>({});

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: claimsforReportList?.currentPageNumber - 1,
    pageSize: PAGINATION_LIMIT_20,
  });

  const changeNameHandler = (evt: any, row: any) => {
    evt.stopPropagation();
    row.toggleExpanded();
  };

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const columnHelper = createColumnHelper<ClaimData>();

  const role = window.localStorage.getItem("role");
  const columns = [
    columnHelper.accessor("claimNumber", {
      id: "Claim_Number",
      header: () => `Claim #`,
      cell: ({ row, renderValue }) => {
        return (
          <>
            <span className={styles.expand}>{renderValue()}</span>
            {row.getCanExpand() ? (
              row.getIsExpanded() ? (
                <span onClick={(e) => changeNameHandler(e, row)}>
                  <AiFillCaretUp />
                </span>
              ) : (
                <span onClick={(e) => changeNameHandler(e, row)}>
                  <AiFillCaretDown />
                </span>
              )
            ) : (
              ""
            )}
          </>
        );
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("createDate", {
      id: "Created_date",
      header: () => `Created Date`,
      cell: (info: any) => {
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
    columnHelper.accessor("status", {
      id: "Status",
      cell: (status) => {
        return (
          <div>
            <span>{status.getValue() as React.ReactNode}</span>
          </div>
        );
      },
      header: () => <span>Status</span>,
      enableColumnFilter: false,
      size: 200,
    }),
    columnHelper.accessor("policyLimit", {
      id: "Policy_Limit",
      header: () => `Policy Limits`,
      cell: (info: any) => (
        <span>
          {info.getValue() && (getUSDCurrency(info.getValue() ?? 0) as React.ReactNode)}
        </span>
      ),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("policyType", {
      id: "Policy_Type",
      header: () => `Policy Type`,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("policyHolder", {
      id: "Policy_Holder",
      header: () => `Policyholder`,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("assignmentNumber", {
      id: "Assignment",
      header: () => <span>{`Assignment #`}</span>,
      cell: (info: any) => {
        if (!info?.getValue()) {
          return "Not Assigned";
        } else {
          return info?.getValue();
        }
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("service", {
      id: "Service",
      header: () => `Service`,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("item", {
      id: "Item",
      header: () => `# Item`,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("quoteDate", {
      id: "Quote_Date",
      header: "Quote Date",
      cell: (info: any) => {
        if (info.renderValue()) {
          return info.renderValue();
        }
        return null;
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("quoteValueForNonAssignmentItems", {
      id: "Quote_Price",
      header: () => `Quote Price (w. taxes)`,
      cell: (info: any) => {
        if (info.getValue()) return getUSDCurrency(info.getValue());
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor(
      (row) => {
        return row.itemReplaced;
      },
      {
        id: "Item_Replaced",
        header: () => `Item Replaced ?`,
        cell: (info: any) => {
          if (info.getValue()?.toString() === "true") {
            return <span>Yes</span>;
          }
          if (info.getValue()?.toString() === "false") {
            return <span>No</span>;
          } else {
            return <span></span>;
          }
        },
        enableSorting: true,
        enableColumnFilter: false,
      }
    ),
    columnHelper.accessor("replacementCostOfItemsWithNoAssignment", {
      id: "Replacement_Cost",
      header: () => `Replacement Cost`,
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("totalOfVendorInvoicesAssignment", {
      id: "Vendor_Invoice",
      header: () => `Vendor Invoice $`,
      cell: (info: any) => {
        return getUSDCurrency(info.getValue() ?? 0);
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("closeDate", {
      id: "Close_Date",
      header: "Close Date",
      cell: (info: any) => {
        if (info.renderValue()) {
          const dateVal = info.renderValue().replace("T", " ");
          const unixDate = Date.parse(dateVal);
          const formatedDate = convertToCurrentTimezone(unixDate, "MM/DD/YYYY h:mm A");
          return formatedDate;
        }
        return "N/A";
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];

  const addAdjusterColumn = columnHelper.accessor("adjuster", {
    id: "Adjuster",
    header: () => `Adjuster`,
    cell: (info: any) => {
      info.renderValue();
      return null;
    },
    enableSorting: true,
    enableColumnFilter: false,
  });

  const addBranchColumn = columnHelper.accessor("branch", {
    id: "Branch_Office",
    header: () => `Branch/Office`,
    cell: (info: any) => {
      info.renderValue();
      return null;
    },
    enableSorting: true,
    enableColumnFilter: false,
  });

  const addIndemnityOpportunityColumn = columnHelper.accessor("indemnityOpportunity", {
    id: "IndemnityOpportunity",
    header: () => `Indemnity Opportunity`,
    cell: (info: any) => {
      info.renderValue();
      return null;
    },
    enableSorting: true,
    enableColumnFilter: false,
  });

  const addIndemnityColumn = columnHelper.accessor("indemnity", {
    id: "Indemnity",
    header: () => `Indemnity`,
    cell: (info: any) => {
      info.renderValue();
      return null;
    },
    enableSorting: true,
    enableColumnFilter: false,
  });

  if (role !== "ADJUSTER") {
    columns.splice(6, 0, addAdjusterColumn);
  }
  if (role == "CLAIM MANAGER") {
    columns.unshift(addBranchColumn);
  }

  const ClaimProfile = process.env.NEXT_PUBLIC_CLAIM_PROFILE;

  if (
    ClaimProfile === "Jewelry" &&
    (role == "CLAIM SUPERVISOR" || role == "CLAIM MANAGER")
  ) {
    const index = columns.length - 1;
    columns.splice(index, 0, addIndemnityOpportunityColumn);
    columns.splice(index + 1, 0, addIndemnityColumn);
  }

  const handleSorting = async (sortingUpdater: any) => {
    const newSortVal = sortingUpdater(sorting);
    setSorting(newSortVal);

    if (newSortVal.length > 0) {
      const orderBy = newSortVal[0].desc ? "desc" : "asc";
      const sortBy = newSortVal[0].id;
      const payload = {
        fromDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        toDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        pagination: {
          pageNumber: pagination.pageIndex,
          limit: PAGINATION_LIMIT_20,
          sortBy: sortBy,
          orderBy: orderBy,
        },
        statusIds: apiDataPayload.selectedStatusList,
        searchKeyword: apiDataPayload.searchKeyword,
        adjusterIds: [],
        assignedUserId: userId,
        policyTypes: apiDataPayload.selectedPolicyList,
        branchIds: [],
      };
      dispatch(fetchClaimsforReport(payload));
    } else if (newSortVal.length === 0 && claimsforReportList?.claims?.length > 0) {
      const payload = {
        fromDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        toDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        pagination: {
          pageNumber: pagination.pageIndex,
          limit: PAGINATION_LIMIT_20,
          orderBy: "asc",
          sortBy: "createDate",
        },
        statusIds: apiDataPayload.selectedStatusList,
        searchKeyword: apiDataPayload.searchKeyword,
        adjusterIds: [],
        assignedUserId: userId,
        policyTypes: [],
        branchIds: [],
      };
      dispatch(fetchClaimsforReport(payload));
    }
  };

  const handlePagination = async (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    const pageNumber = newPaginationValue.pageIndex + 1;

    if (sorting.length > 0) {
      const orderBy = sorting[0].desc ? "desc" : "asc";
      const sortBy = sorting[0].id;
      const payload = {
        fromDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        toDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        pagination: {
          pageNumber: pageNumber,
          limit: PAGINATION_LIMIT_20,
          orderBy: orderBy,
          sortBy: sortBy,
        },
        statusIds: apiDataPayload.selectedStatusList,
        searchKeyword: apiDataPayload.searchKeyword,
        adjusterIds: [],
        assignedUserId: userId,
        policyTypes: apiDataPayload.selectedPolicyList,
        branchIds: [],
      };
      dispatch(fetchClaimsforReport(payload));
    } else if (sorting.length === 0 && claimsforReportList?.claims?.length > 0) {
      const payload = {
        fromDate: dayjs(fromSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        toDate: dayjs(toSelectedDate ?? "").format("MM-DD-YYYY[T]HH:mm:ss[Z]"),
        pagination: {
          pageNumber: pageNumber,
          limit: PAGINATION_LIMIT_20,
          orderBy: "asc",
        },
        statusIds: apiDataPayload?.selectedStatusList,
        searchKeyword: apiDataPayload?.searchKeyword,
        adjusterIds: [],
        assignedUserId: userId,
        policyTypes: apiDataPayload?.selectedPolicyList,
        branchIds: [],
      };
      dispatch(fetchClaimsforReport(payload));
    }
  };

  const handleRowClick = (rowData: any) => {
    sessionStorage.setItem("claimNumber", rowData?.claimNumber);
    sessionStorage.setItem("claimId", rowData?.claimId);
    sessionStorage.setItem("PolicyNumber", rowData?.policyNumber);
    dispatch(
      addSelectedClaimId({
        claimId: rowData?.claimId,
      })
    );
    router.push(`/adjuster-property-claim-details/${rowData?.claimId}`);
  };

  useEffect(() => {
    //     setPagination({
    //       pageIndex: claimsforReportList?.currentPageNumber - 1,
    //       pageSize: PAGINATION_LIMIT_20,
    //     });
    //     // const newArray = arrangeData(claimsforReportList?.claims);
    //     setFinalData(newArray);
    //   }, [claimsforReportList?.currentPageNumber]);
    //   useEffect(() => {
    //     if (resetPagination) {
    //       setPagination({ pageIndex: 0, pageSize: PAGINATION_LIMIT_20 });
    //       setResetPagination(false);
    //     }
  }, [resetPagination]);

  const table = useReactTable({
    data: [] ?? [],
    columns,
    pageCount: Math.ceil(claimsforReportList?.totalClaims / PAGINATION_LIMIT_20),
    state: {
      sorting,
      pagination,
      expanded,
    },
    getSubRows: (row: any) => row.assignments,
    enableExpanding: true,
    onPaginationChange: handlePagination,
    onExpandedChange: setExpanded,
    onSortingChange: handleSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
  });

  return (
    <div className={styles.claimTableContainer}>
      {claimsforReportfetching && <CustomLoader />}
      <CustomReactTable
        table={table}
        totalDataCount={claimsforReportList?.totalClaims}
        tableDataErrorMsg={!claimsforReportList?.claims && "No Record Found"}
        showStatusColor={true}
        loader={tableLoader}
        handleRowClick={handleRowClick}
        pageLimit={PAGINATION_LIMIT_20}
      />
    </div>
  );
};

export default SupervisorClaimReportsTableComponent;
