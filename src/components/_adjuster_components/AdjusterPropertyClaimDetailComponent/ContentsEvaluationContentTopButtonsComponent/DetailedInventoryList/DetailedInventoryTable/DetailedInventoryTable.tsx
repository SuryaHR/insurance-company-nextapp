"use client";
import React, { useContext, useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { connect, ConnectedProps } from "react-redux";
import { Tooltip } from "react-tooltip";

import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import DetailListComponentStyle from "../DetailedInventoryList.module.scss";

import { useAppDispatch } from "@/hooks/reduxCustomHook";
import {
  fetchDetailedInventoryAction,
  fetchSubCategories,
} from "@/reducers/_adjuster_reducers/ContentsEvaluation/DetailedInventorySlice";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { RootState } from "@/store/store";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";

import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import CustomLoader from "@/components/common/CustomLoader";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import GenericButton from "@/components/common/GenericButton/index";

import {
  exportDetailedInventory,
  exportDetailedInventoryToPDF,
  sendDetailedInventory,
} from "../DetailedInventoryFucn";
import DetailedInventorySearchBox from "../DetailedInventorySearchBox/DetailedInventorySearchBox";
import { getDepreciationRate } from "./TableFunc";
import LimitedWidthContent from "@/components/common/LimitedWidthContent";

type DetailedInventoryProps = {
  listData: Array<object>;
  fetchDetailedInventoryAction: any;
  fetchSubCategories: any;
  detailedInventorySummaryData: any;
  isfetching: boolean;
  searchKeyword: string;
  subCategoriesData: any;
};

interface detailedInventoryData {
  replacementItemDescription: any;
  [key: string | number]: any;
}

function convertToDollar(value: any) {
  if (value) return `$${Number.parseFloat(value).toFixed(2)}`;
  else {
    return "$0.00";
  }
}

interface listData {
  [key: string | number]: any;
}

const DetailedInventoryTable: React.FC<connectorType> = (
  props: DetailedInventoryProps
) => {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const columnHelper = createColumnHelper<detailedInventoryData>();
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const {
    listData,
    fetchDetailedInventoryAction,
    detailedInventorySummaryData,
    isfetching,
    searchKeyword,
    fetchSubCategories,
    subCategoriesData,
  } = props;
  const [newData, setData] = useState<Array<typeof listData>>();
  const [openStatus, setOpenStatus] = useState(false);
  const [isExportfetching, setIsExportfetching] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const pageLimit = 20;
  const fetchSize = 20;
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchDetailedInventoryAction({
      pageNo: 1,
      recordPerPage: 10,
      claimNum: claimNumber,
      sortBy: "",
      orderBy: "",
      q: "",
    });
  }, [claimNumber, fetchDetailedInventoryAction]);

  const handleSorting = async (sortingUpdater: any) => {
    setTableLoader(true);

    const newSortVal = sortingUpdater(sorting);
    setSorting(newSortVal);

    if (newSortVal.length > 0) {
      const orderBy = newSortVal[0].desc ? "desc" : "asc";
      const sortBy = newSortVal[0].id;
      const result = await fetchDetailedInventoryAction({
        pageNo: 1,
        recordPerPage: 10,
        claimNum: claimNumber,
        sortBy: sortBy,
        orderBy: orderBy,
        q: "",
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

  useEffect(() => {
    fetchDetailedInventoryAction({
      pageNo: 1,
      recordPerPage: 10,
      claimNum: claimNumber,
      sortBy: "",
      orderBy: "",
      q: searchKeyword,
    });
    fetchSubCategories();
  }, [searchKeyword, fetchDetailedInventoryAction, fetchSubCategories, claimNumber]);

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

  const columns: any = [
    columnHelper.accessor("itemNumber", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.item,
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("room.roomName", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.room,
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("originalItemDescription", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column
          ?.originalDescription,
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("ageInYears", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.age,
      cell: (props) => (
        <span>{`${
          props.row.original?.ageInYears ? `${props.row.original?.ageInYears}yr` : `0yr`
        } ${
          props.row.original?.ageInMonths ? `${props.row.original?.ageInMonths}m` : `0m`
        }`}</span>
      ),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("quantity", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.quantity,
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("totalPrice", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.totalPrice,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(detailedInventorySummaryData.totalPrice)}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("categoryDetails.name", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.category,
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("status.status", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.status,
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("itemLimit", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column
          ?.individualLimit,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("replacementItemDescription", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column
          ?.replacementDescription,
      cell: (info) => (
        <div>
          <LimitedWidthContent text={info.renderValue()} limit={60} />
        </div>
      ),
      size: 385,
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("webSource", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.source,
      cell: (info) => (
        <div>
          <a>
            <LimitedWidthContent text={info.renderValue()} limit={60} />
          </a>
        </div>
      ),
      size: 385,
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("replacementTotalCost", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column
          ?.replacementCost,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData?.totalReplacementCost
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("replacementExposure", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column
          ?.replacementExposure,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData?.totalReplacementExposure
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("depreciationPercent", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.annualDep,
      cell: ({ row }) => getDepreciationRate(row?.original, subCategoriesData),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("depreciationAmount", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.depreciation$,
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
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.cashExposure,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData.totalCashPayoutExposure
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("maxHoldover", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column
          ?.maxRecoverableDepreciation,
      cell: (info: any) => <span> {`${convertToDollar(info.getValue())}`} </span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData?.totalMaxRecoverableDepreciation
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("itemOverage", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.itemOverage,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData?.totalItemOverage
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("settlementExposure", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column
          ?.settlementExposure,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData?.totalSettlementExposure
        )}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("settlementComment", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.comments,
      cell: (info: any) => info.getValue(),
      footer: () => {
        return <span></span>;
      },
      enableSorting: true,
    }),
    columnHelper.accessor("holdOverPaid", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.holdoverPaid,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>
          {`${convertToDollar(detailedInventorySummaryData?.totalHoldOverPaid)}`}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("settlementValue", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.amountPaid,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(detailedInventorySummaryData?.paidToInsured)}`}</span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("holdOverDue", {
      header: () =>
        translate?.contentsEvaluationTranslate?.detailedInventory?.column?.holdoverDue,
      cell: (info: any) => <span>{`${convertToDollar(info.getValue())}`}</span>,
      footer: () => (
        <span>{`${convertToDollar(
          detailedInventorySummaryData?.totalHoldOverDue
        )}`}</span>
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

  return (
    <div>
      <div className={DetailListComponentStyle.detailListContainer}>
        <div
          className={`row col-12 ${DetailListComponentStyle.detailListContentContainer}`}
        >
          <div className="col-md-4 col-sm-12 col-12 col-lg-9 d-flex ps-0">
            <div className={` ${DetailListComponentStyle.contentListButtonDiv}`}>
              {isExportfetching && <CustomLoader />}
              <div className={DetailListComponentStyle.OutsideClickHandlerDiv}>
                <OutsideClickHandler
                  onOutsideClick={() => {
                    setOpenStatus(false);
                  }}
                >
                  <Tooltip
                    anchorSelect="#export-as"
                    place="bottom"
                    isOpen={openStatus}
                    hidden={!openStatus}
                    openOnClick={true}
                    clickable={true}
                    className={DetailListComponentStyle.toolTipClass}
                  >
                    <div className="p-0">
                      <div
                        className={DetailListComponentStyle.dropDownInnerDiv}
                        onClick={async () => {
                          setIsExportfetching(true);
                          const status = await exportDetailedInventory(
                            claimNumber,
                            "excel"
                          );
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
                                message:
                                  "Failed to export the details. Please try again..",
                                id: "error",
                                status: "error",
                              })
                            );
                          }
                        }}
                      >
                        {
                          translate?.contentsEvaluationTranslate?.detailedInventory
                            ?.excelText
                        }
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
                                message:
                                  "Failed to export the details. Please try again..",
                                id: "error",
                                status: "error",
                              })
                            );
                          }
                        }}
                      >
                        {
                          translate?.contentsEvaluationTranslate?.detailedInventory
                            ?.pdfText
                        }
                      </div>
                    </div>
                  </Tooltip>
                  <GenericButton
                    label={
                      translate?.contentsEvaluationTranslate?.detailedInventory
                        ?.exportAs || ""
                    }
                    theme="normal"
                    size="small"
                    type="submit"
                    btnClassname={DetailListComponentStyle.contentListBtn}
                    id="export-as"
                    onClick={() => {
                      setOpenStatus(!openStatus);
                    }}
                  />
                </OutsideClickHandler>
              </div>
              <GenericButton
                label={
                  translate?.contentsEvaluationTranslate?.detailedInventory
                    ?.emailPolicyholder || ""
                }
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
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 pe-0">
            <DetailedInventorySearchBox setTableLoader={setTableLoader} />
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
            tableDataErrorMsg={
              !listData &&
              translate?.contentsEvaluationTranslate?.detailedInventory?.noRecords
            }
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
  subCategoriesData: state.detailedInventorydata?.subCategoriesData,
  searchKeyword: state.detailedInventorydata.searchKeyword,
});

const mapDispatchToProps = {
  fetchDetailedInventoryAction,
  fetchSubCategories,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(DetailedInventoryTable);
