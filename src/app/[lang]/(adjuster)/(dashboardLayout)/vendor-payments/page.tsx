import VendorPayments from "@/container/_adjuster_container/PaymentsContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { PayementsTranslateType } from "@/translations/PayementsTranslate/en";

export interface PayementTranslateProp {
  PayementsTranslate: PayementsTranslateType;
}

export default async function adjusterDashboard({
  params,
}: {
  params: { lang: Locale };
}) {
  const translate = await getTranslateList<PayementTranslateProp>(params.lang, [
    "PayementsTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <VendorPayments />;
      </TranslateWrapper>
    </Suspense>
  );
}
