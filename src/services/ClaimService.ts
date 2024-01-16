import { getHeaderWithoutToken } from "@/utils/HeaderService";
import { getApiEndPoint } from "./ApiEndPointConfig";
import store from "@/store/store";
import { addClaimListData } from "@/reducers/ClaimData/ClaimSlice";
// import { addUrgentClaimListData } from "@/reducers/UrgentClaimData/UrgentClaimSlice";
import HttpService from "@/HttpService";
import { getClientCookie } from "@/utils/utitlity";
import { TABLE_LIMIT_20 } from "@/constants/constants";

interface objectType {
  [key: string | number]: any;
}
export const claimList = async (payload: any, token: any): Promise<objectType> => {
  const headersData: object = getHeaderWithoutToken();
  // const headersData: object = getHeader();
  return new Promise((resolve, rejects) => {
    fetch(getApiEndPoint("claimList"), {
      method: "POST",
      headers: { ...headersData, "X-Auth-Token": token },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        return resolve({ result });
      })
      .catch((error) => rejects({ error }));
  });
};

export const fetchClaimList = async (
  pageNumber = 1,
  limit = 20,
  sortBy = "createDate",
  orderBy = "desc",
  searchKeyword = "",
  statusIds = null
) => {
  const state = store.getState();
  searchKeyword = state.claimdata.searchKeyword;
  statusIds = state.claimdata.statusIds;
  const userId = await getClientCookie("userId");
  const token = await getClientCookie("accessToken");

  const payload = {
    assignedUserId: userId,
    pagination: {
      pageNumber,
      limit,
      sortBy,
      orderBy,
    },
    searchKeyword,
    statusIds,
  };

  const claimListRes: any = await claimList(payload, token);

  if (claimListRes.result.status === 200) {
    const claimData = claimListRes.result;
    store.dispatch(addClaimListData({ claimData: claimData }));
    return claimData;
  }
  return null;
};

// export const urgentClaimList = async (payload: any, token: any) => {
//   const headersData: object = getHeaderWithoutToken();
//   return new Promise((resolve, rejects) => {
//     fetch(getApiEndPoint("urgentClaimUrl"), {
//       method: "POST",
//       headers: { ...headersData, "X-Auth-Token": token },
//       body: JSON.stringify(payload),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         return resolve({ result });
//       })
//       .catch((error) => rejects({ error }));
//   });
// };

type urgentClaimReq = {
  pageNumber?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: string;
  searchKeyword?: string;
  userId: string | null;
};
export const fetchUrgentClaimList = async (
  {
    pageNumber = 1,
    limit = TABLE_LIMIT_20,
    sortBy = "createDate",
    orderBy = "desc",
    searchKeyword = "",
    userId,
  }: urgentClaimReq,
  isClient = false
) => {
  const url = getApiEndPoint("urgentClaimUrl");
  const payload = {
    userId,
    pagination: {
      pageNumber: pageNumber,
      limit: limit,
      sortBy,
      orderBy,
    },
    searchKeyword,
  };
  const http = new HttpService({ isClient });
  const res = await http.post(url, payload);
  return res;
  // const state = store.getState();
  // searchKeyword = state.urgentclaimdata.searchKeyword;
  // statusIds = state.urgentclaimdata.statusIds;
  // const userId = await getClientCookie("userId");
  // const token = await getClientCookie("accessToken");

  // const payload = {
  //   assignedUserId: userId,
  //   pagination: {
  //     pageNumber,
  //     limit,
  //     sortBy,
  //     orderBy,
  //   },
  //   searchKeyword,
  //   statusIds,
  // };

  // const urgentClaimListRes: any = await urgentClaimList(payload, token);
  // console.log("UrgentclaimListRes", urgentClaimListRes);

  // if (urgentClaimListRes.result.status === 200) {
  //   const urgentClaimData = urgentClaimListRes.result;
  //   store.dispatch(addUrgentClaimListData({ urgentClaimData }));
  //   return urgentClaimData;
  // }
  // return null;
};

