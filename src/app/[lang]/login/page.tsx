import LoginContainer from "@/container/LoginContainer";
import { Locale } from "@/i18n.config";

export default async function Login({ params }: { params: { lang: Locale } }) {
  return <LoginContainer lang={params.lang} />;
}
