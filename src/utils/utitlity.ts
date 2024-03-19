import { unknownObjectType } from "@/constants/customTypes";

async function getServerCookie(cname: string) {
  const lib = import("next/headers");
  const { cookies } = await lib;
  const cookieStore = cookies();
  if (cookieStore.has(cname)) {
    const cookie = cookieStore.get(cname)?.value ?? null;
    return cookie;
  }
  return null;
}

function getClientCookie(cname: string): string | null {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

const getUSDCurrency = (value: number) => {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
  return currency;
};

const parseFloatWithFixedDecimal = function (number: string | number) {
  number = Number(number);
  if (!Number.isNaN(number)) return Math.round((number + Number.EPSILON) * 100) / 100;
  else return 0;
};

const getFileExtension = (file: File) => {
  const fileExtension = `.${file.name.split(".").pop()}`;
  return fileExtension;
};

type parseTranslateStringInterface<T> = {
  parseString: string;
  replaceMapper: T;
};

const parseTranslateString = <T extends unknownObjectType>({
  parseString,
  replaceMapper,
}: parseTranslateStringInterface<T>) => {
  return Object.keys(replaceMapper).reduce((acc, item) => {
    return acc.replace(`{{${item}}}`, replaceMapper[item]);
  }, parseString);
};

const downloadFileFromUrl = async (url: string) => {
  const response = await fetch(url);

  const blobImage = await response.blob();

  const href = URL.createObjectURL(blobImage);

  const anchorElement = document.createElement("a");
  anchorElement.href = href;
  anchorElement.download = url?.split("/").pop() ?? "";

  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);
  window.URL.revokeObjectURL(href);
};

const getLocalFileUrl = (file: File) => {
  if (!file) return "";
  return URL.createObjectURL(file);
};

const phoneFormatHandler = (text: string) => {
  if (!text) {
    return { input: text, formattedInput: text };
  }
  let input = text.replace(/\D/g, "");
  let formattedInput = "";
  if (input.length > 0) {
    if (input.length < 4) {
      input = input.substring(0, 4);
      formattedInput = input.replace(/(\d+)/, "($1");
    } else if (input.length > 3 && input.length < 7) {
      input = input.substring(0, 6);
      formattedInput = input.replace(/(\d{3})(\d+)/, "($1)-$2");
    } else if (input.length > 6) {
      input = input.substring(0, 10);
      formattedInput = input.replace(/(\d{3})(\d{3})(\d+)/, "($1)-$2-$3");
    }
  }
  return { input, formattedInput };
};

const isValidPassword = (value: string) => {
  const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
  return regex.test(value);
};

export {
  getClientCookie,
  getServerCookie,
  getUSDCurrency,
  parseFloatWithFixedDecimal,
  getFileExtension,
  parseTranslateString,
  downloadFileFromUrl,
  getLocalFileUrl,
  phoneFormatHandler,
  isValidPassword,
};
