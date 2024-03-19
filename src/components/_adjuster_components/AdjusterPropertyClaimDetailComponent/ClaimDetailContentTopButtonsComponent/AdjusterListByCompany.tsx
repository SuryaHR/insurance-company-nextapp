"use client";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import adjusterListByCompanyStyle from "./top-button.module.scss";

import { useAppSelector } from "@/hooks/reduxCustomHook";
import {
  getAdjusterByCompanyIdRdcr,
  updateReassignAdjusterRdcr,
} from "@/reducers/_adjuster_reducers/ClaimData/ClaimDetailsBtnSlice";
import selectCompanyId from "@/reducers/Session/Selectors/selectCompanyId";
import { RootState } from "@/store/store";

import CustomLoader from "@/components/common/CustomLoader/index";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";

import AdjusterByCompanySearch from "./AdjusterByCompanySearch/AdjusterByCompanySearch";

type Props = {
  getAdjusterByCompanyIdRdcr: any;
  updateReassignAdjusterRdcr: any;
  adjusterListByCompanyItemsData: any;
  adjusterListByCompanyItemsfetching: any;
  reassignAdjusterfetching: any;
  reassignAdjusterData: any;
  searchAdjusterKeyword: string;
  setAdjusterRowData: any;
  adjusterRowData: any;
  ModalFooter: any;
};

interface AdjusterList {
  [key: string | number]: any;
}

const AdjusterListByCompany = (props: Props) => {
  const {
    getAdjusterByCompanyIdRdcr,
    adjusterListByCompanyItemsData,
    searchAdjusterKeyword,
    adjusterListByCompanyItemsfetching,
    setAdjusterRowData,
    adjusterRowData,
    ModalFooter,
  } = props;

  const columnHelper = createColumnHelper<AdjusterList>();
  const [newData, setData] = useState<Array<typeof adjusterListByCompanyItemsData>>();
  const [tableLoader] = React.useState<boolean>(false);
  const [isfetching, setIsfetching] = React.useState<boolean>(true);
  const recvCompanyId = useAppSelector(selectCompanyId);
  const pageLimit = PAGINATION_LIMIT_20;
  const fetchSize = 50;

  useEffect(() => {
    getAdjusterByCompanyIdRdcr({
      companyId: recvCompanyId,
    });
  }, [getAdjusterByCompanyIdRdcr, recvCompanyId]);

  useEffect(() => {
    setIsfetching(adjusterListByCompanyItemsfetching);
  }, [adjusterListByCompanyItemsfetching]);

  const fetchNextPage = () => {
    if (newData) {
      const nextPageData = adjusterListByCompanyItemsData.slice(
        newData?.length,
        newData?.length + fetchSize
      );
      const recvData: any = [...newData, ...nextPageData];
      setData(recvData);
    }
    return true;
  };

  React.useEffect(() => {
    if (adjusterListByCompanyItemsData) {
      const defaultData: typeof adjusterListByCompanyItemsData = [
        ...adjusterListByCompanyItemsData,
      ];
      const recvData: any = [...defaultData.slice(0, fetchSize)];
      setData(recvData);
    }
  }, [adjusterListByCompanyItemsData]);

  const columns = [
    columnHelper.accessor("select", {
      cell: ({ row }: { row: any }) => (
        <input
          type="radio"
          defaultChecked={row.original.userId == adjusterRowData?.userId}
          onClick={() => {
            handleRowClick(row.original);
          }}
        />
      ),
      header: () => "",
    }),
    columnHelper.accessor("name", {
      cell: (props: any) => (
        <span>{`${props.row.original?.firstName} ${props.row.original?.lastName}`}</span>
      ),
      header: () => "Name",
      enableSorting: true,
    }),
    columnHelper.accessor("designation.name", {
      cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => "Designation",
      enableSorting: true,
    }),
    columnHelper.accessor("casesInHand", {
      cell: (info: any) => info.getValue(),
      header: () => "#Claims In Hand ",
      enableSorting: true,
    }),
  ];
  const table = useReactTable({
    data: newData || [],
    columns,
    pageCount: Math.ceil(adjusterListByCompanyItemsData?.length / pageLimit),
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
    enableColumnFilters: false,
  });

  const handleRowClick = (rowData: any) => {
    setAdjusterRowData(rowData);
  };

  const filterObjectsByValue = useCallback((array: any, searchString: string) => {
    return array.filter((Obj: any) =>
      Object.keys(Obj).some(
        (value) =>
          typeof Obj[value] === "string" &&
          Obj[value].toLowerCase().includes(searchString.toLowerCase())
      )
    );
  }, []);

  useEffect(() => {
    if (searchAdjusterKeyword) {
      const filteredObjects = filterObjectsByValue(
        adjusterListByCompanyItemsData,
        searchAdjusterKeyword
      );
      setData(filteredObjects);
    } else {
      const defaultData: typeof adjusterListByCompanyItemsData = [
        ...adjusterListByCompanyItemsData,
      ];
      const recvData: any = [...defaultData.slice(0, fetchSize)];
      setData(recvData);
    }
  }, [searchAdjusterKeyword, filterObjectsByValue, adjusterListByCompanyItemsData]);

  return (
    <>
      <div className={adjusterListByCompanyStyle.AdjusterListTableScrollContainer}>
        <AdjusterByCompanySearch />
        {isfetching ? (
          <CustomLoader />
        ) : (
          <CustomReactTable
            table={table}
            totalDataCount={adjusterListByCompanyItemsData?.length}
            loader={tableLoader}
            showPaginationButtons={false}
            tableDataErrorMsg={!adjusterListByCompanyItemsData && "No Record Found"}
            fetchNextPage={fetchNextPage}
            totalFetched={newData?.length}
            totalDBRowCount={adjusterListByCompanyItemsData?.length}
            tableCustomClass={adjusterListByCompanyStyle.tableContainer}
          />
        )}
      </div>
      <div className="col-md-12 col-sm-12">
        <span className={`text-danger  ${adjusterListByCompanyStyle.dangerText}`}>
          *Click to select the adjuster
        </span>
      </div>
      <ModalFooter />
    </>
  );
};

const mapStateToProps = ({ ClaimDetailsBtn }: RootState) => ({
  adjusterListByCompanyItemsData: ClaimDetailsBtn.adjusterListByCompanyItemsData,
  adjusterListByCompanyItemsfetching: ClaimDetailsBtn.adjusterListByCompanyItemsfetching,
  reassignAdjusterfetching: ClaimDetailsBtn.reassignAdjusterfetching,
  reassignAdjusterData: ClaimDetailsBtn.reassignAdjusterData,
  searchAdjusterKeyword: ClaimDetailsBtn.searchAdjusterKeyword,
});

const mapDispatchToProps = {
  getAdjusterByCompanyIdRdcr,
  updateReassignAdjusterRdcr,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AdjusterListByCompany);
