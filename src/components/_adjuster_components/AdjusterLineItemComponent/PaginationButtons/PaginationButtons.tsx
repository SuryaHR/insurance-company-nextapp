import React, { useContext, useMemo } from "react";
import { FaEllipsisH } from "react-icons/fa";
import lineItemPaginationStyle from "./lineItemPagination.module.scss";
import clsx from "clsx";
import { usePagination, DOTS } from "@/hooks/usePagination";
import ArrowPageBtn from "./ArrowPageBtn";
import { LineItemContext } from "../LineItemContext";

function PaginationButtons({
  pageId,
  totalPage,
  handlePageChange,
  showArrowBtn,
}: {
  pageId: number;
  totalPage: any[];
  handlePageChange: (itemId: number) => void;
  showArrowBtn: boolean;
}) {
  const { isPageUpdated, contextSave } = useContext(LineItemContext);
  const currentPage = useMemo(() => {
    const pageNumber = totalPage?.findIndex((item) => {
      return item === pageId;
    });
    return pageNumber + 1;
  }, [pageId, totalPage]);

  const totalCount = useMemo(() => totalPage.length, [totalPage]);

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount: 2,
    pageSize: 1,
  });

  const PageButton = ({
    children,
    key,
    className,
  }: {
    children: React.ReactNode;
    key?: string;
    className?: string;
  }) => (
    <li className={clsx(lineItemPaginationStyle.listItem, className)} key={key}>
      {children}
    </li>
  );

  const handlePrevious = () => {
    if (isPageUpdated) {
      contextSave({
        clbk: () => currentPage != 1 && handlePageChange(totalPage[currentPage - 1 - 1]),
      });
    } else {
      currentPage != 1 && handlePageChange(totalPage[currentPage - 1 - 1]);
    }
  };
  const handleNext = () => {
    if (isPageUpdated) {
      contextSave({
        clbk: () =>
          currentPage != totalCount && handlePageChange(totalPage[currentPage - 1 + 1]),
      });
    } else {
      currentPage != totalCount && handlePageChange(totalPage[currentPage - 1 + 1]);
    }
  };
  return (
    <div className={lineItemPaginationStyle.root}>
      {showArrowBtn && (
        <>
          <ArrowPageBtn clickHandler={handlePrevious} />
          <ArrowPageBtn align="right" clickHandler={handleNext} />
        </>
      )}
      <ul className={lineItemPaginationStyle.btnList}>
        <PageButton>
          <button
            disabled={currentPage === 1}
            className={clsx(
              lineItemPaginationStyle.btn,
              lineItemPaginationStyle.prevNextBtn
            )}
            onClick={handlePrevious}
          >
            Previous
          </button>
        </PageButton>
        {paginationRange?.map((pageNo: number | string, index: number) => {
          if (pageNo === DOTS) {
            return (
              <PageButton key={`page-${index}`}>
                <FaEllipsisH size={24} className={lineItemPaginationStyle.dots} />
              </PageButton>
            );
          }
          return (
            <PageButton key={`page-${index}`}>
              <button
                className={clsx(lineItemPaginationStyle.btn, {
                  [lineItemPaginationStyle.active]: pageNo === currentPage,
                })}
                onClick={() => {
                  if (isPageUpdated) {
                    contextSave({
                      clbk: () => handlePageChange(totalPage[+pageNo - 1]),
                    });
                  } else {
                    handlePageChange(totalPage[+pageNo - 1]);
                  }
                }}
              >
                {pageNo}
              </button>
            </PageButton>
          );
        })}

        <PageButton>
          <button
            disabled={currentPage == totalCount}
            className={clsx(
              lineItemPaginationStyle.btn,
              lineItemPaginationStyle.prevNextBtn
            )}
            onClick={handleNext}
          >
            Next
          </button>
        </PageButton>
      </ul>
    </div>
  );
}

export default PaginationButtons;
