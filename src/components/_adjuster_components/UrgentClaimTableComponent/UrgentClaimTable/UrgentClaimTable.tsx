"use client";
import React, { useMemo, useState } from "react";
import urgentTableStyle from "./UrgentClaimTable.module.scss";
import { ConnectedProps, connect } from "react-redux";
import GenericBreadcrumb from "@/components/common/GenericBreadcrumb/index";
import clsx from "clsx";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import { RootState } from "@/store/store";
import { unknownObjectType } from "@/constants/customTypes";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import {
  handleUrgentClaimPagination,
  handleUrgentClaimSort,
} from "@/reducers/_adjuster_reducers/UrgentClaimData/UrgentClaimSlice";

interface UrgentClaimTableProps {
  translate?: any;
}

const UrgentClaimTable: React.FC<connectorType & UrgentClaimTableProps> = (props) => {
  const { translate } = props;
  const {
    claimListData,
    currentPageNumber,
    totalClaims,
    claimErrorMsg,
    isFetching,
    handleUrgentClaimPagination,
    handleUrgentClaimSort,
  } = props;
  const pageLimit = PAGINATION_LIMIT_20;
  const [sorting, setSorting] = useState<SortingState>([]);

  type ClaimData = {
    claimNumber: string;
    adjusterName: string;
    claimStatus: string;
    contractedTimes: string;
    noOfItems: number;
    policyHolderName: string;
    createDate: string;
    elapsedTime: number;
    lastNote: unknownObjectType;
  };
  const pathList = [
    {
      name: translate?.urgentClaimTranslate?.urgentClaim?.home,
      path: "/adjuster-dashboard",
    },
    {
      name: translate?.urgentClaimTranslate?.urgentClaim?.claimsExceedingTimeLimits,
      path: "",
      active: true,
    },
  ];
  const columnHelper = createColumnHelper<ClaimData>();
  const columns = [
    columnHelper.accessor("claimNumber", {
      header: "Claim #",
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("claimStatus", {
      header: `Status`,
      cell: (status) => {
        return (
          <div style={{ width: "80px" }}>
            <span>{status.getValue() as React.ReactNode}</span>
          </div>
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("contractedTimes", {
      header: "Contracted End Time",
      cell: "Contracted Times",
      enableSorting: false,
    }),
    columnHelper.accessor("noOfItems", {
      header: "# of Items",
      cell: (noOfItems) => noOfItems.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("policyHolderName", {
      header: "Policyholder's Name",
      cell: (policyHolderName) => policyHolderName.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("createDate", {
      header: () => "Claim Date",
      cell: (createDate) => createDate.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("elapsedTime", {
      id: "elapsedTime",
      header: "Elapsed Time Days",
      cell: (elapsedTime) => elapsedTime.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("lastNote", {
      id: "lastNote",
      header: "Last Note",
      cell: (elapsedTime) => elapsedTime.getValue()?.message,
      enableSorting: false,
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: currentPageNumber - 1,
    pageSize: pageLimit,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const resetPage = () => {
    setPagination({
      pageIndex: 0,
      pageSize: pageLimit,
    });
  };

  const handleSorting = async (sortingUpdater: any) => {
    const newSortVal: SortingState = sortingUpdater(sorting);
    setSorting(newSortVal);
    resetPage();
    handleUrgentClaimSort(newSortVal[0]);
  };

  const handlePagination = async (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    const pageNumber = newPaginationValue.pageIndex + 1;
    handleUrgentClaimPagination({ pageNumber });
  };

  const table = useReactTable({
    data: claimListData,
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
    <div className="row">
      <div>
        <GenericBreadcrumb dataList={pathList} />
      </div>
      <hr className={urgentTableStyle.divider} />
      <div
        className={clsx("col-lg-12 col-md-12 col-12 m-2", urgentTableStyle.tableHeading)}
      >
        <label>{`${translate?.urgentClaimTranslate?.urgentClaim?.claimsExceedingTimeLimits} (${totalClaims})`}</label>
      </div>
      <div className={urgentTableStyle.claimTableContainer}>
        <CustomReactTable
          table={table}
          totalDataCount={totalClaims}
          pageLimit={pageLimit}
          loader={isFetching}
          tableDataErrorMsg={claimErrorMsg}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({
  urgentclaimdata: {
    urgentClaimListData,
    currentPageNumber,
    totalClaims,
    claimErrorMsg,
    isFetchingUrgentClaim,
  },
}: RootState) => ({
  claimListData: urgentClaimListData,
  currentPageNumber,
  totalClaims,
  claimErrorMsg,
  isFetching: isFetchingUrgentClaim,
});

const mapDispatchToProps = { handleUrgentClaimPagination, handleUrgentClaimSort };

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(UrgentClaimTable);
