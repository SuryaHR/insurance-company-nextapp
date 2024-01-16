"use client";
import React, { useEffect, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import GenericButton from "@/components/common/GenericButton/index";
import DetailListComponentStyle from "../DetailedInventoryList.module.scss";
import DetailedInventorySearchBox from "../DetailedInventorySearchBox/DetailedInventorySearchBox";
import { fetchDetailedInventoryAction } from "@/reducers/ContentsEvaluation/DetailedInventorySlice";
import { Tooltip } from "react-tooltip";
import {
  exportDetailedInventory,
  exportDetailedInventoryToPDF,
  sendDetailedInventory,
} from "../DetailedInventoryFucn";
import CustomLoader from "@/components/common/CustomLoader";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { contentsEvaluationTranslateType } from "@/translations/contentsEvaluationTranslate/en";
import useTranslation from "@/hooks/useTranslation";

type DetailedInventoryProps = {
  listData: Array<object>;
  fetchDetailedInventoryAction: any;
  detailedInventorySummaryData: any;
  isfetching: boolean;
};

interface detailedInventoryData {
  [key: string | number]: any;
}

function convertToDollar(value: any) {
  if (value) return `$${Number.parseFloat(value).toFixed(2)}`;
  else {
    return "$0.00";
  }
}

function convertToPercent(value: any) {
  if (value) return `${Number.parseFloat(value).toFixed(2)}`;
  else {
    return "0.00";
  }
}

interface listData {
  [key: string | number]: any;
}

const DetailedInventoryTable: React.FC<connectorType> = (
  props: DetailedInventoryProps
) => {
  const columnHelper = createColumnHelper<detailedInventoryData>();
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const {
    listData,
    fetchDetailedInventoryAction,
    detailedInventorySummaryData,
    isfetching,
  } = props;
  const [newData, setData] = useState<Array<typeof listData>>();
  const [openStatus, setOpenStatus] = useState(false);
  const [isExportfetching, setIsExportfetching] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const pageLimit = 20;
  const fetchSize = 20;
  const dispatch = useAppDispatch();
  const {
    loading,
    translate,
  }: { loading: boolean; translate: contentsEvaluationTranslateType | undefined } =
    useTranslation("contentsEvaluationTranslate");
  useEffect(() => {
    fetchDetailedInventoryAction({
      pageNo: 1,
      recordPerPage: 10,
      claimNum: claimNumber,
      sortBy: "",
      orderBy: "",
    });
  }, [claimNumber, fetchDetailedInventoryAction]);

  const handleSorting = async (sortingUpdater: any) => {
    setTableLoader(true);

    const newSortVal = sortingUpdater(sorting);
    setSorting(newSortVal);

    if (newSortVal.length > 0) {
      const orderBy = newSortVal[0].desc ? "desc" : "asc";
      const sortBy = newSortVal[0].id;
      console.log("orderBy, sortBy", orderBy, sortBy);
      const result = await fetchDetailedInventoryAction({
        pageNo: 1,
        recordPerPage: 10,
        claimNum: claimNumber,
        sortBy: sortBy,
        orderBy: orderBy,
      });
      if (result) {
        setTableLoader(false);
      }
    } else if (newSortVal.length === 0 && listData.length > 0) {
      const result = await fetchDetailedInventoryAction();
      if (result) {
        setTableLoader(false);
      }
    }
  };

  React.useEffect(() => {
    if (listData) {
      const defaultData: listData[] = [...listData];
      const recvData: any = [...defaultData.slice(0, fetchSize)];
      setData(recvData);
    }
  }, [listData]);

  const fetchNextPage = () => {
    if (newData) {
      const nextPageData = listData.slice(newData?.length, newData?.length + fetchSize);
      const recvData: any = [...newData, ...nextPageData];
      setData(recvData);
    }
    return true;
  };

  const columns = [
    columnHelper.accessor("itemNumber", {
      header: () => translate?.detailedInventory?.column?.item,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("room.roomName", {
      header: () => translate?.detailedInventory.column.room,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("originalItemDescription", {
      header: () => translate?.detailedInventory.column.originalDescription,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("ageInYears", {
      header: () => translate?.detailedInventory.column.age,
      cell: (props) => (
        <span>{`${
          props.row.original?.ageInYears ? `${props.row.original?.ageInYears}yr` : `0yr`
        } ${
          props.row.original?.ageInMonths ? `${props.row.original?.ageInMonths}m` : `0m`
        }`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("quantity", {
      header: () => translate?.detailedInventory.column.quantity,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("totalPrice", {
      header: () => translate?.detailedInventory.column.totalPrice,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(detailedInventorySummaryData.totalPrice)}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("categoryDetails.name", {
      header: () => translate?.detailedInventory.column.category,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("status.status", {
      header: () => translate?.detailedInventory.column.status,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("itemLimit", {
      header: () => translate?.detailedInventory.column.individualLimit,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("replacementItemDescription", {
      header: () => translate?.detailedInventory.column.replacementDescription,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("webSource", {
      header: () => translate?.detailedInventory.column.source,
      cell: (info: any) => <a href={info.getValue()}>{info.getValue()}</a>,
      enableSorting: true,
    }),
    columnHelper.accessor("replacementTotalCost", {
      header: () => translate?.detailedInventory.column.replacementCost,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData.totalReplacementCost
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("replacementExposure", {
      header: () => translate?.detailedInventory.column.replacementExposure,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData.totalReplacementExposure
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("depreciationPercent", {
      header: () => translate?.detailedInventory.column.annualDep,
      cell: (info: any) =>
        info.getValue() && <span>{`${convertToPercent(info.getValue())}%`}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("depreciationAmount", {
      header: () => translate?.detailedInventory.column.depreciation$,
      cell: (info: any) =>
        info.getValue() && <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData.totalDepreciationAmount
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("cashPayoutExposure", {
      header: () => translate?.detailedInventory.column.cashExposure,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData.totalCashPayoutExposure
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("maxHoldover", {
      header: () => translate?.detailedInventory.column.maxRecoverableDepreciation,
      cell: (info: any) => <span> {`${convertToDollar(info.getValue())}`} </span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData.totalMaxRecoverableDepreciation
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("itemOverage", {
      header: () => translate?.detailedInventory.column.itemOverage,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(detailedInventorySummaryData.totalItemOverage)}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("settlementExposure", {
      header: () => translate?.detailedInventory.column.settlementExposure,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData.totalSettlementExposure
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("settlementComment", {
      header: () => translate?.detailedInventory.column.comments,
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("holdOverPaid", {
      header: () => translate?.detailedInventory.column.holdoverPaid,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>
          {`${convertToDollar(detailedInventorySummaryData.totalHoldOverPaid)}`}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("settlementValue", {
      header: () => translate?.detailedInventory.column.amountPaid,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(detailedInventorySummaryData.paidToInsured)}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("holdOverDue", {
      header: () => translate?.detailedInventory.column.holdoverDue,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(detailedInventorySummaryData.totalHoldOverDue)}`}</span>
      ),
      enableSorting: true,
    }),
  ];

  const table = useReactTable({
    data: newData || [],
    columns,
    pageCount: Math.ceil(listData?.length / pageLimit),
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
  if (loading) {
    return (
      <div className="col-12 d-flex flex-column position-relative">
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }
  return (
    <div>
      <div className={DetailListComponentStyle.detailListContainer}>
        <div
          className={`row col-12 ${DetailListComponentStyle.detailListContentContainer}`}
        >
          <div className="col-md-9 col-sm-12 col-xs-12 col-lg-9 d-flex ps-0 mx-3">
            <div
              className={`row col-11 ${DetailListComponentStyle.contentListButtonDiv}`}
            >
              <Tooltip
                anchorSelect="#export-as"
                place="bottom"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: "0px",
                  zIndex: "999",
                  boxShadow: "2px 2px 2px 2px #888888",
                }}
                hidden={!openStatus}
                openOnClick={true}
                clickable={true}
              >
                <div className="p-0">
                  <div
                    className={DetailListComponentStyle.dropDownInnerDiv}
                    onClick={async () => {
                      setIsExportfetching(true);
                      const status = await exportDetailedInventory(claimNumber, "excel");
                      if (status === "success") {
                        setIsExportfetching(false);
                        dispatch(
                          addNotification({
                            message: "Successfully download the excel!",
                            id: "good",
                            status: "success",
                          })
                        );
                      } else if (status === "error") {
                        setIsExportfetching(false);
                        dispatch(
                          addNotification({
                            message: "Failed to export the details. Please try again..",
                            id: "error",
                            status: "error",
                          })
                        );
                      }
                    }}
                  >
                    {translate?.detailedInventory?.excelText}
                  </div>
                  <div
                    className={DetailListComponentStyle.dropDownInnerDiv}
                    onClick={async () => {
                      setIsExportfetching(true);
                      const status = await exportDetailedInventoryToPDF(claimNumber);
                      if (status === "success") {
                        setIsExportfetching(false);
                        dispatch(
                          addNotification({
                            message: "Successfully download the PDF!",
                            id: "good",
                            status: "success",
                          })
                        );
                      } else if (status === "error") {
                        setIsExportfetching(false);
                        dispatch(
                          addNotification({
                            message: "Failed to export the details. Please try again..",
                            id: "error",
                            status: "error",
                          })
                        );
                      }
                    }}
                  >
                    {translate?.detailedInventory?.pdfText}
                  </div>
                </div>
              </Tooltip>
              {isExportfetching && <CustomLoader />}
              <GenericButton
                label={translate?.detailedInventory?.exportAs || ""}
                theme="normal"
                size="small"
                type="submit"
                btnClassname={DetailListComponentStyle.contentListBtn}
                id="export-as"
                onClick={() => {
                  setOpenStatus(!openStatus);
                }}
              />
              <GenericButton
                label={translate?.detailedInventory?.emailPolicyholder || ""}
                theme="normal"
                size="small"
                type="submit"
                onClick={async () => {
                  setIsExportfetching(true);
                  const data: any = await sendDetailedInventory(claimNumber);
                  if (data && data.status === 200) {
                    setIsExportfetching(false);
                    dispatch(
                      addNotification({
                        message: data.message,
                        id: "good",
                        status: "success",
                      })
                    );
                  } else {
                    setIsExportfetching(false);
                    dispatch(
                      addNotification({
                        message: "Failed to send the PDF!",
                        id: "good",
                        status: "error",
                      })
                    );
                  }
                }}
                btnClassname={DetailListComponentStyle.contentListBtn}
              />
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 align-items-center">
              <DetailedInventorySearchBox setTableLoader={setTableLoader} />
            </div>
          </div>
        </div>
      </div>
      <div className={DetailListComponentStyle.DetailedInventoryTableScrollContainer}>
        {isfetching ? (
          <CustomLoader />
        ) : (
          <CustomReactTable
            table={table}
            totalDataCount={listData?.length}
            loader={tableLoader}
            tableDataErrorMsg={!listData && translate?.detailedInventory?.noRecords}
            fetchNextPage={fetchNextPage}
            totalFetched={newData?.length}
            totalDBRowCount={listData?.length}
            showFooter={true}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  listData: state.detailedInventorydata?.detailedInventoryListDataFull,
  isfetching: state.detailedInventorydata?.detailedInventoryfetching,
  detailedInventorySummaryData: state.detailedInventorydata?.detailedInventorySummaryData,
});

const mapDispatchToProps = {
  fetchDetailedInventoryAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(DetailedInventoryTable);
