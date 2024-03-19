import { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import payoutHolderStyle from "./payoutHolder.module.scss";

import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { fetchPolicyHolderPaymentInfo } from "@/reducers/_adjuster_reducers/ContentsEvaluation/DetailedInventorySlice";
import { addNotification } from "@/reducers/_adjuster_reducers/Notification/NotificationSlice";
import { RootState } from "@/store/store";

import CustomLoader from "@/components/common/CustomLoader/index";
import CustomReactTable from "@/components/common/CustomReactTable/index";
import GenericButton from "@/components/common/GenericButton/index";
import GenericComponentHeading from "@/components/common/GenericComponentHeading/index";
import { convertToCurrentTimezone } from "@/utils/helper";
import { getUSDCurrency } from "@/utils/utitlity";

import { exportPaymentPayout } from "../../DetailedInventoryList/DetailedInventoryFucn";
import ItemPaidTable from "./ItemPaidTable";

const ContentLayout = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className={`row my-3 ${payoutHolderStyle.gap}`}>
      <label
        className={`col-md-4 col-sm-6 control-label ${payoutHolderStyle.labelStyle}`}
      >
        {label}
      </label>
      <span
        className={`col-md-6 col-sm-6 control-label ${
          label === "Customer's Name" || label === "Insurance Company"
            ? `${payoutHolderStyle.textStyle}  ${payoutHolderStyle.fw600}`
            : payoutHolderStyle.textStyle
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const Title = ({ name }: { name: string }) => (
  <div className="col-md-12 col-sm-12 form-group margin-top-20">
    <label
      className={`col-md-4 col-sm-6 control-label fw-bold ${payoutHolderStyle.bold}`}
    >
      <u>{name}</u>
    </label>
  </div>
);

interface payoutHolderData {
  [key: string | number]: any;
}

type PayoutHolderInfoProps = {
  fetchPolicyHolderPaymentInfo: any;
  policyHolderPaymentInfofetching: boolean;
  data: any;
  id: number;
  handleBack: any;
};

const PayoutHolderInfo = (props: PayoutHolderInfoProps) => {
  const {
    data,
    policyHolderPaymentInfofetching,
    fetchPolicyHolderPaymentInfo,
    id,
    handleBack,
  } = props;
  const dateFormate = "MMM DD, YYYY h:mm A";
  const [isExportfetching, setIsExportfetching] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchPolicyHolderPaymentInfo({
      paymentInfoId: id,
    });
  }, [fetchPolicyHolderPaymentInfo, id]);

  const handleExportPDF = async () => {
    setIsExportfetching(true);
    const status = await exportPaymentPayout(id);
    if (status === "success") {
      setIsExportfetching(false);
      dispatch(
        addNotification({
          message: "Successfully download the pdf!",
          id: "good",
          status: "success",
        })
      );
    } else if (status === "error") {
      setIsExportfetching(false);
      dispatch(
        addNotification({
          message: "Failed to export the details. Please try again..",
          id: "error",
          status: "error",
        })
      );
    }
  };
  const columnHelper = createColumnHelper<payoutHolderData>();
  const columns = [
    columnHelper.accessor("checkNumber", {
      header: () => "Reference/Check #",
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("paymentDate", {
      header: () => "Payment Date",
      cell: (info: any) => convertToCurrentTimezone(info.getValue(), dateFormate),
    }),
    columnHelper.accessor("payAmount", {
      header: () => "Payment Mode",
      cell: () => <span>CHECK</span>,
    }),
    columnHelper.accessor("payAmount", {
      cell: (info: any) => getUSDCurrency(info.getValue()),
      header: () => "Payment Amount",
    }),
  ];
  const table = useReactTable({
    data: data ? [data] : [],
    columns,
    pageCount: 20,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
    enableSorting: true,
    enableColumnFilters: false,
  });
  return (
    <>
      {policyHolderPaymentInfofetching ? (
        <div>
          <CustomLoader />
        </div>
      ) : (
        <div className={`container-fluid`}>
          <div className="row">
            <div className={`${payoutHolderStyle.payoutHeaderContainer} mt-4`}>
              <GenericComponentHeading
                title={`Reference # ${data?.checkNumber}`}
                customHeadingClassname={payoutHolderStyle.payoutHeader}
              />
              <div className={payoutHolderStyle.payoutBtnContainer}>
                <GenericButton
                  label={"Back"}
                  theme="normal"
                  size="small"
                  type="submit"
                  btnClassname={payoutHolderStyle.backBtn}
                  onClickHandler={handleBack}
                />
                <GenericButton
                  label={"Export to PDF"}
                  theme="normal"
                  size="small"
                  type="submit"
                  btnClassname={payoutHolderStyle.exportBtn}
                  onClick={handleExportPDF}
                />
              </div>
              <div className="row mt-4">
                <div className="col-md-6 col-sm-12">
                  <Title name="Payment made to" />
                  <ContentLayout
                    label="Customer's Name"
                    value={data?.policyHolderDTO?.firstName ?? ""}
                  />
                  <ContentLayout
                    label="Address"
                    value={data?.policyHolderDTO?.address.completeAddress ?? ""}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <Title name="From" />
                  <ContentLayout
                    label="Insurance Company"
                    value={data?.companyDTO?.companyName}
                  />
                  <ContentLayout label="Adjuster's Name" value={data?.adjusterName} />
                  <ContentLayout
                    label="Branch Office"
                    value={data?.companyDTO?.homeBranchName}
                  />
                  <ContentLayout
                    label="Billing Address"
                    value={data?.companyDTO?.companyAddress}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row p-4">
            {!policyHolderPaymentInfofetching && (
              <>
                <CustomReactTable showFooter={true} table={table} />
                <div className="row p-4">
                  <ItemPaidTable
                    recvData={data?.items}
                    fetching={policyHolderPaymentInfofetching}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {isExportfetching && <CustomLoader />}
    </>
  );
};
const mapStateToProps = (state: RootState) => ({
  data: state.detailedInventorydata?.policyHolderPaymentInfoData,
  policyHolderPaymentInfofetching:
    state.detailedInventorydata?.policyHolderPaymentInfofetching,
});

const mapDispatchToProps = {
  fetchPolicyHolderPaymentInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(PayoutHolderInfo);
