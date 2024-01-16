"use client";
import React from "react";
import ContentListTableStyle from "./ContentListTable.module.scss";
import { ConnectedProps, connect } from "react-redux";
// import { fetchClaimList } from "@/services/ClaimService";
import {
  createColumnHelper,
  getCoreRowModel,
  // getSortedRowModel,
  // SortingState,
  useReactTable,
  // PaginationState,
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
} from "@/reducers/ClaimData/ClaimContentSlice";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import Modal from "@/components/common/ModalPopups";
import ConversationModal from "../ConversationModal";
import { deleteClaimItem } from "@/services/ClaimContentListService";
import { addNotification } from "@/reducers/Notification/NotificationSlice";
import { fetchClaimContentItemDetails } from "@/services/AddItemContentService";
import { sortBy } from "lodash";
interface typeProps {
  [key: string | number]: any;
}
const ContentListTable: React.FC<connectorType & typeProps> = (props) => {
  const {
    claimContentListData,
    totalClaims,
    tableLoader,
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
  const pageLimit = 20;
  const fetchSize = 20;

  const [coversationModelOpen, setCoversationModelOpen] = React.useState(false);

  React.useEffect(() => {
    const defaultData: ContentListData[] = [...claimContentListData];
    setClaimResult([...defaultData.slice(0, fetchSize)]);
  }, [claimContentListData]);

  const handleClearAllFilter = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    clearFilter();
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
          header: () => (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <input
                type="checkbox"
                className={ContentListTableStyle.checkbox}
                checked={claimContentListData.every((item: any) => item.selected)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectAll(e);
                }}
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
            >
              <input
                type="checkbox"
                className={ContentListTableStyle.checkbox}
                checked={row.original.selected}
                onChange={(e) => {
                  e.stopPropagation();
                  handleRowSelect(row.original.itemId);
                }}
                disabled={row.original.statusName === "SETTLED"}
              />
            </div>
          ),
        }),
        columnHelper.accessor("itemNumber", {
          header: () => "Item #",
          id: "item",
          enableColumnFilter: false,
        }),
        columnHelper.accessor("statusName", {
          header: () => "Status", // filter option true should have same id as value
          id: "statusName",
        }),
        columnHelper.accessor("categoryName", {
          header: () => "Catogory", // filter option true should have same id as value
          id: "categoryName",
        }),
      ],
    }),
    columnHelper.group({
      header: () => "Original Item",
      id: "original_item",
      meta: {
        headerClass: ContentListTableStyle.originalItemHeader,
      },
      columns: [
        columnHelper.accessor("description", {
          header: () => "Description",
          id: "Description",
          enableColumnFilter: false,
        }),
        columnHelper.accessor("quantity", {
          header: () => "Qty",
          id: "qty",
          enableColumnFilter: false,
        }),
        columnHelper.accessor("totalStatedAmount", {
          header: () => "Total Price",
          id: "totalStatedAmount", // filter option true should have same id as value
        }),
        columnHelper.accessor("itemTag", {
          header: () => "Item Tag",
          id: "itemTag", // filter option true should have same id as value
        }),
      ],
    }),
    columnHelper.group({
      header: "Vendor",
      id: "vendorId",
      meta: {
        headerClass: ContentListTableStyle.originalItemHeader,
      },
      columns: [
        columnHelper.accessor("vendorName", {
          header: () => "Vendor",
          id: "vendor",
          enableColumnFilter: false,
        }),
      ],
    }),
    columnHelper.group({
      header: "Replacment Item",
      id: "replacmentItem",
      meta: {
        headerClass: ContentListTableStyle.replacementItemHeader,
      },
      columns: [
        columnHelper.accessor("adjusterDescription", {
          header: () => "Replacment Description",
          id: "Replacement_Description",
          enableColumnFilter: false,
        }),
        columnHelper.accessor("rcvTotal", {
          header: () => "Replacment Cost",
          id: "replacment",
          enableColumnFilter: false,
        }),
        columnHelper.accessor("cashPayoutExposure", {
          header: () => "Cash Exposure",
          id: "cash-exposure",
          enableColumnFilter: false,
        }),
      ],
    }),
    columnHelper.group({
      header: "",
      id: "actionItem",
      columns: [
        columnHelper.accessor("Action", {
          header: () => "Action",
          id: "Action",
          cell: ({ row }) => {
            return (
              <div className={ContentListTableStyle.actionButtons}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConversationModalOpen();
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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedClaimList = claimContentListData.map((item: any) => ({
      ...item,
      selected: event.target.checked,
    }));
    updateClaimContentListData({ claimContentList: updatedClaimList });
    const mergedArray = [
      ...updatedClaimList,
      ...claimContentListDataFull.filter(
        (item: any) =>
          !updatedClaimList.some((newItem: any) => newItem.itemId === item.itemId)
      ),
    ];
    const sorted_array = sortBy(mergedArray, ["itemNumber"]);

    updateClaimContentListFullData({ claimContentListFull: sorted_array });

    setClaimResult([...updatedClaimList.slice(0, fetchSize)]);
  };

  const handleRowSelect = (itemId: any) => {
    const updatedClaimList = claimResult.map((item: any) =>
      item.itemId === itemId ? { ...item, selected: !item.selected } : item
    );
    setClaimResult(updatedClaimList);

    const updatedclaimContentListData = claimContentListData.map((item: any) =>
      item.itemId === itemId ? { ...item, selected: !item.selected } : item
    );
    updateClaimContentListData({ claimContentList: updatedclaimContentListData });

    const updatedclaimContentListDataFull = claimContentListDataFull.map((item: any) =>
      item.itemId === itemId ? { ...item, selected: !item.selected } : item
    );
    updateClaimContentListFullData({
      claimContentListFull: updatedclaimContentListDataFull,
    });
  };

  const editAction = async (rowData: any) => {
    const payload = {
      forEdit: true,
      itemId: rowData.itemId,
    };
    await fetchClaimContentItemDetails(payload);
    setEditItem(rowData);
    setIsModalOpen(true);
  };
  const handleConversationModalOpen = () => {
    setCoversationModelOpen(true);
  };
  const handleConversationModalClose = () => {
    setCoversationModelOpen(false);
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
    const id = deletePayload?.id;
    const res = await deleteClaimItem(deletePayload);
    setDelete(null);

    if (res) {
      addNotification({
        message: res ?? "Successfully deleted item.",
        id,
        status: "success",
      });
    } else {
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

  const ModalMsg = () => {
    return (
      <div>
        Are you sure you want to delete this item?<b> Please Confirm!</b>
      </div>
    );
  };
  return (
    <>
      <Modal
        isOpen={coversationModelOpen}
        iconComp={<RiFileInfoLine />}
        headingName="Conversations"
        onClose={handleConversationModalClose}
        childComp={<ConversationModal />}
        overlayClassName={ContentListTableStyle.modalContainer}
        modalWidthClassName={ContentListTableStyle.modalContent}
      />
      {deletePayload && (
        <div>
          <ConfirmModal
            showConfirmation={true}
            closeHandler={handleDeleteClose}
            submitBtnText="Yes"
            closeBtnText="No"
            childComp={<ModalMsg />}
            modalHeading="Delete Lost/Damaged Item"
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
        />
      </div>
    </>
  );
};

const mapStateToProps = ({ claimContentdata }: any) => ({
  claimContentListData: claimContentdata.claimContentListData,
  claimContentListDataFull: claimContentdata.claimContentListDataFull,
  claimErrorMsg: claimContentdata.claimErrorMsg,
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
