"use client";
import React from "react";
import OpenClaimTableStyle from "./OpenClaimTable.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { fetchClaimList } from "@/services/ClaimService";
import { convertToCurrentTimezone } from "@/utils/helper";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
  getFilteredRowModel,
  ColumnFiltersState,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { useRouter } from "next/navigation";
import { addSelectedClaimId, addFilterValues } from "@/reducers/ClaimData/ClaimSlice";

interface typeProps {
  [key: string | number]: any;
}
const OpenClaimTable: React.FC<connectorType & typeProps> = (props) => {
  const {
    claimListData,
    currentPageNumber,
    setTableLoader,
    addSelectedClaimId,
    totalClaims,
    tableLoader,
    claimErrorMsg,
    addFilterValues,
  } = props;
  const [claimResult, setClaimResult] = React.useState(claimListData);
  const router = useRouter();

  const pageLimit = 20;

  // type ClaimData = {
  //   claimNumber: string;
  //   status: string;
  //   noOfItems: number;
  //   noOfItemsPriced: number;
  //   policyHoldersName: string;
  //   claimDate: Date;
  //   lastActive: string;
  //   lastUpdated: string;
  // };

  interface ClaimData {
    [key: string | number]: any;
  }
  React.useEffect(() => {
    const defaultData: ClaimData[] = [...claimListData];
    setClaimResult([...defaultData]);
  }, [claimListData]);

  const columnHelper = createColumnHelper<ClaimData>();

  const columns = [
    columnHelper.accessor("claimNumber", {
      id: "Claim_Number",
      header: () => `Claim #`,
      cell: (info) => info.getValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("policyHoldersName", {
      id: "Insured_Name",
      header: () => <span>{`PolicyHolder's Name`}</span>,
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("claimDate", {
      id: "Create_Date",
      header: "Claim Date",
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
    columnHelper.accessor((row) => row.status, {
      id: "Status",
      cell: (status) => {
        return (
          <div style={{ width: "80px" }}>
            <span>{status.getValue() as React.ReactNode}</span>
          </div>
        );
      },
      header: () => <span>Status</span>,
      enableSorting: true,
      size: 100,
    }),
    columnHelper.accessor("noOfItems", {
      id: "itemNumber",
      header: () => `# of Items`,
      cell: (info) => info.renderValue(),
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("noOfItemsPriced", {
      header: () => `# of Items Priced`,
      cell: (info) => info.renderValue(),
      enableSorting: false,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("lastActive", {
      header: "Last Active",
      enableSorting: false,
      size: 450,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("lastUpdated", {
      id: "Last_Update_Date",
      header: "Last Updated",
      cell: (info) => {
        if (info.renderValue()) {
          const unixDate = Date.parse(info.renderValue().replace("T", " "));
          const formatedDate = convertToCurrentTimezone(unixDate, "MM/DD/YYYY h:mm A");
          return formatedDate;
        }
        return null;
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: currentPageNumber - 1,
    pageSize: pageLimit,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const handleSorting = async (sortingUpdater: any) => {
    setTableLoader(true);

    const newSortVal = sortingUpdater(sorting);
    setSorting(newSortVal);

    if (newSortVal.length > 0) {
      const orderBy = newSortVal[0].desc ? "desc" : "asc";
      const sortBy = newSortVal[0].id;
      const result = await fetchClaimList(1, pageLimit, sortBy, orderBy);
      if (result) {
        setTableLoader(false);
      }
    } else if (newSortVal.length === 0 && claimListData.length > 0) {
      const result = await fetchClaimList();
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const handlePagination = async (updaterFunction: any) => {
    setTableLoader(true);

    const newPaginationValue = updaterFunction(pagination);
    setPagination(newPaginationValue);
    const pageNumber = newPaginationValue.pageIndex + 1;

    if (sorting.length > 0) {
      const orderBy = sorting[0].desc ? "desc" : "asc";
      const sortBy = sorting[0].id;
      const result = await fetchClaimList(pageNumber, pageLimit, sortBy, orderBy);
      if (result) {
        setTableLoader(false);
      }
    } else if (sorting.length === 0 && claimListData.length > 0) {
      const result = await fetchClaimList(pageNumber);
      if (result) {
        setTableLoader(false);
      }
    }
  };
  const handleRowClick = async (rowData: any) => {
    sessionStorage.setItem("claimNumber", rowData?.claimNumber);
    sessionStorage.setItem("claimId", rowData?.claimId);
    await addSelectedClaimId({
      claimId: rowData?.claimId,
    });
    router.push(`/adjuster-property-claim-details/${rowData?.claimId}`);
  };

  const customFilterValues = [
    {
      name: "3rd Party Vendor",
      value: 3,
    },
    {
      name: "Created",
      value: 1,
    },
    {
      name: "Supervisor Approval",
      value: 5,
    },
    {
      name: "Work In Progress",
      value: 2,
    },
  ];
  const filterFn = async (values: any) => {
    setTableLoader(true);

    let selectedValues: any = [];
    if (values.length > 0) {
      customFilterValues.map((item) => {
        if (values.includes(item.name)) {
          selectedValues.push(item.value);
        }
      });
    } else {
      selectedValues = [];
    }

    addFilterValues({ statusIds: selectedValues });
    const result = await fetchClaimList(1, 20, "createDate", "desc", "", selectedValues);
    if (result) {
      setTableLoader(false);
    }
  };
  const table = useReactTable({
    data: claimResult,
    columns,
    pageCount: Math.ceil(totalClaims / pageLimit),
    state: {
      sorting,
      pagination,
      columnFilters,
    },
    onPaginationChange: handlePagination,
    onSortingChange: handleSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
  });

  return (
    <div className={OpenClaimTableStyle.claimTableContainer}>
      <CustomReactTable
        table={table}
        totalDataCount={totalClaims}
        pageLimit={pageLimit}
        showStatusColor={true}
        loader={tableLoader}
        tableDataErrorMsg={claimErrorMsg}
        handleRowClick={handleRowClick}
        filterFn={filterFn}
        customFilterValues={customFilterValues}
      />
    </div>
  );
};

const mapStateToProps = ({ claimdata }: any) => ({
  claimListData: claimdata.claimListData,
  currentPageNumber: claimdata.currentPageNumber,
  totalClaims: claimdata.totalClaims,
  claimErrorMsg: claimdata.claimErrorMsg,
  sortedIds: claimdata.statusIds,
});
const mapDispatchToProps = {
  addSelectedClaimId,
  addFilterValues,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(OpenClaimTable);
