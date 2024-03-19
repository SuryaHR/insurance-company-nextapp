import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { uploadItemFromCsvTranslateType } from "@/translations/uploadItemFromCsvTranslate/en";
import CoreUploadItemsFromCsvContainer from "@/container/_core_logic_container/CoreUploadItemsFromCsvContainer";

export interface uploadItemFromCsvTranslatePropType {
  uploadItemFromCsvTranslate: uploadItemFromCsvTranslateType;
}

export default async function Page({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<uploadItemFromCsvTranslatePropType>(
    params.lang,
    ["uploadItemFromCsvTranslate"]
  );

  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <CoreUploadItemsFromCsvContainer />
      </TranslateWrapper>
    </Suspense>
  );
}
