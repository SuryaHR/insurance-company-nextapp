import { getApiEndPoint } from "../_adjuster_services/ApiEndPointConfig";
import HttpService from "@/HttpService";
import store from "@/store/store";
import { updateVendorInvoicesData } from "@/reducers/_claim_supervisor_reducers/VendorInvoices/InvoicesVendorSlice";

export const vendorInvoicesTableData = async (payload: any) => {
  const url = getApiEndPoint("vendorInvoicesData");
  const http = new HttpService({ isClient: true, isFormData: false });
  const res = await http.post(url, payload);
  return res;
};

export const searchVendorInvoices = async (searchKeyword = "") => {
  const state = store.getState();
  const searchWord = searchKeyword ?? state.vendorInvoices.searchKeyword;
  if (searchWord !== "") {
    const vendorInvoicesDataFull = state.vendorInvoices.vendorInvoicesDataFull;

    const vendorInvoicesListData = await vendorInvoicesDataFull.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(searchWord.toLowerCase())
    );
    store.dispatch(updateVendorInvoicesData({ vendorInvoicesListData }));
    return vendorInvoicesListData;
  } else {
    const vendorInvoicesListAPIData = state.vendorInvoices.vendorInvoicesListAPIData;
    const vendorInvoicesListData = await vendorInvoicesListAPIData;
    store.dispatch(updateVendorInvoicesData({ vendorInvoicesListData }));
    return vendorInvoicesListData;
  }
};
