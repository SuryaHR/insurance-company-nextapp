// import { cookies } from "next/headers";
// export const getHeader = () => {
//   return {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//       "X-Auth-Token": sessionStorage.getItem("accessToken"),
//       "X-originator": sessionStorage.getItem("Xoriginator"),
//       "Time-Zone": Intl.DateTimeFormat().resolvedOptions().timeZone
//   }
// };
export const getHeader = () => {
  // const cookieStore = cookies();
  console.log("cookies", document.cookie);

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Auth-Token": window.localStorage.getItem("accessToken"),
    "X-originator": process.env.NEXT_PUBLIC_XORIGINATOR,
    "Time-Zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

// export const getFileHeader = () => {
//   return {
//       'Content-Type': undefined,
//       "X-Auth-Token": sessionStorage.getItem("AccessToken"),
//       "X-originator": sessionStorage.getItem("Xoriginator")
//   }
// };

// export const getCaptchHeaders = () => {
//   return {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//       "X-Auth-Token": sessionStorage.getItem("AccessToken"),
//       "X-originator": sessionStorage.getItem("Xoriginator"),
//       "Pragma": 'no-cache'
//   }
// };

export const getHeaderWithoutToken = () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-originator": process.env.NEXT_PUBLIC_XORIGINATOR,
  };
};

// export const getHeaderWithoutTokenAndOriginator = () => {
//   return {
//       "Content-Type": "application/json",
//       "Accept": "application/json"
//   }
// };

// export const getInsuranceCarrier = () => {
//   var insuranceCarrier = sessionStorage.getItem("insuranceCarrier");
//   return insuranceCarrier;
// };

// export const getApiURL = () => {
//   var apiurl = sessionStorage.getItem("apiurl");
//   return apiurl;
// };

// export const getAdminApiURL = () => {
//   var apiurl = sessionStorage.getItem("AdminApiurl");
//   return apiurl;
// };
// export const getReceiptURL = () => {
//   var receipturl = sessionStorage.getItem("receipturl");
//   return receipturl;
// };
// export const getExportUrl = () => {
//   var ExportUrl = sessionStorage.getItem("ExportUrl");
//   return ExportUrl;

// };

// export const genericErrorMessage = () => {
//   return "An error has occurred due to the connection. Please try again later."
// };

// export const getSpeedCheckApiURL = () => {
//   var apiurl = sessionStorage.getItem("SpeedCheckApiurl");
//   return apiurl;
// };
