"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Assignments.module.scss";
import {
  getVendorAssignments,
  getVendorAssignmentsCont,
} from "@/services/_adjuster_services/AdjusterPropertyClaimDetailServices/AdjusterPropertyClaimDetailService";
import dynamic from "next/dynamic";
import CustomLoader from "@/components/common/CustomLoader";
import { convertToCurrentTimezone } from "@/utils/helper";
import Loading from "@/app/[lang]/loading";
import CustomReactTable from "@/components/common/CustomReactTable";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import AssignmentDetails from "../AssignmentDetails/AssignmentDetails";
import { addClaimContentListData } from "@/reducers/_adjuster_reducers/ClaimData/ClaimContentSlice";
import { connect } from "react-redux";
import { claimContentList } from "@/services/_adjuster_services/ClaimContentListService";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { useContext } from "react";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { claimDetailTranslatePropType } from "@/app/[lang]/(adjuster)/(dashboardLayout)/adjuster-property-claim-details/[claimId]/page";
import { addContents } from "@/reducers/_adjuster_reducers/ClaimDetail/ClaimDetailSlice";

const AssignItemsComponent = dynamic(
  () =>
    import("@/components/_adjuster_components/NewclaimsComponent/AssignItemsComponent"),
  {
    loading: () => <Loading />,
  }
);

