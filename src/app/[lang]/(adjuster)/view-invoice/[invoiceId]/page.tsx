import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { vendorAssignmentTranslateType } from "@/translations/vendorAssignmentTranslate/en";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";
import ViewInvoiceContainer from "@/container/_adjuster_container/ViewInvoiceContainer";

export interface vendorAssignmentTranslatePropType {
  vendorAssignmentTranslate: vendorAssignmentTranslateType;
}

export default async function InvoiceView({
  params,
}: {
  params: { invoiceId: string; lang: Locale };
}) {
  const translate = await getTranslateList<vendorAssignmentTranslatePropType>(
    params.lang,
    ["claimDetailsTabTranslate"]
  );

  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <ViewInvoiceContainer invoiceId={params.invoiceId} />
      </TranslateWrapper>
    </Suspense>
  );
}
