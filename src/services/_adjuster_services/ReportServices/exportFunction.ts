import { getExportClaimsforReport } from "./ClaimReportService";

export async function exportClaimsforReportPDF() {
  const payload = {
    reportStartDate: "01-01-2024T00:00:00Z",
    reportEndDate: "02-15-2024T00:00:00Z",
    orderBy: 0,
    keyword: "",
    salvageStatus: [],
    pageNumber: 1,
    recordsPerPage: 20,
    reportType: "claim",
    adjusterIds: ["94"],
    supervisorId: null,
    columnList: ["Assignment #", "# of Items", "Material Cost $", "Labor Cost $"],
  };

  const fileDetails = await getExportClaimsforReport(payload);
  if (fileDetails && fileDetails.status === 200) {
    try {
      const blob = await fileDetails.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `claim-report.xls`);
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
