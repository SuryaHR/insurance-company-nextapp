import { convertToCurrentTimezone } from "@/utils/helper";

export const dataMapping = (data: any) => {
  if (data) {
    const TopLeft = {
      "Invoice Id": data.invoiceDetails?.invoiceNumber,
      Status: data.invoiceDetails?.status.status,
      "Invoice Date": dateFormat(data.invoiceDetails?.createDate),
      "Payment Terms": data.invoiceDetails?.paymentTerm.name,
      "Due Date": dateFormat(data.invoiceDetails?.dueDate),
      Currency: data.invoiceDetails?.currencyDetails,
      "Claim #": data.claimNumber,
      "Policyholder's Name": data.insured?.name,
      "Tax Rate": data.invoiceDetails?.taxRate,
      Attachments: "0 Attachments",
      "Contract Details": "Claim Contract",
    };

    const TopRight = {
      "Vendor Company": data.vendor?.vendorName,
      "Invoice Created By": data.invoiceDetails?.createdBy,
      "Remit To Address":
        data.vendorRemitAddress?.streetAddressOne ??
        "" + data.vendorRemitAddress?.streetAddressTwo ??
        "" + data.vendorRemitAddress?.city ??
        "" + data.vendorRemitAddress?.state?.state ??
        "" + data.vendorRemitAddress?.zipcode,
      "Insurance Company": data.invoiceDetails?.insuranceCompany?.name,
      "Adjuster's Names":
        data.invoiceDetails?.adjuster.lastName +
        ", " +
        data.invoiceDetails?.adjuster.firstName,
      "Branch Office": data.branchDetails?.branchName,
      "Billing Address":
        data.branchDetails?.address?.streetAddressOne +
        " " +
        data?.branchDetails?.address?.streetAddressTwo +
        " " +
        data?.branchDetails?.address?.city +
        " " +
        data?.branchDetails?.address?.state.state +
        " " +
        data?.branchDetails?.address?.zipcode,
    };

    const BottomLeft = {
      "Vendor Note": data?.invoiceDetails?.vendorNote,
    };

    const BottomRight = {
      "Grand Total": data?.invoiceDetails?.amount ?? "0",
      "(-) Deductible": data?.invoiceDetails?.deductible ?? "0",
      "(-) Advance payment": data?.invoiceDetails?.advancePayment ?? "0",
      "Total Payable": calculateTotalCost(data),
    };

    return {
      TopLeft,
      TopRight,
      BottomLeft,
      BottomRight,
    };
  } else return null;
};

const dateFormat = (date: any) => {
  return convertToCurrentTimezone(Date.parse(date?.replace("T", " ")), "MM/DD/YYYY");
};

const calculateTotalCost = (data: any) => {
  let totalPayable: any = 0.0;
  if (data?.invoiceDetails && data?.invoiceDetails != null) {
    const amount = parseFloat(data?.invoiceDetails.amount).toFixed(2);
    totalPayable += amount ? parseFloat(amount) : 0.0;
    totalPayable -= data?.invoiceDetails?.advancePayment
      ? parseFloat(data?.invoiceDetails?.advancePayment)
      : 0.0;
    totalPayable -= data?.invoiceDetails?.deductible
      ? parseFloat(data?.invoiceDetails?.deductible)
      : 0.0;
  }
  return totalPayable;
};
