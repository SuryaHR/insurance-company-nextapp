"use client";
import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";

import { useRouter } from "next/navigation";

import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import AllClaimTableComponentStyle from "./AllClaimTableComponent.module.scss";

import { useAppSelector } from "@/hooks/reduxCustomHook";
import {
  addFilterValues,
  addSelectedClaimId,
  fetchClaimListDataAction,
  fetchStatusList,
} from "@/reducers/_adjuster_reducers/ClaimData/ClaimSlice";

import CustomLoader from "@/components/common/CustomLoader/index";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { convertToCurrentTimezone } from "@/utils/helper";
import LimitedWidthContent from "@/components/common/LimitedWidthContent";

interface typeProps {
  [key: string | number]: any;
}

const AllClaimTableComponent: React.FC<connectorType & typeProps> = (props) => {
  const {
    claimListData,
    currentPageNumber,
    addSelectedClaimId,
    totalClaims,
    tableLoader,
    fetchClaimListDataAction,
    fetchStatusList,
    searchedPolicyname,
    statusIds,
    startDate,
    endDate,
    resetPagination,
    setResetPagination,
  } = props;
  const [claimResult, setClaimResult] = React.useState<any>();
  const router = useRouter();
  const fetching = useAppSelector(
    (state: any) => state?.claimdata?.allclaimListDatafetching
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  interface ClaimData {
    [key: string | number]: any;
  }

  useEffect(() => {
    if (resetPagination) {
      setPagination({ pageIndex: 0, pageSize: PAGINATION_LIMIT_20 });
      setResetPagination(false);
    }
  }, [resetPagination, setResetPagination]);

  useEffect(() => {
    if (claimListData?.length) {
      const modclaimListData = claimListData.reduce((prev: any, curr: any) => {
        let policyHolderName;
        if (curr.insuredDetails?.lastName && curr.insuredDetails?.firstName) {
          policyHolderName = `${curr.insuredDetails?.lastName}, ${curr.insuredDetails?.firstName}`;
        } else if (curr.insuredDetails?.lastName) {
          policyHolderName = `${curr.insuredDetails?.lastName}`;
        } else if (curr.insuredDetails?.firstName) {
          policyHolderName = `${curr.insuredDetails?.firstName}`;
        } else {
          policyHolderName = "";
        }

        const newObj = {
          claimNumber: curr.claimNumber,
          status: curr.status?.status,
          noOfItems: curr.noOfItems,
          noOfItemsPriced: curr.noOfItemsPriced,
          policyHoldersName: policyHolderName,
          claimDate: curr.createDate,
          lastActive: curr.lastActivity,
          lastUpdated: curr.lastUpdateDate,
          statusNumber: curr.status?.id,
          claimId: curr.claimId,
          claimType: curr.claimType,
          policyNumber: curr.policyNumber,
        };

        prev.push(newObj);
        return prev;
      }, []);
      setClaimResult(modclaimListData);
    }
  }, [claimListData]);

  const fetchClaimTableData = (params: any) => {
    fetchClaimListDataAction(params);
    fetchStatusList(null);
  };

  useEffect(() => {
    const params = {
      pagination: {
        pageNumber: 1,
        limit: 20,
        sortBy: "createDate",
        orderBy: "desc",
      },
      searchKeyword: "",
      statusIds: null,
    };
    fetchClaimListDataAction(params);
    fetchStatusList(null);
  }, [fetchClaimListDataAction, fetchStatusList]);

  const columnHelper = createColumnHelper<ClaimData>();

  const columns = [
    columnHelper.accessor("claimNumber", {
      header: () => `Claim #`,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("claimDate", {
      header: () => "Claim Date",
      cell: (info: any) => convertToCurrentTimezone(info.getValue(), "MM/DD/YYYY"),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("status", {
      header: () => "Status",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("lastActive", {
      header: () => "Last Activity",
      id: "lastActive",
      cell: (info) => (
        <div>
          <LimitedWidthContent text={info.renderValue()} limit={60} />
        </div>
      ),
      size: 385,
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("claimType", {
      header: () => "Type",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("policyHoldersName", {
      header: () => "Policyholder's Name",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("lastUpdated", {
      header: () => "Last Updated",
      cell: (info: any) => convertToCurrentTimezone(info.getValue(), "MM/DD/YYYY"),
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: currentPageNumber - 1,
    pageSize: PAGINATION_LIMIT_20,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const handleSorting = async (sortingUpdater: any) => {
    const newSortVal = sortingUpdater(sorting);
    setSorting(newSortVal);

    if (newSortVal.length > 0) {
      const orderBy = newSortVal[0].desc ? "desc" : "asc";
      const sortBy = newSortVal[0].id;
      const params = {
        filter: {
          startDate: startDate ?? null,
          endDate: endDate ?? null,
        },
        pagination: {
          pageNumber: pagination.pageIndex,
          limit: 20,
          sortBy: sortBy,
          orderBy: orderBy,
        },
        searchKeyword: searchedPolicyname ?? "",
        statusIds: statusIds ?? null,
      };
      fetchClaimTableData(params);
    } else if (newSortVal.length === 0 && claimListData.length > 0) {
      const params = {
        filter: {
          startDate: startDate ?? null,
          endDate: endDate ?? null,
        },
        pagination: {
          pageNumber: pagination.pageIndex,
          limit: 20,
          sortBy: "createDate",
          orderBy: "desc",
        },
        searchKeyword: searchedPolicyname ?? "",
        statusIds: statusIds ?? null,
      };
      fetchClaimTableData(params);
    }
  };

  const handlePagination = async (updaterFunction: any) => {
    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    const pageNumber = newPaginationValue.pageIndex + 1;

    if (sorting.length > 0) {
      const orderBy = sorting[0].desc ? "desc" : "asc";
      const sortBy = sorting[0].id;
      const params = {
        filter: {
          startDate: startDate ?? null,
          endDate: endDate ?? null,
        },
        pagination: {
          pageNumber: pageNumber,
          limit: 20,
          sortBy: sortBy,
          orderBy: orderBy,
        },
        searchKeyword: searchedPolicyname ?? "",
        statusIds: statusIds ?? null,
      };
      fetchClaimTableData(params);
    } else if (sorting.length === 0 && claimListData.length > 0) {
      const params = {
        filter: {
          startDate: startDate ?? null,
          endDate: endDate ?? null,
        },
        pagination: {
          pageNumber: pageNumber,
          limit: 20,
          sortBy: "createDate",
          orderBy: "desc",
        },
        searchKeyword: searchedPolicyname ?? "",
        statusIds: statusIds ?? null,
      };
      fetchClaimTableData(params);
    }
  };

  const handleRowClick = async (rowData: any) => {
    sessionStorage.setItem("claimNumber", rowData?.claimNumber);
    sessionStorage.setItem("claimId", rowData?.claimId);
    sessionStorage.setItem("PolicyNumber", rowData?.policyNumber);
    await addSelectedClaimId({
      claimId: rowData?.claimId,
    });
    router.push(`/adjuster-property-claim-details/${rowData?.claimId}`);
  };

  const table = useReactTable({
    data: claimResult,
    columns,
    pageCount: Math.ceil(totalClaims / PAGINATION_LIMIT_20),
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: handlePagination,
    onSortingChange: handleSorting,
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

  return (
    <div className={AllClaimTableComponentStyle.claimTableContainer}>
      {fetching && <CustomLoader />}
      {claimResult && (
        <CustomReactTable
          table={table}
          totalDataCount={totalClaims}
          tableDataErrorMsg={claimResult.length == 0 && "No Record Found"}
          showStatusColor={true}
          loader={tableLoader}
          handleRowClick={handleRowClick}
          pageLimit={PAGINATION_LIMIT_20}
        />
      )}
    </div>
  );
};

const mapStateToProps = ({ claimdata }: any) => ({
  claimListData: claimdata.allclaimListData,
  currentPageNumber: claimdata.allcurrentPageNumber,
  totalClaims: claimdata.alltotalClaims,
  claimErrorMsg: claimdata.claimErrorMsg,
  sortedIds: claimdata.statusIds,
});
const mapDispatchToProps = {
  addSelectedClaimId,
  addFilterValues,
  fetchClaimListDataAction,
  fetchStatusList,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(AllClaimTableComponent);
