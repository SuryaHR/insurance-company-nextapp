"use client";
import React from "react";
import CustomReactTableStyles from "./CustomReactTable.module.scss";
import { clsx } from "clsx";
import { MdExpandLess } from "react-icons/md";
import { MdExpandMore } from "react-icons/md";
import CustomLoader from "@/components/common/CustomLoader";
import { flexRender } from "@tanstack/react-table";
import NoRecordComponent from "../NoRecordComponent/NoRecordComponent";

import Filter from "./Filter";
import GenericInput from "../GenericInput/index";

const CustomReactTable: React.FC<any> = React.memo((props) => {
  const {
    table,
    totalDataCount = null,
    pageLimit = null,
    showStatusColor = null,
    loader = null,
    tableDataErrorMsg = null,
    handleRowClick = null,
    fetchNextPage = null,
    totalFetched = null,
    totalDBRowCount = null,
    filterFn = null,
    customFilterValues = null,
    showPaginationButtons = true,
    editableRowId = null,
    editedData = null,
    handleEditChange = null,
    showFooter = false,
  } = props;

  const [showFilterBLock, setShowFilterBLock] = React.useState(null);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [contentLoader, setContentLoader] = React.useState(false);
  const [showScroller, setShowScroller] = React.useState(false);

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        const bottom = scrollHeight - scrollTop - 2 <= clientHeight;
        if (bottom && scrollTop !== 0 && totalFetched < totalDBRowCount) {
          setContentLoader(true);

          const result = fetchNextPage();
          if (result) {
            setContentLoader(false);
          }
        }
      }
    },
    [fetchNextPage, totalFetched, totalDBRowCount]
  );

  React.useEffect(() => {
    const { scrollHeight }: any = tableContainerRef.current;
    if (scrollHeight >= 600 && fetchNextPage) {
      setShowScroller(true);
    }
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached, fetchNextPage, tableContainerRef]);

  const isAnyRowInvalid = table
    .getRowModel()
    .rows.some((row: any) => row.original.isValidItem === false);

  return (
    <>
      <div
        className={clsx({
          [CustomReactTableStyles.reactTable]: true,
          [CustomReactTableStyles.reactTableScroll]: showScroller,
          [CustomReactTableStyles.fixedHeader]: isAnyRowInvalid,
        })}
        {...(fetchNextPage
          ? {
              onScroll: (e) => {
                fetchMoreOnBottomReached(e.target as HTMLDivElement);
              },
            }
          : {})}
        ref={tableContainerRef}
      >
        {loader && <CustomLoader loaderType="spinner1" />}

        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup &&
                  headerGroup.headers.map((header: any) => (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize() !== 150 ? header.getSize() : undefined,
                      }}
                      className={header.column.columnDef.meta?.headerClass ?? null}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="d-flex flex-direction-row">
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <span>
                                  {" "}
                                  <MdExpandLess />
                                </span>
                              ),
                              desc: (
                                <span>
                                  {" "}
                                  <MdExpandMore />
                                </span>
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter
                                column={header.column}
                                table={table}
                                showFilterBLock={showFilterBLock}
                                setShowFilterBLock={setShowFilterBLock}
                                filterFn={filterFn}
                                defaultAllChecked={true}
                                customFilterValues={customFilterValues}
                              />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {tableDataErrorMsg ? (
              <tr>
                <td colSpan={100} className="text-center text-danger">
                  <NoRecordComponent message={tableDataErrorMsg} />
                </td>
              </tr>
            ) : (
              <>
                {table.getRowModel().rows.map((row: any) => (
                  <tr
                    key={row.id}
                    className={clsx({
                      [CustomReactTableStyles.invalidRow]:
                        row.original.isValidItem === false,
                    })}
                    {...(handleRowClick
                      ? {
                          onClick: () => {
                            handleRowClick(row.original);
                          },
                        }
                      : {})}
                  >
                    {row.getVisibleCells().map((cell: any, index: number) => (
                      <td
                        key={cell.id}
                        className={
                          showStatusColor && index === 0
                            ? clsx({
                                [CustomReactTableStyles.All_Items_Priced]:
                                  row.original.noOfItems == row.original.noOfItemsPriced,
                                [CustomReactTableStyles.Partial_Items_Priced]:
                                  row.original.noOfItemsPriced != 0 &&
                                  row.original.noOfItems > row.original.noOfItemsPriced,
                                [CustomReactTableStyles.No_Items_Priced]:
                                  row.original.noOfItemsPriced == 0 &&
                                  row.original.noOfItems != 0,
                              })
                            : undefined
                        }
                      >
                        {editableRowId === row.original.id &&
                        cell.column.columnDef?.meta?.editableField ? (
                          <GenericInput
                            type="text"
                            value={editedData[cell.column.columnDef?.accessorKey]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleEditChange(e, cell.column.columnDef?.accessorKey)
                            }
                          />
                        ) : (
                          <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
          {showFooter && (
            <tfoot>
              {table.getFooterGroups() &&
                table.getFooterGroups().map((footerGroup: any) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header: any) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
            </tfoot>
          )}
        </table>
        <div className="h-2" />
        {!tableDataErrorMsg && pageLimit && (
          <div className={CustomReactTableStyles.paginationContainer}>
            <span className={CustomReactTableStyles.paginationText}>
              Showing {table.getState().pagination.pageIndex * pageLimit + 1} to{" "}
              {totalDataCount >
              table.getState().pagination.pageIndex * pageLimit + 1 + pageLimit - 1
                ? table.getState().pagination.pageIndex * pageLimit + 1 + pageLimit - 1
                : totalDataCount}{" "}
              of {totalDataCount} Claims
            </span>
            {showPaginationButtons && (
              <div className="flex items-center gap-2">
                <button
                  className={`${CustomReactTableStyles.paginationButton} ${CustomReactTableStyles.paginationIcon}`}
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<<"}
                </button>
                <button
                  className={`${CustomReactTableStyles.paginationButton} ${CustomReactTableStyles.paginationIcon}`}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<"}
                </button>

                {Array(table.getPageCount())
                  .fill(table.getPageCount())
                  .map((value, index) => {
                    if (index < 10) {
                      return (
                        <button
                          key={value + "-" + index}
                          className={clsx({
                            [CustomReactTableStyles.paginationButton]: true,
                            [CustomReactTableStyles.active]:
                              index == table.getState().pagination.pageIndex,
                          })}
                          onClick={() => table.setPageIndex(index)}
                        >
                          {index + 1}
                        </button>
                      );
                    }
                  })}
                {table.getPageCount() > 10 && (
                  <>
                    <button className={CustomReactTableStyles.paginationButton}>
                      ...
                    </button>
                    <button
                      className={CustomReactTableStyles.paginationButton}
                      onClick={() => table.setPageIndex(table.getPageCount())}
                    >
                      {table.getPageCount()}
                    </button>
                  </>
                )}
                <button
                  className={`${CustomReactTableStyles.paginationButton} ${CustomReactTableStyles.paginationIcon}`}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {">"}
                </button>
                <button
                  className={`${CustomReactTableStyles.paginationButton} ${CustomReactTableStyles.paginationIcon}`}
                  onClick={() => table.setPageIndex(table.getPageCount())}
                  disabled={!table.getCanNextPage()}
                >
                  {">>"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {contentLoader && (
        <div className="position-relative">
          <CustomLoader loaderType="spinner2" />
        </div>
      )}
    </>
  );
});

CustomReactTable.displayName = "CustomReactTable";

export default CustomReactTable;
