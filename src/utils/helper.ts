import AesUtil from "./AESUtil";
import { lib, enc } from "crypto-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import RoleListConstants from "@/constants/RoleListContants";

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(quarterOfYear);

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
  if (unixDate == undefined || unixDate == null || unixDate == "") {
    return "";
  }
  if (
    typeof unixDate === "string" &&
    unixDate.includes("T") &&
    !unixDate.includes("GMT")
  ) {
    const dateVal = unixDate.replace("T", " ");
    const parsedDate = Date.parse(dateVal);
    return dayjs(parsedDate).utc(true).format(dateFormat);
  }
  return dayjs(unixDate).utc(true).format(dateFormat);
};

export const getRoleBasedUrlList = (role: string) => {
  const rolesObj = RoleListConstants();

  const roles = rolesObj?.RoleList?.filter((rolesArray) =>
    rolesArray.Roles.includes(role)
  );
  if (roles?.length > 0) {
    const screenList = roles[0];

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

export const getCurrentQuarter = () => {
  let quarter;
  switch (dayjs().quarter()) {
    case 1:
      quarter = "Jan - Mar";
      break;
    case 2:
      quarter = "Apr - Jun";
      break;
    case 3:
      quarter = "Jul - Sep";
      break;
    case 4:
      quarter = "Oct - Dec";
      break;
  }
  return quarter;
};

export const getCurrentYear = () => {
  return dayjs().get("year");
};

export const getRandomColor = () => {
  const colors = [
    "#C9F1FD",
    "#FFEBCD",
    "#3BB9FF",
    "#f7bec5",
    "#bdb9f7",
    "#85f7cb",
    "#f4d28d",
    "#f78a74",
    "#abef97",
    "#f9f17a",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
