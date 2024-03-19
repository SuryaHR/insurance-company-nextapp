import store from "@/store/store";
import HttpService from "@/HttpService";
import { addClaimedItemsListData } from "@/reducers/_adjuster_reducers/ReceiptMapper/ClaimedItemsSlice";
import {
  addMappedlineitems,
  receiptMapperDate,
} from "@/reducers/_adjuster_reducers/ReceiptMapper/ReceiptMapperSlice";
import { getApiEndPoint } from "../ApiEndPointConfig";
import { getDetailInventoryPDF } from "../ContentsEvaluationService";

export const getClaimedItems = async (param: object) => {
  try {
    const url = getApiEndPoint("mapperClaimedItems");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { status } = resp;

    if (status === 200) {
      store.dispatch(addClaimedItemsListData({ claimedData: resp }));
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};

export const receiptApiUrl = async (payload: any) => {
  try {
    const url = getApiEndPoint("receiptApi");
    const http = new HttpService({ isClient: true, isFormData: true });
    const res = await http.post(url, payload);

    if (res.status === 200) {
      return res.message;
    }
    return null;
  } catch (error) {
    console.error("Error uploading the pdf", error);
    return null;
  }
};

export const getReceiptMapperDate = async (param: object) => {
  try {
    const url = getApiEndPoint("receiptMapperDateApi");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { status } = resp;

    if (status === 200) {
      store.dispatch(receiptMapperDate({ receiptMapperPdf: resp.data }));
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};

export const getMappedlineitems = async (param: object) => {
  try {
    const url = getApiEndPoint("mappedlineitems");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { status } = resp;

    if (status === 200) {
      store.dispatch(addMappedlineitems({ mappedlineitemsList: resp }));
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};

export const addAttachitemreplacementcost = async (param: object) => {
  try {
    const url = getApiEndPoint("attachitemreplacementcost");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { status } = resp;

    if (status === 200) {
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};

export const updateMappedLineItem = async (param: object) => {
  try {
    const url = getApiEndPoint("edititemreplacementcost");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { status } = resp;

    if (status === 200) {
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};

export const deleteMappedLineItem = async (param: object) => {
  try {
    const url = getApiEndPoint("deleteitemreplacementcost");
    const http = new HttpService({ isClient: true });
    const resp = await http.delete(url, param);
    const { status } = resp;

    if (status === 200) {
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};
export const updateItemStatusSettled = async (param: object) => {
  try {
    const url = getApiEndPoint("updateItemStatusSettled");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { status } = resp;

    if (status === 200) {
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};

export const tagGetApi = async (param: object) => {
  try {
    const url = getApiEndPoint("tagGetApi");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { status } = resp;

    if (status === 200) {
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};
export async function exportSummaryToPDF(ClaimNumber: string) {
  const param = {
    claimNumber: ClaimNumber,
    reqForCoverageSummary: true,
    reqForPayoutSummary: true,
    reqForPdfExport: true,
    reqForReceiptMapper: true,
    reqForRoomWiseItems: true,
  };

  const fileDetails = await getDetailInventoryPDF(param);
  if (fileDetails && fileDetails.status === 200) {
    try {
      const blob = await fileDetails.blob();
      const newBlob = new Blob([blob]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `CoverageSummary-${ClaimNumber}.pdf`);
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

export const addTag = async (param: object) => {
  try {
    const url = getApiEndPoint("tadAddApi");
    const http = new HttpService({ isClient: true });
    const resp = await http.post(url, param);
    const { status } = resp;

    if (status === 200) {
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};

export const deleteTag = async (param: object) => {
  try {
    const url = getApiEndPoint("tagDeleteApi");
    const http = new HttpService({ isClient: true });
    const resp = await http.delete(url, param);
    const { status } = resp;

    if (status === 200) {
      return resp;
    } else {
      return resp.error;
    }
  } catch (err) {
    return err;
  }
};
