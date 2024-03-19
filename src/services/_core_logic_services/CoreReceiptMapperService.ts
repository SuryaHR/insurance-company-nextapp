import HttpService from "@/HttpService";
import { getApiEndPoint } from "../_adjuster_services/ApiEndPointConfig";

export const getClaimedItems = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("mapperClaimedItems");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const receiptApiUrl = async (payload: any, token: string) => {
  try {
    const url = getApiEndPoint("receiptApi");
    const http = new HttpService({ isPublic: true, isFormData: true });
    const headers = { ["X-Auth-Token"]: token };
    const res = await http.post(url, payload, headers);

    if (res.status === 200) {
      return res.message;
    }
    return null;
  } catch (error) {
    console.error("Error uploading the pdf", error);
    return null;
  }
};

export const getReceiptMapperDate = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("receiptMapperDateApi");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const getMappedlineitems = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("mappedlineitems");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const addAttachitemreplacementcost = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("attachitemreplacementcost");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const updateMappedLineItem = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("edititemreplacementcost");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const deleteMappedLineItem = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("deleteitemreplacementcost");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };

    const resp = await http.delete(url, param, headers);
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
export const updateItemStatusSettled = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("updateItemStatusSettled");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const tagGetApi = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("tagGetApi");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const getDetailInventoryPDF = async function (param: object, token: string) {
  try {
    const http = new HttpService({ isPublic: true });
    let url = getApiEndPoint("detailedInventoryReportPDF");
    url = `${url}`;
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.getFileByPayload(url, param, headers);
    return resp;
  } catch (err: any) {
    return null;
  }
};
export async function exportSummaryToPDF(ClaimNumber: string, token: string) {
  const param = {
    claimNumber: ClaimNumber,
    reqForCoverageSummary: true,
    reqForPayoutSummary: true,
    reqForPdfExport: true,
    reqForReceiptMapper: true,
    reqForRoomWiseItems: true,
  };

  const fileDetails = await getDetailInventoryPDF(param, token);
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

export const addTag = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("tadAddApi");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.post(url, param, headers);
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

export const deleteTag = async (param: object, token: string) => {
  try {
    const url = getApiEndPoint("tagDeleteApi");
    const http = new HttpService({ isPublic: true });
    const headers = { ["X-Auth-Token"]: token };
    const resp = await http.delete(url, param, headers);
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
