import AesUtil from "./AESUtil";
import { lib, enc } from "crypto-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import RoleListConstants from "@/constants/RoleListContants";

dayjs.extend(utc);
dayjs.extend(tz);

export const getCipherEncryptedText = (text: string | lib.WordArray) => {
  const aesUtil = new AesUtil(128, 1000);
  const iv = lib.WordArray.random(128 / 8).toString(enc.Hex);
  const salt = lib.WordArray.random(128 / 8).toString(enc.Hex);
  const passPhrase = lib.WordArray.random(128 / 8).toString(enc.Hex);
  if (text != null || text != "") {
    return (
      iv +
      "::" +
      aesUtil.encrypt(salt, iv, passPhrase, text) +
      "::" +
      salt +
      "::" +
      passPhrase
    );
  }
};

const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");
  cookies.map((cookie) => {
    document.cookie = cookie + "=; expires=" + new Date(0).toUTCString();
  });
};

export const logoutHandler = () => {
  localStorage.clear();
  deleteAllCookies();
};

export const convertToCurrentTimezone = (
  unixDate: number | string,
  dateFormat = "MM/DD/YYYY h:mm A"
) => {
  if (typeof unixDate === "string" && unixDate.includes("T")) {
    const dateVal = unixDate.replace("T", " ");
    const parsedDate = Date.parse(dateVal);
    return dayjs(parsedDate).utc(true).format(dateFormat);
  }
  return dayjs(unixDate).utc(true).format(dateFormat);
};

export const getRoleBasedUrlList = (role: string) => {
  const rolesObj = RoleListConstants();
  // console.log("roleList", rolesObj?.RoleList);

  const roles = rolesObj?.RoleList?.filter((rolesArray) =>
    rolesArray.Roles.includes(role)
  );
  if (roles?.length > 0) {
    const screenList = roles[0];
    // console.log("screenList", screenList);

    return screenList;
  }
  return null;
};

// this function capitalize first character on each word in a string
export const capitalize = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};
