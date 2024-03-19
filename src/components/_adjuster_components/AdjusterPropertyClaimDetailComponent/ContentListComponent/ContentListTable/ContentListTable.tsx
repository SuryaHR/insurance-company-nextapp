"use client";
import React, { useContext } from "react";
import ContentListTableStyle from "./ContentListTable.module.scss";
import { ConnectedProps, connect } from "react-redux";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { RiDeleteBin5Fill, RiFileEditFill, RiFileInfoLine } from "react-icons/ri";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import {
  updateClaimContentListData,
  clearFilter,
  updateClaimContentListFullData,
} from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import ConversationModal from "@/components/common/ConversationModal";
import { deleteClaimItem } from "@/services/_adjuster_services/ClaimContentListService";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { fetchClaimContentItemDetails } from "@/services/_adjuster_services/AddItemContentService";
import { sortBy } from "lodash";
import { getUSDCurrency } from "@/utils/utitlity";
import { PAGINATION_LIMIT_20 } from "@/constants/constants";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import LimitedWidthContent from "@/components/common/LimitedWidthContent";
interface typeProps {
  [key: string | number]: any;
}
const ContentListTable: React.FC<connectorType & typeProps> = (props) => {
  const {
    claimContentListData,
    totalClaims,
    tableLoader,
    setTableLoader,
    claimErrorMsg,
    updateClaimContentListData,
    clearFilter,
    addNotification,
    setIsModalOpen,
    setEditItem,
    claimContentListDataFull,
    updateClaimContentListFullData,
  } = props;
  const { claimId } = useParams();
  const router = useRouter();

  interface ContentListData {
    [key: string | number]: any;
  }

  const [claimResult, setClaimResult] = React.useState(claimContentListData);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [filterSelected, setFilterSelected] = React.useState([]);
  const [deletePayload, setDelete] = React.useState<React.SetStateAction<any>>(null);
  const pageLimit = PAGINATION_LIMIT_20;
  const fetchSize = PAGINATION_LIMIT_20;

  const [coversationModelOpen, setCoversationModelOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<any>({});
  const [isclearFilter, setClearFilter] = React.useState<boolean>(false);
  const [itemRowData, setItemRowData] = React.useState<any>({});
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  React.useEffect(() => {
    const defaultData: ContentListData[] = [...claimContentListData];
    setClaimResult([...defaultData.slice(0, fetchSize)]);
  }, [claimContentListData, fetchSize]);

  const handleClearAllFilter = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    clearFilter();
    setClearFilter(true);
  };
  const columnHelper = createColumnHelper<ContentListData>();

  const columns = [
    columnHelper.group({
      header: () => (
        <span>
          <a href="" onClick={handleClearAllFilter}>
            Clear All Filter
          </a>
        </span>
      ),
      id: "clear",
      columns: [
        columnHelper.accessor("", {
          header: ({ table }) => (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <input
                type="checkbox"
                className={ContentListTableStyle.checkbox}
                checked={table.getIsAllRowsSelected()}
                onChange={handleSelectAll}
              />
            </div>
          ),
          meta: {
            headerClass: ContentListTableStyle.checkHeader,
          },
          id: "check",
          enableColumnFilter: false,
          cell: ({ row }) => (
            <div
              className="d-flex justify-content-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
              key={row.id}
            >
              <input
                type="checkbox"
                className={ContentListTableStyle.checkbox}
                checked={selectedRows[row.original.itemNumber]}
                onChange={async () => {
                  await setTableLoader(true);
                  handleRowSelect(row, row.original.itemId);
                }}
                disabled={row.original.statusName === "SETTLED"}
              />
            </div>
          ),
        }),
        columnHelper.accessor("itemNumber", {
          header: () => translate?.contentListTranslate?.contentListTableColoumns?.item,
          id: "item",
          enableColumnFilter: false,
        }),
        columnHelper.accessor("statusName", {
          header: () => translate?.contentListTranslate?.contentListTableColoumns?.status, // filter option true should have same id as value
          id: "statusName",
          meta: {
            uniqueValues: Array.from(
              new Set(claimContentListDataFull.map((item: any) => item.statusName))
            ),
          },
        }),
        columnHelper.accessor("categoryName", {
          header: () =>
            translate?.contentListTranslate?.contentListTableColoumns?.category, // filter option true should have same id as value
          id: "categoryName",
          meta: {
            uniqueValues: Array.from(
              new Set(claimContentListDataFull.map((item: any) => item.categoryName))
            ),
          },
        }),
      ],
    }),
    columnHelper.group({
      header: () =>
        translate?.contentListTranslate?.contentListTableColoumns?.originalItem,
      id: "original_item",
      meta: {
        headerClass: ContentListTableStyle.originalItemHeader,
      },
      columns: [
        columnHelper.accessor("description", {
          header: () =>
            translate?.contentListTranslate?.contentListTableColoumns?.description,
          id: "Description",
          enableColumnFilter: false,
        }),
        columnHelper.accessor("quantity", {
          header: () => translate?.contentListTranslate?.contentListTableColoumns?.qty,
          id: "qty",
          enableColumnFilter: false,
        }),
        columnHelper.accessor("totalStatedAmount", {
          header: () =>
            translate?.contentListTranslate?.contentListTableColoumns?.totalPrice,
          cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
          id: "totalStatedAmount", // filter option true should have same id as value
        }),
        columnHelper.accessor("itemTag", {
          header: () =>
            translate?.contentListTranslate?.contentListTableColoumns?.itemTag,
          id: "itemTag", // filter option true should have same id as value
        }),
      ],
    }),
    columnHelper.group({
      id: "vendorId",
      columns: [
        columnHelper.accessor("vendorName", {
          header: () => translate?.contentListTranslate?.contentListTableColoumns?.vendor,
          id: "vendor",
          enableColumnFilter: false,
        }),
      ],
    }),
    columnHelper.group({
      header: translate?.contentListTranslate?.contentListTableColoumns?.replacementItem,
      id: "replacmentItem",
      meta: {
        headerClass: ContentListTableStyle.replacementItemHeader,
      },
      columns: [
        columnHelper.accessor("adjusterDescription", {
          header: () =>
            translate?.contentListTranslate?.contentListTableColoumns
              ?.replacementDescription,
          id: "Replacement_Description",
          cell: (info) => (
            <div>
              <LimitedWidthContent text={info.renderValue()} limit={60} />
            </div>
          ),
          size: 385,
          enableColumnFilter: false,
        }),
        columnHelper.accessor("rcvTotal", {
          header: () =>
            translate?.contentListTranslate?.contentListTableColoumns?.replacementCost,
          id: "replacment",
          cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
          enableColumnFilter: false,
        }),
        columnHelper.accessor("cashPayoutExposure", {
          header: () =>
            translate?.contentListTranslate?.contentListTableColoumns?.cashExposure,
          id: "cash-exposure",
          cell: (info) => <span>{`${getUSDCurrency(info.getValue())}`}</span>,
          enableColumnFilter: false,
        }),
      ],
    }),
    columnHelper.group({
      header: "",
      id: "actionItem",
      columns: [
        columnHelper.accessor("Action", {
          header: () => translate?.contentListTranslate?.contentListTableColoumns?.action,
          id: "Action",
          cell: ({ row }) => {
            return (
              <div className={ContentListTableStyle.actionButtons}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemRowData(row.original);
                    setCoversationModelOpen(true);
                  }}
                >
                  <RiFileInfoLine color="grey" size="20px" />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    editAction(row.original);
                  }}
                >
                  <RiFileEditFill color="grey" size="20px" />
                </div>

                {row.original.statusName === "CREATED" && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAction(row.original);
                    }}
                  >
                    <RiDeleteBin5Fill color="grey" size="20px" />
                  </div>
                )}
              </div>
            );
          },
          enableColumnFilter: false,
        }),
      ],
    }),
  ];

  const handleSelectAll = async () => {
    await setTableLoader(true);
    const isAllRowsSelected = table.getIsAllRowsSelected();
    table.toggleAllRowsSelected(!isAllRowsSelected);

    if (!isAllRowsSelected) {
      const allRowIds = table.getPreFilteredRowModel().rows.map((row) => {
        if (row.original.statusName !== "SETTLED") {
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
      item.statusName !== "SETTLED" ? { ...item, selected: !isAllRowsSelected } : item
    );
    const mergedArray = [
      ...updatedClaimList,
      ...claimContentListDataFull.filter(
        (item: any) =>
          !updatedClaimList.some((newItem: any) => newItem.itemId === item.itemId)
      ),
    ];
    const sorted_array = sortBy(mergedArray, ["itemNumber"]);

    updateClaimContentListFullData({ claimContentListFull: sorted_array });

    setClaimResult([...updatedClaimList]);
    setTableLoader(false);
  };

  const handleRowSelect = async (row: any, itemId: any) => {
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

    const updatedclaimContentListDataFull = claimContentListDataFull.map((item: any) =>
      item.itemId === itemId ? { ...item, selected: !item.selected } : item
    );
    updateClaimContentListFullData({
      claimContentListFull: updatedclaimContentListDataFull,
    });
    setTableLoader(false);
  };

  const editAction = async (rowData: any) => {
    const payload = {
      forEdit: true,
      itemId: rowData.itemId,
    };
    await fetchClaimContentItemDetails(payload, claimContentListData);
    setEditItem(rowData);
    setIsModalOpen(true);
  };

  const handleConversationModalClose = () => {
    setCoversationModelOpen(false);
    setItemRowData([]);
  };
  const deleteAction = (rowData: any) => {
    const payload = {
      id: rowData.itemId,
      itemUID: rowData.itemUID,
    };
    setDelete(payload);
  };
  const handleDeleteClose = () => {
    setDelete(null);
  };

  const handleDelete = async () => {
    await setTableLoader(true);

    const id = await deletePayload?.id;
    setDelete(null);
    const res = await deleteClaimItem(deletePayload);

    if (res) {
      const updatedClaimResult = claimResult.filter((item: any) => item.itemId !== id);
      setClaimResult(updatedClaimResult);

      setTableLoader(false);

      addNotification({
        message: res ?? "Successfully deleted item.",
        id,
        status: "success",
      });
    } else {
      setTableLoader(false);

      addNotification({
        message: "Something went wrong.",
        id,
        status: "error",
      });
    }
  };
  const fetchNextPage = () => {
    const nextPageData = claimContentListData.slice(
      claimResult.length,
      claimResult.length + fetchSize
    );
    setClaimResult([...claimResult, ...nextPageData]);

    return true;
  };
  const filterFn = async (
    currentValue: any,
    columnId: string,
    currentTypeofFilter: string
  ) => {
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

    let filterArr = claimContentListDataFull;

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
      } else {
        filterArr = filterArr.filter((item: any) => {
          return values.some((selectedPrice: any) => {
            if (
              selectedPrice === "$0.00 - $24.99" &&
              item[colId] >= 0 &&
              item[colId] <= 24.99
            ) {
              return true;
            } else if (
              selectedPrice === "$25.00 - $99.99" &&
              item[colId] >= 25.0 &&
              item[colId] <= 99.99
            ) {
              return true;
            } else if (
              selectedPrice === "$100.00 - $999.99" &&
              item[colId] >= 100.0 &&
              item[colId] <= 999.99
            ) {
              return true;
            } else if (selectedPrice === "$1,000.00+") {
              return item[colId] >= 1000.0;
            }
            return false;
          });
        });
      }
    });

    await updateClaimContentListData({ claimContentList: filterArr });
    setClaimResult([...filterArr.slice(0, fetchSize)]);
  };
  const handleRowClick = (rowData: any) => {
    router.push(`/adjuster-line-item-detail/${claimId}/${rowData.itemId}`);
  };
  const table = useReactTable({
    data: claimResult,
    columns,
    pageCount: Math.ceil(totalClaims / pageLimit),
    state: {
      columnFilters,
    },

    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    enableSorting: false,
    manualFiltering: true,
  });
  React.useEffect(() => {
    const isAnySelected = claimContentListDataFull.some(
      (element: any) => element.selected
    );
    if (isAnySelected === false) {
      setSelectedRows({});
      table.toggleAllRowsSelected(false);
    }
  }, [claimContentListDataFull, table]);
  const ModalMsg = () => {
    return (
      <div>
        {translate?.addItemModalTranslate?.deleteItemModal?.dltMsg}
        <b> {translate?.addItemModalTranslate?.deleteItemModal?.confirmMsg}</b>
      </div>
    );
  };
  return (
    <>
      {coversationModelOpen && (
        <ConversationModal
          isOpen={coversationModelOpen}
          onClose={handleConversationModalClose}
          itemRowData={itemRowData}
        />
      )}
      {deletePayload && (
        <div>
          <ConfirmModal
            showConfirmation={true}
            closeHandler={handleDeleteClose}
            submitBtnText={translate?.addItemModalTranslate?.deleteItemModal?.yesBtn}
            closeBtnText={translate?.addItemModalTranslate?.deleteItemModal?.noBtn}
            childComp={<ModalMsg />}
            modalHeading={
              translate?.addItemModalTranslate?.deleteItemModal?.deleteItemHeading
            }
            submitHandler={handleDelete}
          />
        </div>
      )}
      <div className={ContentListTableStyle.claimTableContainer}>
        <CustomReactTable
          table={table}
          totalDataCount={claimContentListData.length}
          pageLimit={claimContentListData.length}
          showPaginationButtons={false}
          loader={tableLoader}
          tableDataErrorMsg={claimResult.length === 0 ? "No Record Found" : claimErrorMsg}
          fetchNextPage={fetchNextPage}
          totalFetched={claimResult.length}
          totalDBRowCount={claimContentListData.length}
          filterFn={filterFn}
          handleRowClick={handleRowClick}
          clearFilter={isclearFilter}
          setClearFilter={setClearFilter}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  claimContentListData: state.claimContentdata.claimContentListData,
  claimContentListDataFull: state.claimContentdata.claimContentListDataFull,
  claimErrorMsg: state.claimContentdata.claimErrorMsg,
});
const mapDispatchToProps = {
  updateClaimContentListData,
  clearFilter,
  addNotification,
  updateClaimContentListFullData,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(ContentListTable);
