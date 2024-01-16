import { Locale, i18n } from "@/i18n.config";
import { cookies } from "next/headers";
import { translatePageType } from "./translationStore";
import { getTranslate } from ".";

async function getServerTranslation(path: translatePageType) {
  const cookieStore = cookies();
  let locale: Locale = i18n.defaultLocale;

  if (cookieStore.has("lang")) {
    // @ts-expect-error Type 'undefined' is not assignable to type
    const { value }: { value: Locale } = await cookieStore.get("lang");
    locale = value;
  }
  const data = await getTranslate(locale, path);
  return data;
}

export default getServerTranslation;