function Assignments() {
  const { translate } =
    useContext<TranslateContextData<claimDetailTranslatePropType>>(TranslateContext);

  const [AssignmentData, setAssignmentData] = useState<any>([]);
  const [AssignmentContData, setAssignmentContData] = useState<any>({});
  const [itemsWithVendors, setItemsWithVendors] = useState<any>(0);
  const [showVenderAss, setShowVenderAss] = useState<any>(
    sessionStorage.getItem("createVendorAss") ? true : false
  );
  const claimId = sessionStorage.getItem("claimId") || "";
  const claimNumber = sessionStorage.getItem("claimNumber") || "";
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [showAssignmentDetails, setShowAssignmentDetails] = useState<boolean>(false);
  const [assignmentId, setShowAssignmentId] = useState<string>("");
  const dispatch = useAppDispatch();

  type AssignItemsData = {
    assignmentNumber: string;
    vendorDetails: any;
    noOfAssignedItems: string;
    requestedServices: string;
    assignmentStatus: any;
    startDate: string;
    firstTouch: string;
    maxClainTimeAgreed: any;
    timeTaken: string;
  };
  const isUnmount: any = useRef(false);

  const init = React.useCallback(async () => {
    const payload = {
      claimId: claimId,
      claimNumber: claimNumber,
    };
    try {
      setIsLoader(true);
      let ListRes = await getVendorAssignments(payload);
      if (ListRes?.data?.itemsWithVendors) {
        setItemsWithVendors(ListRes?.data?.itemsWithVendors);
      }
      ListRes = ListRes?.data?.claimAssignmentVendors.map(
        ({
          assignmentNumber,
          vendorDetails,
          noOfAssignedItems,
          requestedServices,
          assignmentStatus,
          startDate,
          firstTouch,
          maxClainTimeAgreed,
          timeTaken,
        }: any) => ({
          assignmentNumber,
          vendorDetails: vendorDetails?.vendorName,
          noOfAssignedItems,
          requestedServices: requestedServices?.[0]?.name,
          assignmentStatus: assignmentStatus?.name,
          startDate: startDate ? convertToCurrentTimezone(startDate) : "",
          firstTouch: firstTouch ? convertToCurrentTimezone(firstTouch) : "",
          maxClainTimeAgreed: maxClainTimeAgreed,
          timeTaken: timeTaken,
        })
      );
      setAssignmentData(ListRes);
      const Res = await getVendorAssignmentsCont(payload);
      setAssignmentContData(Res);
      if (Res?.data) {
        dispatch(addContents(Res?.data));
      }
    } catch (err) {
      console.error("err::", err);
    } finally {
      setIsLoader(false);
    }
  }, [claimId, claimNumber, dispatch]);

  const handleRowClick = (rowData: any) => {
    setShowAssignmentId(rowData.assignmentNumber);
    setShowAssignmentDetails(true);
  };

  useEffect(() => {
    init();

    return () => {
      if (isUnmount) {
        sessionStorage.removeItem("createVendorAss");
      } else if (!isUnmount) {
        isUnmount.current = true;
      }
    };
  }, [init]);

  const columnHelper = createColumnHelper<AssignItemsData>();
  const columns = [
    columnHelper.accessor("assignmentNumber", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.assignmentId,
      enableSorting: true,
    }),
    columnHelper.accessor("vendorDetails", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.vendorName,
      enableSorting: true,
    }),
    columnHelper.accessor("noOfAssignedItems", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.items,
      enableSorting: true,
    }),
    columnHelper.accessor("requestedServices", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.servicerequested,
      enableSorting: true,
    }),
    columnHelper.accessor("assignmentStatus", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.status,
      enableSorting: true,
    }),
    columnHelper.accessor("startDate", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.startDate,
      enableSorting: true,
    }),
    columnHelper.accessor("firstTouch", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.firstTouch,
      enableSorting: true,
    }),
    columnHelper.accessor("maxClainTimeAgreed", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.maxClaim,
      enableSorting: true,
    }),
    columnHelper.accessor("timeTaken", {
      header: () => translate?.vendorAssignmentTranslate?.assignmnets?.timeTaken,
      enableSorting: true,
    }),
  ];

  const table = useReactTable({
    data: AssignmentData ? AssignmentData : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    manualFiltering: false,
    enableColumnFilters: false,
  });

  const itemListApi = async () => {
    const payload = {
      claimId: claimId,
    };
    const claimContentListRes: any = await claimContentList(payload, true);
    if (claimContentListRes) {
      dispatch(
        addClaimContentListData({ claimContentData: claimContentListRes, claimId })
      );
    }
  };

  const handleAfterSubmit = (res: any) => {
    if (res == "success") {
      setShowVenderAss(false);
      sessionStorage.removeItem("createVendorAss");
      init();
      itemListApi();
    } else {
      sessionStorage.removeItem("createVendorAss");
      init();
      itemListApi();
    }
  };

  return (
    <div className={styles.assignmentsCont}>
      {!showAssignmentDetails ? (
        <>
          {isLoader && <CustomLoader loaderType="spinner1" />}
          {!showVenderAss && (
            <div>
              <div className={styles.itemsCont}>
                <div className={styles.card}>
                  <label className={styles.itemDetails}>{itemsWithVendors}</label>
                  <label className={styles.itemDetails}>
                    {translate?.vendorAssignmentTranslate?.assignmnets?.itemsWithVendors}
                  </label>
                </div>
                <div className={styles.card}>
                  <label className={styles.itemDetails}>
                    {AssignmentContData?.data?.itemProcessedByVendor
                      ? AssignmentContData?.data?.itemProcessedByVendor
                      : "0"}
                  </label>
                  <label className={styles.itemDetails}>
                    {translate?.vendorAssignmentTranslate?.assignmnets?.itemsProcessed}
                  </label>
                </div>
              </div>
              <div className={styles.assignmentTable}>
                {!isLoader && (
                  <CustomReactTable
                    table={table}
                    tableDataErrorMsg={
                      !AssignmentData
                        ? translate?.vendorAssignmentTranslate?.assignmnets?.noRecord
                        : ""
                    }
                    handleRowClick={handleRowClick}
                  />
                )}
              </div>
            </div>
          )}
          {showVenderAss && (
            <div>
              <AssignItemsComponent
                handleAfterSubmit={handleAfterSubmit}
                hidePrevAndHeaderProp={true}
              />
            </div>
          )}
        </>
      ) : (
        <AssignmentDetails assignmentId={assignmentId} />
      )}
    </div>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  addClaimContentListData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Assignments);
