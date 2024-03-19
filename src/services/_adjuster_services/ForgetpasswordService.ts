import { getHeader } from "@/utils/HeaderService";
import { getApiEndPoint } from "./ApiEndPointConfig";

export const forgotPassword = async (payload: any) => {
  const headersData: any = getHeader();
  return new Promise((resolve, rejects) => {
    fetch(getApiEndPoint("forgotPassword"), {
      method: "POST",
      headers: headersData,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        return resolve({ result });
      })
      .catch((error) => rejects({ error }));
  });
};
export const getRandomQuestionsForUser = async (payload: any) => {
  const headersData: any = getHeader();
  return new Promise((resolve, rejects) => {
    fetch(getApiEndPoint("randomQuestion") + payload, {
      method: "GET",
      headers: headersData,
    })
      .then((response) => response.json())
      .then((result) => {
        return resolve({ result });
      })
      .catch((error) => rejects({ error }));
  });
};
export const verifyAnswer = async (payload: any) => {
  const headersData: any = getHeader();
  return new Promise((resolve, rejects) => {
    fetch(getApiEndPoint("verifySecurityQuestion"), {
      method: "POST",
      headers: headersData,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        return resolve({ result });
      })
      .catch((error) => rejects({ error }));
  });
};
