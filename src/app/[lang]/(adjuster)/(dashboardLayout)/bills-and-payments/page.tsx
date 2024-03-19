import VendorInvoices from "@/container/_adjuster_container/VendorInvoicesContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { InvoiceTranslateType } from "@/translations/InvoiceTranslate/en";

export interface InvoiceTranslateProp {
  InvoiceTranslate: InvoiceTranslateType;
}

export default async function adjusterDashboard({
  params,
}: {
  params: { lang: Locale };
}) {
  const translate = await getTranslateList<InvoiceTranslateProp>(params.lang, [
    "InvoiceTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <VendorInvoices />;
      </TranslateWrapper>
    </Suspense>
  );
}
