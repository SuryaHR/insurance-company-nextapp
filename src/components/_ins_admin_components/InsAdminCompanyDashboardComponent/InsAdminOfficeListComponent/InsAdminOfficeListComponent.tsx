"use client";
import React from "react";
import GenericButton from "@/components/common/GenericButton/index";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./InsAdminComponentStyle.module.scss";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import CustomReactTable from "@/components/common/CustomReactTable";
import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import { InsAdminOfficeTranslatePropType } from "@/app/[lang]/(ins_admin)/company/page";
import InsAdminSearchBox from "./InsAdminSearchBox";
import { useRouter } from "next/navigation";

interface propType {
  editInfo: boolean;
}

const InsAdminOfficeListComponent: React.FC<propType> = ({ editInfo }) => {
  const { translate } =
    useContext<TranslateContextData<InsAdminOfficeTranslatePropType>>(TranslateContext);
  interface OfferData {
    [key: string | number]: any;
  }
  const columnHelper = createColumnHelper<OfferData>();
  const router = useRouter();

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: () => translate.InsAdminOfficeTranslate.office.id,
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),

    columnHelper.accessor("office", {
      id: "office",
      header: () => translate.InsAdminOfficeTranslate.office.office,
      cell: (info) => info.renderValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("city", {
      header: () => translate.InsAdminOfficeTranslate.office.city,
      cell: (info) => info.renderValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("noOfEmplyoees", {
      id: "noOfEmplyoees",
      header: () => translate.InsAdminOfficeTranslate.office.numberOfEmployess,
      cell: (info) => info.renderValue(),
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: translate.InsAdminOfficeTranslate.office.status,
      cell: (info) => info.renderValue(),
      enableSorting: true,
      size: 100,
    }),
    columnHelper.accessor("", {
      id: "Action",
      header: translate.InsAdminOfficeTranslate.office.action,
      cell: () => (
        <>
          <a href="" className={styles.AssignText}>
            {translate.InsAdminOfficeTranslate.office.edit}{" "}
          </a>
          |
          <a href="" className={styles.DeleteText}>
            {translate.InsAdminOfficeTranslate.office.delete}
          </a>
        </>
      ),
      enableSorting: false,
    }),
  ];

  const claimServiceRequestList = [
    {
      id: 3,
      office: "Remote Office",
      city: "belleville",
      noOfEmployee: 22,
      status: "active",
    },
  ];

  const table = useReactTable({
    data: claimServiceRequestList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableColumnFilters: false,
  });

  return (
    !editInfo && (
      <div>
        <div className={styles.stickyContainer}>
          <GenericComponentHeading
            customHeadingClassname={styles.headingContainer}
            customTitleClassname={styles.headingTxt}
            title={translate.InsAdminOfficeTranslate.office.offices}
          />
        </div>
        <div className={styles.detailListContainer}>
          <div className={`row ${styles.claimContentContainer}`}>
            <div className="col-auto pe-0 ps-0">
              <GenericButton
                label={translate.InsAdminOfficeTranslate?.office?.addNewOffice}
                theme="normal"
                size="small"
                onClick={() => router.push(`/new-branch`)}
              />
            </div>
            <div className="col-auto pe-0">
              <GenericButton
                label={translate.InsAdminOfficeTranslate?.office?.loadFromFile}
                theme="normal"
                size="small"
              />
            </div>
            <div className="col-lg-4">
              <GenericButton
                label={translate.InsAdminOfficeTranslate?.office?.export}
                theme="normal"
                size="small"
              />
            </div>
            <div className="col-lg-5 col-md-6 col-sm-12 col-12 d-flex justify-content-end">
              <InsAdminSearchBox />
            </div>
          </div>
        </div>
        <div>
          <CustomReactTable table={table} />
        </div>
      </div>
    )
  );
};

export default InsAdminOfficeListComponent;
