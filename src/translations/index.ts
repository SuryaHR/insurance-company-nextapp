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

export const getTranslateList = async <T extends object>(
  locale: Locale,
  pathList: translatePageType[]
) => {
  const translateData = await Promise.all(
    pathList?.map((path) => {
      return new Promise((resolve) => {
        const data = async (path: any) => {
          const res = await (translate[locale]?.(path) ??
            translate[i18n.defaultLocale](path));
          return { [path]: res };
        };
        resolve(data(path));
      });
    })
  );
  const res: T = Object.assign({}, ...translateData);
  return res;
};