type pendingInvoiceReq = {
  pageNumber?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: string;
  searchKeyword?: string;
  userId: string | null;
};
export const fetchPendingInvoice = async (
  {
    pageNumber = 1,
    limit = TABLE_LIMIT_20,
    sortBy = "createDate",
    orderBy = "desc",
    searchKeyword = "",
    userId,
  }: pendingInvoiceReq,
  isClient?: boolean
) => {
  const url = getApiEndPoint("pendingInvoiceUrl");
  const payload = {
    userId,
    pagination: {
      pageNumber: pageNumber,
      limit: limit,
      sortBy,
      orderBy,
    },
    searchString: searchKeyword,
  };
  const http = new HttpService({ isClient });
  const res = await http.post(url, payload);
  return res;
};

export const getNotification = async (param: object, isClient: boolean = false) => {
  try {
    const url = getApiEndPoint("notification");
    const http = new HttpService({ isClient });
    const res = await http.post(url, param);
    const { data, error } = res;
    if (!error) {
      return data;
    }
    throw error;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const deleteNotification = async (param: object) => {
  const url = getApiEndPoint("deleteNotification");
  const http = new HttpService({ isClient: true });
  const res = await http.delete(url, param);
  const { error } = res;
  if (!error) return res;
  throw error;
};

export const validateEmail = async (param: object) => {
  const url = getApiEndPoint("postEmail");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, param);
  const { data, error } = res;
  if (data) return { data };
  throw error;
};

export const fetchPolicyType = async (id: number) => {
  const url = getApiEndPoint("getPolicyType") + id;
  const http = new HttpService({ isClient: true });
  const res = await http.get(url);
  const { data, error } = res;
  console.log("logggg", res);
  if (data) return { data };
  throw error;
};

export const validateClaim = async (param: object) => {
  const url = getApiEndPoint("detailsClaim");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, param);
  console.log("logggg", res);
  return res;
};

export const fetchState = async (param: object) => {
  const url = getApiEndPoint("stateOption");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, param);
  console.log("logggg", res);
  return res;
};
export const fetchLossType = async () => {
  const url = getApiEndPoint("lossTypeOption");
  const http = new HttpService({ isClient: true });
  const res = await http.get(url);
  console.log("logggg", res);
  return res;
};

export const fetchHomeOwnersType = async (stateId: number, policyTypeId: number) => {
  const url =
    getApiEndPoint("homeOwnersType") +
    "?stateId=" +
    stateId +
    "&policyTypeId=" +
    policyTypeId;
  const http = new HttpService({ isClient: true });
  const res = await http.get(url);
  const { data, error } = res;
  console.log("coverage", res);
  if (data) return { data };
  throw error;
};

export const fetchExcelCsvTableData = async (payload: any) => {
  const url = getApiEndPoint("excelcsvuploaddata");
  const http = new HttpService({ isClient: true, isFormData: true });
  const res = await http.post(url, payload);
  return res;
};

export const getCategories = async () => {
  const url = getApiEndPoint("categoriesRequest");
  const http = new HttpService({ isClient: true });
  const res = await http.get(url);
  const { data, error } = res;
  console.log("coverage", res);
  if (data) return { data };
  throw error;
};

export const postClaim = async (param: object) => {
  console.log("param", param);
  try {
    const url = getApiEndPoint("savePolicy");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { error } = resp;
    if (!error) {
      return resp;
    } else {
      return error;
    }
  } catch (err) {
    return err;
  }
};

export const getPolicyInfo = async (param: object) => {
  const url = getApiEndPoint("policyInfo");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, param);
  const { data, error } = res;
  console.log("coverage", res);
  if (data) return { data };
  throw error;
};

export const creatClaim = async (param: object) => {
  try {
    const url = getApiEndPoint("saveClaim");
    const http = new HttpService({ isClient: true, isFormData: true });
    const resp = await http.post(url, param);
    const { error } = resp;
    if (!error) {
      return resp;
    } else {
      return error;
    }
  } catch (err) {
    return err;
  }
};

export const fetchImportCsvData = async (payload: any) => {
  const url = getApiEndPoint("importCsvTable");
  const http = new HttpService({ isClient: true, isFormData: false });
  const res = await http.post(url, payload);
  return res;
};

export const fetchAddItemsTableCSVData = async (payload: any) => {
  const url = getApiEndPoint("addItemsListTable");
  const http = new HttpService({ isClient: true, isFormData: false });
  const res = await http.post(url, payload);
  return res;
};
