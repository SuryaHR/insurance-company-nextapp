import SecurityContainer from "@/container/PasswordContainer/SecurityContainer";
import { Locale } from "@/i18n.config";
import React from "react";

function Security({ params }: { params: { lang: Locale } }) {
  return <SecurityContainer lang={params.lang} />;
}

export default Security;
