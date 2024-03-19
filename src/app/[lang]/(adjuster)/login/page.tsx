import LoginContainer from "@/container/_adjuster_container/LoginContainer";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { loginTranslateType } from "@/translations/loginTranslate/en";

export interface loginTranslatePropType {
  loginTranslate: loginTranslateType;
}

export default async function Login({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<loginTranslatePropType>(params.lang, [
    "loginTranslate",
  ]);

  return (
    <TranslateWrapper translate={translate}>
      <LoginContainer translate={translate} />
    </TranslateWrapper>
  );
}
