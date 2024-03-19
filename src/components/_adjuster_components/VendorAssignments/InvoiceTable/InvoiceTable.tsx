import React from "react";
import InvoiceTableCss from "./InvoiceTable.module.scss";
import NoRecordComponent from "@/components/common/NoRecordComponent/index";
import GenericButton from "@/components/common/GenericButton";

interface CommonTableProps {
  columns: string[];
  data: { [key: string]: any }[];
  invoiceRowClick: any;
  action?: any;
  actionPayNowMethod?: any;
}

const InvoiceTable: React.FC<CommonTableProps> = ({
  columns,
  data,
  invoiceRowClick,
  actionPayNowMethod,
}) => {
  return (
    <div>
      <table className={InvoiceTableCss.tableStyle}>
        <thead className={InvoiceTableCss.theadtyle}>
          <tr className={InvoiceTableCss.trStyle}>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`${InvoiceTableCss.thStyle} ${{
                  [InvoiceTableCss.actionHeadingCol]: !column,
                }}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={InvoiceTableCss.tBodyStyle}>
          {data.length > 0 ? (
            data.map((item: any, key) => (
              <React.Fragment key={key}>
                <tr>
                  <td colSpan={8}>
                    <div className={InvoiceTableCss.vendorNameCont}>
                      <span className={InvoiceTableCss.vendorName}>
                        {item.vendorName}
                        {" (" + item.invoices.length + ")"}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={8}>
                    {/* Nested Table */}
                    <table className={InvoiceTableCss.tableStyle}>
                      {item.invoices.map((row: any, rowIndex: any) => (
                        <tbody key={rowIndex} className={InvoiceTableCss.tBodyStyle}>
                          <tr
                            key={rowIndex}
                            className={`${InvoiceTableCss.trStyle} ${InvoiceTableCss.cursorPointer}`}
                          >
                            {columns.map((column, colIndex) => (
                              <td
                                {...(invoiceRowClick
                                  ? {
                                      onClick: () => {
                                        if (
                                          row["Status"] === "APPROVED" &&
                                          column === "Action"
                                        )
                                          return;
                                        invoiceRowClick(row);
                                      },
                                    }
                                  : {})}
                                key={colIndex}
                                className={InvoiceTableCss.tdStyle}
                              >
                                {column && (
                                  <span>
                                    {row["Status"] === "APPROVED" &&
                                    column === "Action" ? (
                                      <GenericButton
                                        className={InvoiceTableCss.buttonCss}
                                        label="Pay Now"
                                        onClick={() => actionPayNowMethod(row)}
                                        size="small"
                                      />
                                    ) : (
                                      row[column]
                                    )}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      ))}
                    </table>
                    {/* End of Nested Table */}
                  </td>
                </tr>
                <tr className={InvoiceTableCss.trStyle}>
                  <td className={InvoiceTableCss.tdStyle}></td>
                  <td
                    className={`${InvoiceTableCss.tdStyle} ${InvoiceTableCss.fontWeiBold}`}
                  >
                    Total
                  </td>
                  <td
                    className={`${InvoiceTableCss.tdStyle} ${InvoiceTableCss.fontWeiBold}`}
                  >
                    {"$" + item.totalAmount}
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>
                <NoRecordComponent message={"No Data found"} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
