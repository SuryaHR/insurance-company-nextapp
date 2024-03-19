import React from "react";
import CommonTable from "@/components/common/CommonTable";
import TableCardsStyle from "./AlertTableCards.module.scss";
import CustomLoader from "../../CustomLoader";
import useObserver from "@/hooks/useObserver";

type propsType<T> = {
  tableData: T[];
  columns: string[];
};

const AlertTableCards = <T extends object>({ columns, tableData }: propsType<T>) => {
  const { ref, inView, isFetching, isLastPage } = useObserver();
  return (
    <div className={TableCardsStyle.container}>
      <CommonTable columns={columns} data={tableData} />
      {isFetching && (
        <div className="position-relative" style={{ height: 40 }}>
          {inView && <CustomLoader loaderType="spinner2" />}
        </div>
      )}
      {!isLastPage && tableData.length > 8 && <div ref={ref} />}
    </div>
  );
};

export default AlertTableCards;
