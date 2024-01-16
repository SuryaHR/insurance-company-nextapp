import { Locale, i18n } from "@/i18n.config";
import { translatePageType } from "./translationStore";

const translate = {
  en: (path: string) =>
    import(`@/translations/${path}/en`).then((module) => {
      return module.translate;
    }),
  nl: (path: string) =>
    import(`@/translations/${path}/nl`).then((module) => {
      return module.translate;
    }),
};

//for server side
export const getTranslate = async (locale: Locale, path: translatePageType) =>
  translate[locale]?.(path) ?? translate[i18n.defaultLocale](path);
