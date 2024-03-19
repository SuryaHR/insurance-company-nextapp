"use client";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import AssignmentContentListStyle from "./AssignmentContentListStyle.module.scss";
import { fetchVendorAssignmentItems } from "@/reducers/_adjuster_reducers/VendorAssignment/AssignmentDetailsSlice";
import { RootState } from "@/store/store";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import { getCategories } from "@/services/_adjuster_services/ClaimService";
import { searchVendorAssignmentList } from "@/services/_adjuster_services/VendorAssignmentDetailsService";
import { getUSDCurrency } from "@/utils/utitlity";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import LimitedWidthContent from "@/components/common/LimitedWidthContent";

type AssignmentContentListProps = {
  vendorAssignmentItemsData: Array<object>;
  fetchVendorAssignmentItems: any;
  vendorAssignmentItemsfetching: boolean;
  searchKeyword: string;
  assignmentId: string;
};

interface detailedInventoryData {
  [key: string | number]: any;
}

interface vendorAssignmentItemsData {
  [key: string | number]: any;
}

const AssignmentContentList = (props: AssignmentContentListProps) => {
  const columnHelper = createColumnHelper<detailedInventoryData>();
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const {
    vendorAssignmentItemsData,
    fetchVendorAssignmentItems,
    vendorAssignmentItemsfetching,
    searchKeyword,
  } = props;
  const [newData, setData] = useState<Array<typeof vendorAssignmentItemsData>>();
  const [, setCategory] = useState();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const pageLimit = 20;
  const fetchSize = 20;

  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  useEffect(() => {
    async function fetchCategories() {
      const categoryListRes: any = await getCategories();
      setCategory(categoryListRes.data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchVendorAssignmentItems({
      assignmentNumber: props.assignmentId,
      vrn: "ARTGMCONTS",
    });
  }, [claimNumber, fetchVendorAssignmentItems, props.assignmentId]);

  const handleSorting = async (sortingUpdater: any) => {
    setTableLoader(true);

    const newSortVal = sortingUpdater(sorting);
    setSorting(newSortVal);

    if (newSortVal.length > 0) {
      const result = await fetchVendorAssignmentItems({
        assignmentNumber: props.assignmentId,
        vrn: "ARTGMCONTS",
      });
      if (result) {
        setTableLoader(false);
      }
    } else if (newSortVal.length === 0 && vendorAssignmentItemsData.length > 0) {
      const result = await fetchVendorAssignmentItems();
      if (result) {
        setTableLoader(false);
      }
    }
  };

  useEffect(() => {
    searchVendorAssignmentList(searchKeyword);
  }, [searchKeyword]);

  useEffect(() => {
    if (vendorAssignmentItemsData) {
      const defaultData: vendorAssignmentItemsData[] = [...vendorAssignmentItemsData];
      const recvData: any = [...defaultData.slice(0, fetchSize)];
      setData(recvData);
    }
  }, [vendorAssignmentItemsData]);

  const fetchNextPage = () => {
    if (newData) {
      const nextPageData = vendorAssignmentItemsData.slice(
        newData?.length,
        newData?.length + fetchSize
      );
      const recvData: any = [...newData, ...nextPageData];
      setData(recvData);
    }
    return true;
  };

  const columns = [
    columnHelper.accessor("claimItem.itemNumber", {
      header: () => "Item #",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.description", {
      header: () => "Description",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.status.status", {
      header: () => "Status",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.category.name", {
      header: () => "Category",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.ageYears", {
      header: () => "Age",
      cell: (props) => (
        <span>{`${
          props.row.original?.claimItem.ageYears
            ? `${props.row.original?.claimItem.ageYears}yr`
            : `0yr`
        } ${
          props.row.original?.claimItem.ageMonths
            ? `${props.row.original?.claimItem.ageMonths}m`
            : `0m`
        }`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.quantity", {
      header: () => "Qty",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.totalStatedAmount", {
      header: () => "Total Value",
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      enableSorting: true,
    }),
    columnHelper.accessor("vendorAssociate.lastName", {
      header: () => "Assigned To",
      cell: (props) => {
        const lastname = props.row.original?.vendorAssociate?.lastName;
        const firstname = props.row.original?.vendorAssociate?.firstName;
        return <span>{`${lastname ?? ""}${lastname ? "," : ""}${firstname ?? ""}`}</span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.adjusterDescription", {
      header: () => "Replacement Description",
      cell: (info) => (
        <div>
          <LimitedWidthContent text={info.renderValue()} limit={60} />
        </div>
      ),
      size: 385,
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.rcvTotal", {
      header: () => (
        <div className={`${AssignmentContentListStyle?.textLeft}`}>
          Replacement
          <br />
          Cost
        </div>
      ),
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.depreciationAmount", {
      header: () => "Depreciation",
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      enableSorting: true,
    }),
    columnHelper.accessor("claimItem.acv", {
      header: () => "ACV",
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      enableSorting: true,
    }),
    columnHelper.accessor("replacementExposure", {
      header: () => "MER",
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      enableSorting: true,
    }),
  ];

  const table = useReactTable({
    data: newData || [],
    columns,
    pageCount: Math.ceil(vendorAssignmentItemsData?.length / pageLimit),
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    onSortingChange: handleSorting,
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
    enableColumnFilters: false,
  });

  const [tableLoader, setTableLoader] = React.useState<boolean>(false);

  return (
    <div>
      <GenericComponentHeading
        title={`Contents List (${vendorAssignmentItemsData?.length})`}
      ></GenericComponentHeading>
      <div className={AssignmentContentListStyle.detailListContainer}>
        <div
          className={`row col-12 ${AssignmentContentListStyle.detailListContentContainer} justify-content-end`}
        >
          <div className="col-md-9 col-sm-12 col-xs-12 col-lg-9 d-flex justify-content-end ps-0 mx-3"></div>
        </div>
      </div>
      <div className={AssignmentContentListStyle.AssignmentContentListScrollContainer}>
        {vendorAssignmentItemsfetching === false && (
          <CustomReactTable
            table={table}
            totalDataCount={vendorAssignmentItemsData?.length}
            loader={tableLoader}
            tableDataErrorMsg={
              !vendorAssignmentItemsData &&
              translate?.contentsEvaluationTranslate?.detailedInventory?.noRecords
            }
            fetchNextPage={fetchNextPage}
            totalFetched={newData?.length}
            totalDBRowCount={vendorAssignmentItemsData?.length}
            showFooter={true}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  vendorAssignmentItemsData: state.assignmentDetailsData?.vendorAssignmentItemsData,
  vendorAssignmentItemsfetching:
    state.assignmentDetailsData?.vendorAssignmentItemsfetching,
  searchKeyword: state.assignmentDetailsData?.searchKeyword,
});

const mapDispatchToProps = {
  fetchVendorAssignmentItems,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AssignmentContentList);
