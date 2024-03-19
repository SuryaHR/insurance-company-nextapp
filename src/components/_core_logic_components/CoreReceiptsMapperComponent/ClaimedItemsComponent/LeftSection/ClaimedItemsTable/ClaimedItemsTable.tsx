"use client";
import React from "react";
import receiptMapperStyle from "../../../receiptMapperComponent.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { clsx } from "clsx";
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
import { convertToCurrentTimezone } from "@/utils/helper";
import { useParams } from "next/navigation";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import {
  addMappedlineitems,
  addSelectedFile,
  addSelectedMappPoint,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import GenericButton from "@/components/common/GenericButton/index";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { receiptMapperTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/receipts-mapper/[claimId]/page";
import selectAccessToken from "@/reducers/Session/Selectors/selectAccessToken";
import { addClaimedItemsListData } from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import {
  getClaimedItems,
  getMappedlineitems,
  updateItemStatusSettled,
} from "@/services/_core_logic_services/CoreReceiptMapperService";

interface typeProps {
  [key: string | number]: any;
}

const ClaimedItemsTable: React.FC<connectorType & typeProps> = (props) => {
  const {
    claimedItemsList,
    tableLoader,
    claimedItemsErrorMsg,
    setTableLoader,
    clearFilter,
    addNotification,
    addSelectedFile,
    addSelectedMappPoint,
    isopenmapper,
    allClaimedItemsList,
    token,
    addClaimedItemsListData,
    addMappedlineitems,
    setClearFilter,
  } = props;
  const { translate } =
    useContext<TranslateContextData<receiptMapperTranslatePropType>>(TranslateContext);

  const { claimId } = useParams();

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
    columnHelper.accessor("itemNumber", {
      id: "item_number",
      header: () => translate?.receiptMapperTranslate?.claimedItems?.item,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
      enableSorting: true,
    }),
    columnHelper.accessor("description", {
      header: () => translate?.receiptMapperTranslate?.claimedItems?.description,
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
      enableSorting: true,
    }),
    columnHelper.accessor("statusFilter", {
      header: () => translate?.receiptMapperTranslate?.claimedItems?.status,
      cell: (info) => info.getValue(),
      footer: () => {
        return <span>Total</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
        footercolSpan: 3,
        uniqueValues: Array.from(
          new Set(allClaimedItemsList.map((item: any) => item.statusFilter))
        ),
      },
      enableSorting: false,
    }),
    columnHelper.accessor("receiptValue", {
      header: () => translate?.receiptMapperTranslate?.claimedItems?.receiptValue,
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
      header: () => translate?.receiptMapperTranslate?.claimedItems?.qtyReplaced,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${
          info.row.original.totalQuantityReplaced
        }(${info.getValue()})`}</div>
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
        return <span>{`${Replacedsum}(${sum})`}</span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("replacementExposure", {
      header: () => translate?.receiptMapperTranslate?.claimedItems?.maxReplacement,
      cell: (info: any) => (
        <div className={receiptMapperStyle.alignRight}>{`${getUSDCurrency(
          info.getValue()
        )}`}</div>
      ),
      footer: () => {
        const sum = claimResult.reduce(
          (acc: number, dataItem: any) => acc + dataItem.replacementExposure,
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
      header: () => translate?.receiptMapperTranslate?.claimedItems?.cashPaid,
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
    columnHelper.accessor("holdOverDue", {
      header: () => translate?.receiptMapperTranslate?.claimedItems?.holdoverDue,
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
      header: () => translate?.receiptMapperTranslate?.claimedItems?.holdoverPaid,
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
    columnHelper.accessor("Action", {
      header: () => translate?.receiptMapperTranslate?.claimedItems?.action,
      cell: (info: any) => {
        if (
          info.row.original.status.status == "PAID" ||
          (info.row.original.status.status == "PARTIAL REPLACED" &&
            (info.row.original.holdOverDue == null || info.row.original.holdOverDue == 0))
        )
          return (
            <GenericButton
              label="Settled"
              theme="linkBtn"
              onClickHandler={(e: React.MouseEvent<HTMLElement>) =>
                updateItemSettledStatus(e, info.row.original)
              }
            />
          );
      },
      footer: () => {
        return <span></span>;
      },
      meta: {
        footerClass: receiptMapperStyle.footerStyles,
      },
      enableSorting: false,
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
  const updateItemSettledStatus = async (e: React.MouseEvent<HTMLElement>, item: any) => {
    e.stopPropagation();
    setTableLoader(true);

    // console.log(item)
    const holdoverValue = 0;
    let receiptVal = 0;
    let cashPaid = 0;

    const holdoverPaid = parseFloat(
      item.holdOverPaymentPaidAmount != null ? item.holdOverPaymentPaidAmount : 0
    );

    // Status changing 'PARTIAL REPLACED'  to 'SETTLED'
    if (item.status.status == "PARTIAL REPLACED") {
      receiptVal = parseFloat(item.receiptValue);
      cashPaid = parseFloat(item.acv + holdoverPaid);
    } else {
      // Status changing 'PAID'  to 'SETTLED'
      cashPaid = parseFloat(item.cashPaid != null ? item.cashPaid : 0);
    }

    const payload = {
      acv: parseFloat(item.acv),
      holdOver: holdoverValue,
      itemId: item.id,

      rcv: parseFloat(item.rcvTotal),
      receiptValue: receiptVal,
      holdOverDue: 0,
      holdOverPaid: holdoverPaid,
      cashPaid: cashPaid,
    };

    // console.log(payload)
    const saveNewSettledItem = await updateItemStatusSettled(payload, token);
    if (saveNewSettledItem) {
      const claimedResp = await getClaimedItems(
        {
          claimId: claimId,
          reqForReceiptMapper: true,
        },
        token
      );
      if (claimedResp.status === 200) {
        addClaimedItemsListData({ claimedData: claimedResp });
      }
      addNotification({
        message: `Item’s status was successfully updated.`,
        id: "settled_success",
        status: "success",
      });
    } else {
      addNotification({
        message: `Something went wrong`,
        id: "settled_error",
        status: "error",
      });
    }
    setTableLoader(false);
  };
  const handleRowClick = async (rowData: any, subRowClicked = null) => {
    setTableLoader(true);

    if (
      (subRowClicked ||
        rowData.quantity === rowData.totalQuantityReplaced ||
        (rowData.quantity !== rowData.totalQuantityReplaced && !isopenmapper)) &&
      rowData.subRows.length > 0
    ) {
      const mappedItemsList = await getMappedlineitems({ claimId }, token);
      if (mappedItemsList.status === 200) {
        addMappedlineitems({ mappedlineitemsList: mappedItemsList });
      }
      let index = 0;
      if (subRowClicked) {
        index = rowData.replaceItems.findIndex((item: any) => item.id === subRowClicked);
      }
      const pdfId = rowData.replaceItems[index].pdf.pdfId;
      const pointsMapped = mappedItemsList.data.items.filter(
        (item: any) =>
          item.pdf.pdfId === pdfId &&
          item.itemId === rowData.itemId &&
          item.rcv === rowData.replaceItems[index].rcv
      );
      const selectedPdf = {
        fileUrl: pointsMapped[0].pdf.url,
        fileName: pointsMapped[0].pdf.name,
        pdfId: pointsMapped[0].pdf.pdfId,
      };
      addSelectedFile({ selectedPdf: selectedPdf });
      addSelectedMappPoint({
        selectedMappedItem: {
          ...pointsMapped[0],
          itemNumber: rowData.itemNumber,
          applyTax: rowData.applyTax,
          taxRate: rowData.taxRate,
          subRowIndex: index,
          isMapped: true,
        },
      });
    } else {
      if (rowData.rcv) {
        if (isopenmapper) {
          addSelectedMappPoint({
            selectedMappedItem: {
              itemNumber: rowData.itemNumber,
              quantity:
                rowData.quantity !== rowData.totalQuantityReplaced
                  ? rowData.quantity - rowData.totalQuantityReplaced
                  : rowData.quantity,
              materialCost: rowData.materialCost,
              shipping: rowData.shipping,
              applyTax: rowData.applyTax,
              taxRate: rowData.taxRate,
              receiptValue: rowData.receiptValue,
            },
          });
        } else {
          addNotification({
            message: `No receipt has been mapped yet for this item.`,
            id: "no_receipt_error",
            status: "error",
          });
        }
      } else {
        addNotification({
          message: `Cannot replace an item which has not been priced yet...`,
          id: "cannot_replace_item",
          status: "error",
        });
      }
    }
    setTableLoader(false);
  };

  const renderSubComponent = ({ row }: any) => {
    return (
      <>
        {row.original.subRows.map((subRow: any) => (
          <tr
            key={subRow.itemNumber}
            onClick={() => {
              if (!subRow.totalRow) handleRowClick(row.original, subRow.subRowId);
            }}
            className={clsx("text-right", {
              [receiptMapperStyle.subtotalRow]: subRow.totalRow,
            })}
          >
            <td
              colSpan={3}
              className={clsx({
                "text-center": !subRow.totalRow,
              })}
            >
              {subRow.totalRow
                ? "Total"
                : convertToCurrentTimezone(subRow.createDate, "MMM DD YYYY hh:mm A")}
            </td>
            {row.getVisibleCells().map((cell: any, index: number) => {
              if (subRow[cell.column.id] !== undefined) {
                return (
                  <td key={index}>
                    {cell.column.id !== "quantity"
                      ? getUSDCurrency(subRow[cell.column.id])
                      : subRow.totalRow
                        ? `${row.original.totalQuantityReplaced}(${
                            subRow[cell.column.id]
                          })`
                        : subRow[cell.column.id]}
                  </td>
                );
              }
            })}
            <td></td>
          </tr>
        ))}
      </>
    );
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
          claimedItemsList.length === 0
            ? translate?.receiptMapperTranslate?.claimedItems?.noRecordFound
            : claimedItemsErrorMsg
        }
        handleRowClick={handleRowClick}
        filterFn={filterFn}
        showFooter={true}
        tableCustomClass={receiptMapperStyle.tableContainer}
        renderSubComponent={renderSubComponent}
        clearFilter={clearFilter}
        setClearFilter={setClearFilter}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  claimedItemsList: state.claimedItems.claimedItemsList,
  claimedItemsErrorMsg: state.claimedItems.claimedItemsErrorMsg,
  isopenmapper: state.receiptMapper.isopenmapper,
  allClaimedItemsList: state.claimedItems.allClaimedItemsList,
  token: selectAccessToken(state),
});

const mapDispatchToProps = {
  addNotification,
  addSelectedFile,
  addSelectedMappPoint,
  addClaimedItemsListData,
  addMappedlineitems,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ClaimedItemsTable);
