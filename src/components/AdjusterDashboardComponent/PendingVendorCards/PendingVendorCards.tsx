import React from "react";
import GenericComponentHeading from "../../common/GenericComponentHeading";
import PendingComponent from "@/components/PendingComponent";
import { cookies } from "next/headers";
import { getPendingVendorInvoices } from "@/services/AdjusterDashboardService";
import NoRecordComponent from "@/components/common/NoRecordComponent/NoRecordComponent";
import pendingVendorCardsStyle from "./pending-vendor-card.module.scss";

const PendingVendorCards: React.FC = async () => {
  const cookieStore = cookies();
  let userId;
  let resp;
  if (cookieStore.has("userId")) {
    userId = cookieStore.get("userId")?.value ?? "";
  }
  try {
    if (userId && userId !== "") {
      resp = await getPendingVendorInvoices({ userId: userId });
    }
  } catch (error) {
    console.log("getImmediateClaims API error::", error);
  }
  const pendingInvoices = resp?.invoiceBaseDTOS?.filter(
    (inv: any) => inv.invoiceType !== "PolicyHolder"
  );
  return (
    <>
      <GenericComponentHeading
        title={`Pending Vendor Invoices (${
          pendingInvoices?.length > 0 ? pendingInvoices.length : 0
        })`}
      />
      {pendingInvoices?.length > 0 ? (
        <PendingComponent pendingInvoice={pendingInvoices[0]} />
      ) : (
        <div className={pendingVendorCardsStyle.noRecordContainer}>
          <NoRecordComponent message="No records available" />
        </div>
      )}
    </>
  );
};

export default PendingVendorCards;
