import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { vendorAssignmentTranslateType } from "@/translations/vendorAssignmentTranslate/en";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";
import ViewQuoteContainer from "@/container/_adjuster_container/ViewQuoteContainer";

export interface vendorAssignmentTranslatePropType {
  vendorAssignmentTranslate: vendorAssignmentTranslateType;
}

export default async function QuoteView({
  params,
}: {
  params: { quoteId: string; lang: Locale };
}) {
  const translate = await getTranslateList<vendorAssignmentTranslatePropType>(
    params.lang,
    ["vendorAssignmentTranslate"]
  );

  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <ViewQuoteContainer quoteId={params.quoteId} />
      </TranslateWrapper>
    </Suspense>
  );
}
