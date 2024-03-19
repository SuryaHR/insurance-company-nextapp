"use client";
import React from "react";
import {
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import ItemPaidTableListStyle from "./payoutHolder.module.scss";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";

import { useContext } from "react";
import CustomLoader from "@/components/common/CustomLoader/index";
import { getUSDCurrency } from "@/utils/utitlity";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
interface payoutHolderData {
  [key: string | number]: any;
}
function ItemPaidTable({ recvData, fetching }: any) {
  const columnHelper = createColumnHelper<payoutHolderData>();

  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const columns = [
    columnHelper.accessor("itemNumber", {
      cell: (info: any) => info.getValue(),
      header: () => "Item #",
      footer: () => <span></span>,
    }),
    columnHelper.accessor("originalItemDescription", {
      cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => "Original Item Description",
      footer: () => "",
    }),
    columnHelper.accessor("replacementItemDescription", {
      cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => "Replacement Item Description",
      footer: () => "",
    }),
    columnHelper.accessor("replacementCost", {
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      footer: () => {
        return <span>Total</span>;
      },
      header: () => "Replacement Cost",
    }),
    columnHelper.accessor("cashExposure", {
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      footer: () => {
        return getUSDCurrency(
          recvData?.reduce((prev: any, curr: any) => prev + curr.cashExposure, 0)
        );
      },
      header: () => "Cash Exposure",
    }),
    columnHelper.accessor("holdoverPaid", {
      cell: (info: any) => getUSDCurrency(info.getValue() ?? 0),
      header: () => "Holdover Paid",
      footer: () => {
        return getUSDCurrency(
          recvData?.reduce((prev: any, curr: any) => prev + curr.holdoverPaid, 0)
        );
      },
    }),
  ];

  const table = useReactTable({
    data: recvData ?? [],
    columns,
    pageCount: 20,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
    enableColumnFilters: false,
  });

  // if (loading) {
  //   return (
  <div className="col-12 d-flex flex-column position-relative">
    <CustomLoader loaderType="spinner2" />
  </div>;
  // );
  // }
  return (
    <div>
      <GenericComponentHeading
        title={translate?.contentsEvaluationTranslate?.policyholderPayouts?.title}
        customHeadingClassname={ItemPaidTableListStyle.policyHolderListHeader}
      />
      <div className={ItemPaidTableListStyle.detailListContainer}>
        <div
          className={`row col-12 ${ItemPaidTableListStyle.detailListContentContainer}`}
        ></div>
      </div>
      {!fetching && (
        <div>
          <CustomReactTable showFooter={true} table={table} />
        </div>
      )}
    </div>
  );
}

export default ItemPaidTable;
