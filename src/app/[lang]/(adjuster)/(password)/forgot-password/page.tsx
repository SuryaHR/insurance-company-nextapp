import ForgotPasswordContainer from "@/container/_adjuster_container/PasswordContainer/ForgotPasswordContainer";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { forgotPwdTranslateType } from "@/translations/forgotPasswordTranslate/en";

export interface forgotPwdTranslatePropType {
  forgotPasswordTranslate: forgotPwdTranslateType;
}

async function ForgotPassword({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<forgotPwdTranslatePropType>(params.lang, [
    "forgotPasswordTranslate",
  ]);
  return (
    <TranslateWrapper translate={translate}>
      <ForgotPasswordContainer translate={translate} />
    </TranslateWrapper>
  );
}

export default ForgotPassword;
