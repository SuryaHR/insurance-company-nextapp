"use client";
import React, { useEffect, useState } from "react";
import GenericComponentHeading from "../../../common/GenericComponentHeading";
import { getPendingVendorInvoices } from "@/services/_adjuster_services/AdjusterDashboardService";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import pendingVendorCardsStyle from "./pending-vendor-card.module.scss";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { addPendingVendorInvoiceData } from "@/reducers/_adjuster_reducers/AdjusterDashboard/AdjusterDashboardSlice";
import selectLoggedInUserId from "@/reducers/Session/Selectors/selectLoggedInUserId";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/store";
import CustomLoader from "@/components/common/CustomLoader";
import Cards from "@/components/common/Cards";
import selectNonPolicyHolderTypeInvoices from "@/reducers/_adjuster_reducers/AdjusterDashboard/Selectors/selectNonPolicyHolderTypeInvoices";
import PendingComponent from "../../PendingComponent";

interface PendingVendorCardsProps {
  translate?: any;
}

const PendingVendorCards: React.FC<connectorType & PendingVendorCardsProps> = ({
  translate,
  userId,
  pendingInvoicesData,
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getPendingVendorInvoicesData = async () => {
      setIsLoading(true);
      try {
        const resp = await getPendingVendorInvoices({ userId }, true);
        if (resp?.status === 200) {
          dispatch(addPendingVendorInvoiceData(resp?.data));
        }
      } finally {
        setIsLoading(false);
      }
    };
    getPendingVendorInvoicesData();
  }, [dispatch, userId]);

  if (isLoading) {
    return (
      <div className={pendingVendorCardsStyle.loaderContainer}>
        <CustomLoader loaderType="spinner2" />
      </div>
    );
  }

  return (
    <>
      <Cards>
        <GenericComponentHeading
          title={
            translate?.adjusterDashboardTranslate?.adjusterDashboard?.PendingVendorCards
              ?.pendingVendorInvoices +
            `(${pendingInvoicesData?.length > 0 ? pendingInvoicesData?.length : 0})`
          }
        />
        {pendingInvoicesData?.length > 0 ? (
          <PendingComponent
            pendingInvoice={pendingInvoicesData[0]}
            translate={translate}
          />
        ) : (
          <div className={pendingVendorCardsStyle.noRecordContainer}>
            <NoRecordComponent
              message={
                translate?.adjusterDashboardTranslate?.adjusterDashboard
                  ?.PendingVendorCards?.NoRecordComponent.message
              }
            />
          </div>
        )}
      </Cards>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  userId: selectLoggedInUserId(state),
  pendingInvoicesData: selectNonPolicyHolderTypeInvoices(state),
});
const connector = connect(mapStateToProps, null);
type connectorType = ConnectedProps<typeof connector>;
export default connector(PendingVendorCards);
