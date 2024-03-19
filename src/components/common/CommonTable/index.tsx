import React from "react";
import CommonTableStyle from "./CommonTable.module.scss";
import clsx from "clsx";

interface CommonTableProps {
  columns: string[];
  data: { [key: string]: any }[];
}

const CommonTable: React.FC<CommonTableProps> = ({ columns, data }) => {
  return (
    <table className={CommonTableStyle.tableStyle}>
      <thead className={CommonTableStyle.theadtyle}>
        <tr className={CommonTableStyle.trStyle}>
          {columns.map((column, index) => (
            <th
              key={index}
              className={clsx(CommonTableStyle.thStyle, {
                [CommonTableStyle.actionHeadingCol]: !column,
              })}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={CommonTableStyle.tBodyStyle}>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr
              role="button"
              onClick={() => {
                row?.handleRowClick && row?.handleRowClick();
              }}
              key={rowIndex}
              className={clsx(CommonTableStyle.trStyle, {
                [CommonTableStyle.readMsg]: row?.isRead,
              })}
              onMouseOver={(e) => {
                e.currentTarget
                  .querySelector("[data-key='action']")
                  ?.classList?.add(CommonTableStyle.show);
              }}
              onMouseLeave={(e) => {
                e.currentTarget
                  .querySelector("[data-key='action']")
                  ?.classList?.remove(CommonTableStyle.show);
              }}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={clsx(CommonTableStyle.tdStyle)}>
                  {column ? (
                    row[column]
                  ) : (
                    <span data-key="action" className={CommonTableStyle.actionIcon}>
                      {row[column]}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length + 1}
              className={clsx(CommonTableStyle.tdStyle, CommonTableStyle["no-data"])}
            >
              No new messages available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CommonTable;
