import ForgotPasswordContainer from "@/container/PasswordContainer/ForgotPasswordContainer";
import { Locale } from "@/i18n.config";

function ForgotPassword({ params }: { params: { lang: Locale } }) {
  return <ForgotPasswordContainer lang={params.lang} />;
}

export default ForgotPassword;
