// import { getHeaderWithoutToken, getHeader } from "@/utils/HeaderService";
// import { getHeader } from "@/utils/HeaderService";
import { getApiEndPoint } from "./ApiEndPointConfig";
import HttpService from "@/HttpService";

// export const fetchSecurityQuestions = (token: string) => {
//   const headersData: {} = getHeaderWithoutToken();
//   // const headersData: {} = getHeader();
//   return new Promise((resolve, rejects) => {
//     fetch(getApiEndPoint("securityQuestion"), {
//       method: "GET",
//       headers: { ...headersData, "X-Auth-Token": token },
//       // headers: headersData
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         const { data } = result;
//         return resolve({ data });
//       })
//       .catch((error) => rejects({ error }));
//   });
// };

interface objectType {
  [key: string | number]: any;
}

export const fetchSecurityQuestions = async (): Promise<objectType> => {
  const url = getApiEndPoint("securityQuestion");
  const http = new HttpService();
  const res = await http.get(url);
  return res;
};

export const changePassword = async (payload: any) => {
  const url = getApiEndPoint("changePassword");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, payload);
  return res;
};
export const saveSecurityQuestion = async (payload: any) => {
  const url = getApiEndPoint("saveSecurityQuestion");
  const http = new HttpService({ isClient: true });
  const res = await http.post(url, payload);
  return res;
};

// export const changePassword = async (payload: any) => {
//   const headersData: object = getHeader();
//   return new Promise((resolve, rejects) => {
//     fetch(getApiEndPoint("changePassword"), {
//       method: "POST",
//       headers: headersData,
//       body: JSON.stringify(payload),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         return resolve({ result });
//       })
//       .catch((error) => rejects({ error }));
//   });
// };

// export const saveSecurityQuestion = async (payload: any) => {
//   const headersData: object = getHeader();
//   return new Promise((resolve, rejects) => {
//     fetch(getApiEndPoint("saveSecurityQuestion"), {
//       method: "POST",
//       headers: headersData,
//       body: JSON.stringify(payload),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         return resolve({ result });
//       })
//       .catch((error) => rejects({ error }));
//   });
// };
