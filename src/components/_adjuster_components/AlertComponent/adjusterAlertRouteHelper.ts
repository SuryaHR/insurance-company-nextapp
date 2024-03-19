import { unknownObjectType } from "@/constants/customTypes";
import { useRouter } from "next/navigation";

export const gotoAlertDetails = (
  alert: unknownObjectType,
  router: ReturnType<typeof useRouter>
) => {
  console.log("alert@", alert);
  if (alert?.notificationParams?.quoteNumber) {
    sessionStorage.setItem("ClaimNumber", alert.notificationParams.claimNumber);
    sessionStorage.setItem("ClaimId", alert.notificationParams.claimId);
    sessionStorage.setItem("assignmentNumber", alert.notificationParams.assignmentNumber);
    sessionStorage.setItem("quoteNumber", alert.notificationParams.quoteNumber);
    return router.push(`/view-quote/${alert.notificationParams.quoteNumber}`);
  } else if (
    alert.notificationParams.claimId != null &&
    alert.notificationParams.claimNumber != null &&
    (!alert.notificationParams.invoiceId || alert.notificationParams.invoiceId == null) &&
    (!alert.notificationParams.accountPayableId ||
      alert.notificationParams.accountPayableId == null) &&
    (!alert.notificationParams.salvageId || alert.notificationParams.salvageId == null)
  ) {
    if (alert.type.type === "ALERT") {
      sessionStorage.setItem("ShowNoteActive", "true");
      sessionStorage.setItem("ShowEventActive", "false");
    } else if (alert.type.type === "EVENT") {
      sessionStorage.setItem("ShowEventActive", "true");
      sessionStorage.setItem("ShowNoteActive", "false");
    } else {
      sessionStorage.setItem("ShowEventActive", "false");
      sessionStorage.setItem("ShowNoteActive", "true");
    }
    //URL for Note
    if (alert.notificationParams && alert.notificationParams.isClaimNote) {
      sessionStorage.setItem("AllNoteClaimNumber", alert.notificationParams.claimNumber);
      sessionStorage.setItem("AllNoteClaimId", alert.notificationParams.claimId);
      sessionStorage.setItem("messageGrpId", alert.notificationParams.messageGrpId);
      return router.push(`/all-notes/${alert.notificationParams.claimId}`);
    } else if (alert.notificationParams && alert.notificationParams.itemId) {
      if (alert.notificationParams.isItemNote)
        sessionStorage.setItem("ForwardTab", "notes");
      sessionStorage.setItem("AdjusterPostLostItemId", alert.notificationParams.itemId);
      return router.push(
        `/adjuster-line-item-detail/${alert.notificationParams?.claimId}/${alert.notificationParams?.itemId}`
      );
    } else if (sessionStorage.getItem("isCoreLogic") == "true") {
      return router.push("/CorelogicAdjusterPropertyClaimDetails");
    } else {
      return router.push(
        `/adjuster-property-claim-details/${alert.notificationParams.claimId}`
      );
    }
  } else if (
    alert.notificationParams.invoiceId ||
    alert.notificationParams.invoiceId != null
  ) {
    console.log("route@33333");
    const ObjDetails = {
      InvoiceNo: alert.notificationParams.invoiceNumber,
      ClaimNo: "",
      isServiceRequestInvoice: false,
      PageName: "BillsAndPayments",
    };
    sessionStorage.setItem("Details", JSON.stringify(ObjDetails));
    // $location.url('VendorInvoiceDetails');
    return router.push(`/view-invoice/${alert.notificationParams.invoiceNumber}`);
  } else if (
    alert.notificationParams.accountPayableId ||
    alert.notificationParams.accountPayableId != null
  ) {
    console.log("redirect to PayableDetail page - route not implemented");
    const ObjDetails = {
      InvoiceNo: alert.notificationParams.accountPayableInvoiceNumber,
      isServiceRequestInvoice: false,
      PageName: "Payable",
    };
    sessionStorage.setItem("Details", JSON.stringify(ObjDetails));
    // $location.url('PayableDetails');
  } else if (
    alert.notificationParams.claimNumber &&
    alert.notificationParams.salvageId == null
  ) {
    console.log("route@555");
    sessionStorage.setItem("ClaimNo", alert.notificationParams.claimNumber);
    sessionStorage.setItem("ShowNoteActive", "true");
    sessionStorage.setItem("ShowEventActive", "false");
    if (sessionStorage.getItem("isCoreLogic") == "true") {
      //   $location.url("CorelogicAdjusterPropertyClaimDetails");
      console.log("redirect@CorelogicAdjusterPropertyClaimDetails");
    } else {
      return router.push(
        `/adjuster-property-claim-details/${alert.notificationParams.claimId}`
      );
    }
  } else if (
    alert.notificationParams.salvageId &&
    alert.notificationParams.salvageId != null
  ) {
    sessionStorage.setItem("ClaimNo", alert.notificationParams.claimNumber);
    sessionStorage.setItem("AdjusterClaimNo", alert.notificationParams.claimNumber);
    sessionStorage.setItem("AdjusterClaimId", alert.notificationParams.claimId);
    sessionStorage.setItem("AdjusterPostLostItemId", alert.notificationParams.itemId);
    sessionStorage.setItem("ForwardTab", "Salvage");
    return router.push(
      `/adjuster-line-item-detail/${alert.notificationParams?.claimId}/${alert.notificationParams?.itemId}`
    );
  }
};
