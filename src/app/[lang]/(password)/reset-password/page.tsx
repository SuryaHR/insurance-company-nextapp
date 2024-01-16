import ResetPasswordContainer from "@/container/PasswordContainer/ResetPasswordContainer";
import React from "react";
import { Locale } from "@/i18n.config";

function ResetPassword({ params }: { params: { lang: Locale } }) {
  return <ResetPasswordContainer lang={params?.lang} />;
}

export default ResetPassword;
