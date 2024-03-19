import { updateDetailedInventoryListData } from "@/reducers/_adjuster_reducers/ContentsEvaluation/DetailedInventorySlice";
import store from "@/store/store";

import HttpService from "@/HttpService";

import { getApiEndPoint } from "./ApiEndPointConfig";

type param = {
  claimNumber: string;
};

type claimDetails = {
  claimNumber: string;
  format: string;
};

type PDFParamType = {
  claimNumber: string;
  reqForReceiptMapper: boolean;
  reqForPdfExport: boolean;
  reqForPayoutSummary: boolean;
  reqForRoomWiseItems: boolean;
  reqForCoverageSummary: boolean;
  showThirdPartyInsDetails?: boolean | string;
};

type params = {
  claimNumber: string;
  reqForCoverageSummary: boolean;
  reqForPayoutSummary: boolean;
  reqForPdfExport: boolean;
  reqForReceiptMapper: boolean;
  reqForRoomWiseItems: boolean;
};

export const getDetailedInventory = async (
  param: {
    pageNo: number;
    recordPerPage: number;
    claimNum: string;
    sortBy: string;
    orderBy: string;
    q: string;
  },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });

    let url = getApiEndPoint("detailedInventoryReport");
    url = `${url}${param?.claimNum}&page=${param?.pageNo}&limit=${param?.recordPerPage}&sort_by=${param?.sortBy}&order_by=${param?.orderBy}&q=${param?.q}`;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getCoverageSummary = async (
  payload: { claimNumber: string },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });
    let url = getApiEndPoint("coverageSummaryReport");
    url = `${url}`;
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getPolicyholderPayouts = async (
  payload: { claimNumber: string },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });
    let url = getApiEndPoint("policyholderPayouts");
    url = `${url}`;
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getPolicyHolderPaymentInfo = async (
  param: {
    paymentInfoId: number;
  },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });

    let url = getApiEndPoint("policyholderPaymentInfo");
    url = `${url}?paymentInfoId=${param?.paymentInfoId}`;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getSubCategories = async () => {
  try {
    const http = new HttpService({ isClient: true });

    const url = getApiEndPoint("subCategories");
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getPolicySummary = async (
  payload: { claimNumber: string },
  isClient?: boolean
) => {
  try {
    const http = new HttpService({ isClient });
    let url = getApiEndPoint("paymentSummaryTable");
    url = `${url}`;
    const resp = await http.post(url, payload);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const searchDetailedInventory = async (searchKeyword = "") => {
  const state = store.getState();
  const searchWord = searchKeyword ?? state.detailedInventorydata.searchKeyword;
  if (searchWord !== "") {
    const detailedInventoryListDataFull =
      state.detailedInventorydata.detailedInventoryListDataFull;

    const detailedInventoryListData = await detailedInventoryListDataFull.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(searchWord.toLowerCase())
    );
    store.dispatch(updateDetailedInventoryListData({ detailedInventoryListData }));
    return detailedInventoryListData;
  } else {
    const detailedInventoryListAPIData =
      state.detailedInventorydata.detailedInventoryListAPIData;
    const detailedInventoryListData = await detailedInventoryListAPIData;
    store.dispatch(updateDetailedInventoryListData({ detailedInventoryListData }));
    return detailedInventoryListData;
  }
};

export const getDetailInventoryPDF = async function (param: PDFParamType) {
  try {
    const http = new HttpService({ isClient: true });
    let url = getApiEndPoint("detailedInventoryReportPDF");
    url = `${url}`;
    const resp = await http.getFileByPayload(url, param);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getCoverageSummaryPDF = async function (param: params | param) {
  try {
    const http = new HttpService({ isClient: true });
    let url = getApiEndPoint("coverageSummaryReportPDF");
    url = `${url}`;
    const resp = await http.getFileByPayload(url, param);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getDetailInventoryExcel = async function (param: claimDetails) {
  try {
    const http = new HttpService({ isClient: true });
    let url =
      getApiEndPoint("detailedInventoryReportExcel") +
      "?claim=" +
      param.claimNumber +
      "&format=" +
      param.format;
    url = `${url}`;
    const resp = await http.getFile(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getPaymentPayoutInfo = async function (param: { paymentInfoId: number }) {
  try {
    const http = new HttpService({ isClient: true });
    let url =
      getApiEndPoint("paymentPayoutInfoPDF") + "?paymentInfoId=" + param.paymentInfoId;
    url = `${url}`;
    const resp = await http.getFile(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};

export const getSendDetailedInventory = async function (param: param) {
  try {
    const http = new HttpService({ isClient: true });
    let url =
      getApiEndPoint("detailedInventoryReportSend") + "?claimNumber=" + param.claimNumber;
    url = `${url}`;
    const resp = await http.get(url);
    return resp;
  } catch (err: any) {
    return null;
  }
};
