"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable";
import VendorListStyle from "./invoicesToApproveComponent.module.scss";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import InvoicesToApproveSearchBox from "./InvoicesToApproveSearchBox/InvoicesToApproveSearchBox";
import { MdExpandMore } from "react-icons/md";
import { MdCloseFullscreen } from "react-icons/md";
import { fetchVendorTableAction } from "@/reducers/_claim_supervisor_reducers/VendorInvoices/InvoicesVendorSlice";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";
import { PAGINATION_LIMIT_10 } from "@/constants/constants";
import Loading from "@/app/[lang]/loading";

const InvoicesToApproveComponent: React.FC<connectorType> = (props) => {
  const { vendorInvoicesDataFull, fetchVendorTableAction, userId, totalCount } = props;
  const [tableLoader, setTableLoader] = useState<boolean>(false);

  const pageLimit = PAGINATION_LIMIT_10;
  type InvoicesData = {
    [key: string | number]: any;
  };

  useEffect(() => {
    setTableLoader(true);
    fetchVendorTableAction({
      page: 1,
      userId: userId,
      sortBy: "",
      orderBy: "",
      searchString: "",
      limit: 10,
    }).then(() => {
      setTableLoader(false);
    });
  }, [fetchVendorTableAction, userId]);

  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const columnHelper = createColumnHelper<InvoicesData>();

  const columns = [
    columnHelper.accessor("invoiceNumber", {
      header: () => "Invoice #",
      id: "invoiceNumber",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),

    columnHelper.accessor("claimNumber", {
      header: () => "Claim #",
      id: "claimNumber",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("insuredDetails.firstName", {
      header: () => "Insured's Name",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("noOfItems", {
      header: () => "# Of Items",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("invoiceAmount", {
      header: () => "Invoice Amount",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("createDate", {
      header: () => "Created Date",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("status.status", {
      header: () => "Status",
      cell: (info: any) => info.getValue(),
      enableSorting: true,
    }),
  ];

  const handleExpandToggle = () => {
    setIsExpanded((prev) => !prev);
    setIsFullScreen(false);
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen((prev) => !prev);
    setIsExpanded(false);
  };

  const tableData = useMemo(() => {
    return vendorInvoicesDataFull;
  }, [vendorInvoicesDataFull]);

  const table = useReactTable({
    data: tableData || [],
    columns,
    pageCount: Math.ceil(totalCount / pageLimit),
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableColumnFilters: false,
  });

  return (
    <>
      {tableLoader && <Loading />}
      <div className="mt-4 m-4">
        <div className="d-flex justify-content-end">
          <MdExpandMore
            onClick={handleExpandToggle}
            style={{ cursor: "pointer", width: "50px" }}
          />

          <MdCloseFullscreen onClick={handleFullScreenToggle} />
        </div>
        <div>
          <GenericComponentHeading
            customHeadingClassname={VendorListStyle.headingContainer}
            customTitleClassname={VendorListStyle.headingTxt}
            title={"Vendor Invoices Needing Approval"}
          />
        </div>
        {isExpanded && (
          <>
            <div
              className={`${VendorListStyle.addItemsContainer} ${
                isFullScreen ? VendorListStyle.fullScreen : ""
              }`}
            >
              <div className={`row ${VendorListStyle.addItemsContentContainer}`}>
                <div
                  className={`col-lg-10 col-md-10 col-sm-12 col-12 mt-2 mb-2 ${
                    VendorListStyle.vendorsearchItemsStyle
                  } ${isFullScreen ? VendorListStyle.fullScreenContent : ""}`}
                >
                  <InvoicesToApproveSearchBox setTableLoader={setTableLoader} />
                </div>
              </div>
            </div>
            <div
              className={`${VendorListStyle.addListTableContainer} ${
                isFullScreen ? VendorListStyle.fullScreenContent : ""
              }`}
            >
              <CustomReactTable
                table={table}
                data={tableData}
                pageLimit={pageLimit}
                tableDataErrorMsg={tableData.length == 0 ? "No data Found" : null}
                totalDataCount={tableData.length}
                loader={false}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  vendorInvoicesDataFull: state.vendorInvoices.vendorInvoicesDataFull,
  totalCount: state.vendorInvoices.totalCount,
  userId: selectLoggedInUserId(state),
});

const mapDispatchToProps = {
  fetchVendorTableAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectorType = ConnectedProps<typeof connector>;
export default connector(InvoicesToApproveComponent);
