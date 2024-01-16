import {
  getCoverageSummaryPDF,
  getDetailInventoryExcel,
  getDetailInventoryPDF,
  getSendDetailedInventory,
} from "@/services/ContentsEvaluationService";

export async function exportDetailedInventoryToPDF(ClaimNumber: string) {
  const param = {
    claimNumber: ClaimNumber,
    reqForReceiptMapper: false,
    reqForPdfExport: true,
    reqForPayoutSummary: false,
    reqForRoomWiseItems: true,
    reqForCoverageSummary: true,
    showThirdPartyInsDetails: true,
  };

  const fileDetails = await getDetailInventoryPDF(param);
  if (fileDetails && fileDetails.status === 200) {
    try {
      const blob = await fileDetails.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `DetailedInventory-${ClaimNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      return "success";
    } catch (ex) {
      return "error";
    }
  } else {
    return "error";
  }
}

export async function exportPaymentSummaryToPDF(ClaimNumber: string) {
  const param = {
    claimNumber: ClaimNumber,
    reqForCoverageSummary: false,
    reqForPayoutSummary: true,
    reqForPdfExport: true,
    reqForReceiptMapper: false,
    reqForRoomWiseItems: false,
  };

  const fileDetails = await getCoverageSummaryPDF(param);
  if (fileDetails && fileDetails.status === 200) {
    try {
      const blob = await fileDetails.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${ClaimNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      return "success";
    } catch (ex) {
      return "error";
    }
  } else {
    return "error";
  }
}
export async function exportCoverageSummaryToPDF(ClaimNumber: string) {
  const param = {
    claimNumber: ClaimNumber,
  };

  const fileDetails = await getCoverageSummaryPDF(param);
  if (fileDetails && fileDetails.status === 200) {
    try {
      const blob = await fileDetails.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `Coverage-Summary-${ClaimNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      return "success";
    } catch (ex) {
      return "error";
    }
  } else {
    return "error";
  }
}

export async function sendDetailedInventory(ClaimNumber: string) {
  const param = {
    claimNumber: ClaimNumber,
  };

  const fileDetails = await getSendDetailedInventory(param);
  try {
    return fileDetails;
  } catch (ex) {
    return ex;
  }
}

export const exportDetailedInventory = async function (
  ClaimNumber: string,
  type: string
) {
  const claimDetails = {
    claimNumber: ClaimNumber,
    format: type,
  };
  const fileDetails = await getDetailInventoryExcel(claimDetails);
  if (fileDetails && fileDetails.status === 200) {
    try {
      const blob = await fileDetails.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `Detailed Inventory-${ClaimNumber}.xls`);
      document.body.appendChild(link);
      link.click();
      return "success";
    } catch (error) {
      return error;
    }
  } else {
    return "error";
  }
};
