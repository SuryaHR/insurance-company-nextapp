import { Locale } from "@/i18n.config";
import AdjusterGlobalSearchContainer from "@/container/_adjuster_container/AdjusterGlobalSearchContainer";
import { adjusterGlobalSearchTranslateType } from "@/translations/adjusterGlobalSearchTranslate/en";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";

export interface adjusterGlobalSearchTranslatePropsType {
  adjusterGlobalSearchTranslate: adjusterGlobalSearchTranslateType;
}
export default async function Page({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<adjusterGlobalSearchTranslatePropsType>(
    params.lang,
    ["adjusterGlobalSearchTranslate"]
  );

  return (
    <TranslateWrapper translate={translate}>
      <AdjusterGlobalSearchContainer />
    </TranslateWrapper>
  );
}
