import { convertToCurrentTimezone } from "@/utils/helper";
import { getUSDCurrency } from "@/utils/utitlity";

interface rowData {
  [key: string | number]: any;
}
export const findTotal = (row: rowData): string => {
  const got = row?.original?.invoices?.reduce(
    (prev: any, curr: any) => {
      prev = prev + curr.amount;
      return prev;
    },
    row?.original?.amount
  );
  if (got) {
    return getUSDCurrency(got);
  } else {
    return "";
  }
};

export const getDate = (date: string): string => {
  if (date) {
    const dateVal = date.replace("T", " ");
    const unixDate = Date.parse(dateVal);
    const formatedDate = convertToCurrentTimezone(unixDate, "MM/DD/YYYY");
    return formatedDate;
  }
  return "";
};
