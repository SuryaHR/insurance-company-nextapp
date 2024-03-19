"use client";
import React from "react";
import receiptMapperStyle from "../../receiptMapperComponent.module.scss";
import { ConnectedProps, connect } from "react-redux";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import { getUSDCurrency } from "@/utils/utitlity";
// import { useParams } from "next/navigation";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import {
  addSelectedFile,
  addSelectedMappPoint,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import { updateClaimedItemsListData } from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import { sortBy } from "lodash";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";

interface typeProps {
  [key: string | number]: any;
}

const SummaryTableComponent: React.FC<connectorType & typeProps> = (props) => {
  const {
    claimedItemsList,
    tableLoader,
    claimedItemsErrorMsg,
    setTableLoader,
    clearFilter,
    updateClaimedItemsListData,
    setSelectedRows,
    selectedRows,
    allClaimedItemsList,
    setClearFilter,
  } = props;
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  // const { claimId } = useParams();

  const [claimResult, setClaimResult] = React.useState(claimedItemsList);
  const [filterSelected, setFilterSelected] = React.useState([]);

  interface ClaimData {
    [key: string | number]: any;
    subRows?: ClaimData[];
  }
  React.useEffect(() => {
    const defaultData: ClaimData[] = [...claimedItemsList];
    setClaimResult([...defaultData]);
  }, [claimedItemsList]);

  const columnHelper = createColumnHelper<ClaimData>();

  const columns = [
    columnHelper.accessor("", {
      header: ({ table }) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            className={receiptMapperStyle.checkbox}
            checked={table.getIsAllRowsSelected()}
            onChange={handleSelectAll}
          />
        </div>
      ),
      meta: {
        headerClass: receiptMapperStyle.checkHeader,
      },
      id: "check",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div
          className="d-flex justify-content-center p-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
          key={row.id}
        >
          <input
            type="checkbox"
            className={receiptMapperStyle.checkbox}
            checked={selectedRows[row.original.itemNumber]}
            onChange={async () => {
              await setTableLoader(true);
              handleRowSelect(row, row.original.itemId);
            }}
            disabled={!row.original?.status?.status?.includes("REPLACED")}
          />
        </div>
      ),
    }),
    columnHelper.accessor("itemNumber", {
      id: "item_number",
      header: () => translate?.receiptMapperTranslate?.summary?.item,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
      enableSorting: true,
    }),
    columnHelper.accessor("description", {
      header: () => translate?.receiptMapperTranslate?.summary?.description,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
      enableSorting: true,
    }),
    columnHelper.accessor("statusFilter", {
      header: () => translate?.receiptMapperTranslate?.summary?.status,
      cell: (info) => info.getValue(),
      footer: () => {
        return <span>Total</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
        footercolSpan: 4,
        uniqueValues: Array.from(
          new Set(allClaimedItemsList.map((item: any) => item.statusFilter))
        ),
      },
      enableSorting: false,
    }),
    columnHelper.accessor("rcvTotal", {
      header: () => translate?.receiptMapperTranslate?.summary?.maxReplacement,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${getUSDCurrency(
          info.getValue()
        )}`}</div>
      ),
      footer: () => {
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.rcvTotal,
          0
        );
        return <span>{`${getUSDCurrency(sum)}`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("cashPaid", {
      header: () => translate?.receiptMapperTranslate?.summary?.cashPaid,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${getUSDCurrency(
          info.getValue()
        )}`}</div>
      ),
      footer: () => {
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.cashPaid,
          0
        );
        return <span>{`${getUSDCurrency(sum)}`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("maxHoldover", {
      header: () => translate?.receiptMapperTranslate?.summary?.maxHoldover,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${getUSDCurrency(
          info.getValue()
        )}`}</div>
      ),
      footer: () => {
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.maxHoldover,
          0
        );
        return <span>{`${getUSDCurrency(sum)}`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("receiptValue", {
      header: () => translate?.receiptMapperTranslate?.summary?.receiptValue,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${getUSDCurrency(
          info.getValue()
        )}`}</div>
      ),
      footer: () => {
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.receiptValue,
          0
        );
        return <span>{`${getUSDCurrency(sum)}`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("quantity", {
      header: () => translate?.receiptMapperTranslate?.summary?.qtyReplaced,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>
          {`${info.row.original.totalQuantityReplaced}/${info.getValue()}`}
        </div>
      ),
      footer: () => {
        const Replacedsum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.totalQuantityReplaced,
          0
        );
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.quantity,
          0
        );
        return <span>{`${Replacedsum}/${sum}`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("holdOverDue", {
      header: () => translate?.receiptMapperTranslate?.summary?.holdoverDue,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${getUSDCurrency(
          info.getValue()
        )}`}</div>
      ),
      footer: () => {
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.holdOverDue,
          0
        );
        return <span>{`${getUSDCurrency(sum)}`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("holdOverPaymentPaidAmount", {
      header: () => translate?.receiptMapperTranslate?.summary?.holdoverPaid,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${getUSDCurrency(
          info.getValue()
        )}`}</div>
      ),
      footer: () => {
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.holdOverPaymentPaidAmount,
          0
        );
        return <span>{`${getUSDCurrency(sum)}`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),

    columnHelper.accessor("totalSettlement", {
      header: () => translate?.receiptMapperTranslate?.summary?.settlementValue,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${getUSDCurrency(
          info.row.original.cashPaid + info.row.original.holdOverPaymentPaidAmount
        )}`}</div>
      ),
      footer: () => {
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) =>
            acc + dataItem.cashPaid + dataItem.holdOverPaymentPaidAmount,
          0
        );
        return <span>{`${getUSDCurrency(sum)}`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const filterFn = async (
    currentValue: any,
    columnId: string,
    currentTypeofFilter: string
  ) => {
    setTableLoader(true);
    const newfilterArr: any = [...filterSelected];

    const columnIndex = newfilterArr.findIndex((item: any) =>
      Object.prototype.hasOwnProperty.call(item, columnId)
    );

    if (columnIndex !== -1) {
      newfilterArr[columnIndex][columnId] = {
        currentValue,
        typeofFilter: newfilterArr[columnIndex][columnId].typeofFilter,
      };
    } else {
      newfilterArr.push({
        [columnId]: { currentValue, typeofFilter: currentTypeofFilter },
      });
    }

    setFilterSelected(newfilterArr);

    let filterArr = claimedItemsList;

    await newfilterArr.forEach((filterItem: any) => {
      const colId = Object.keys(filterItem)[0];

      const values = filterItem[colId].currentValue;
      const typeofFilter = filterItem[colId].typeofFilter;

      if (typeofFilter !== "number") {
        filterArr = filterArr.filter((item: any) => {
          if (item[colId] === null && values.includes("BLANK")) {
            return true;
          } else if (item[colId] === null && !values.includes("BLANK")) {
            return false;
          } else if (
            values.some((val: any) => item[colId].toUpperCase() === val.toUpperCase())
          ) {
            return true;
          }
          return false;
        });
      }
    });

    setClaimResult([...filterArr]);
    setTableLoader(false);
  };

  const handleSelectAll = async () => {
    await setTableLoader(true);
    const isAllRowsSelected = table.getIsAllRowsSelected();
    table.toggleAllRowsSelected(!isAllRowsSelected);

    if (!isAllRowsSelected) {
      const allRowIds = table.getPreFilteredRowModel().rows.map((row) => {
        if (
          row.original.status.status === "REPLACED" ||
          row.original.status.status === "PARTIAL REPLACED"
        ) {
          return row.original.itemNumber;
        }
      });
      setSelectedRows((prevSelectedRows: any) => {
        const newSelectedRows = { ...prevSelectedRows };
        allRowIds.forEach((rowId) => {
          newSelectedRows[rowId] = true;
        });
        return newSelectedRows;
      });
    } else {
      setSelectedRows({});
    }
    const updatedClaimList = claimResult.map((item: any) =>
      item.status.status === "REPLACED" || item.status.status === "PARTIAL REPLACED"
        ? { ...item, selected: !isAllRowsSelected }
        : item
    );
    const mergedArray = [
      ...updatedClaimList,
      ...claimedItemsList.filter(
        (item: any) =>
          !updatedClaimList.some((newItem: any) => newItem.itemId === item.itemId)
      ),
    ];
    const sorted_array = sortBy(mergedArray, ["itemNumber"]);

    updateClaimedItemsListData({ claimedData: sorted_array });

    setClaimResult([...updatedClaimList]);
    setTableLoader(false);
  };

  const handleRowSelect = async (row: any, itemId: any) => {
    setTableLoader(true);
    row.getToggleSelectedHandler()(row);
    setSelectedRows((prevSelectedRows: any) => {
      const newSelectedRows = { ...prevSelectedRows };
      newSelectedRows[row.original.itemNumber] =
        !newSelectedRows[row.original.itemNumber];
      return newSelectedRows;
    });

    const updatedClaimList = claimResult.map((item: any) =>
      item.itemId === itemId ? { ...item, selected: !item.selected } : item
    );
    setClaimResult(updatedClaimList);

    const updatedclaimedListDataFull = claimedItemsList.map((item: any) =>
      item.itemId === itemId ? { ...item, selected: !item.selected } : item
    );
    updateClaimedItemsListData({
      claimedData: updatedclaimedListDataFull,
    });
    setTableLoader(false);
  };

  const table = useReactTable({
    data: claimResult,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    enableSorting: true,
  });

  return (
    <div>
      <CustomReactTable
        table={table}
        totalDataCount={claimedItemsList?.length}
        loader={tableLoader}
        tableDataErrorMsg={
          claimedItemsList.length === 0 ? "No Record Found" : claimedItemsErrorMsg
        }
        filterFn={filterFn}
        showFooter={true}
        tableCustomClass={receiptMapperStyle.tableContainer}
        clearFilter={clearFilter}
        setClearFilter={setClearFilter}
      />
    </div>
  );
};

const mapStateToProps = ({ claimedItems }: any) => ({
  claimedItemsList: claimedItems.claimedItemsList,
  claimedItemsErrorMsg: claimedItems.claimedItemsErrorMsg,
  allClaimedItemsList: claimedItems.allClaimedItemsList,
});

const mapDispatchToProps = {
  addNotification,
  addSelectedFile,
  addSelectedMappPoint,
  updateClaimedItemsListData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(SummaryTableComponent);
