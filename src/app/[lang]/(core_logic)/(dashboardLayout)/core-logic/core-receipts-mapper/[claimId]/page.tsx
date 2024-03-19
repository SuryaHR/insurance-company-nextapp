import React from "react";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { receiptMapperTranslateType } from "@/translations/receiptMapperTranslate/en";
import CoreReceiptMapperContainer from "@/container/_core_logic_container/CoreReceiptMapperContainer";

export interface receiptMapperTranslatePropType {
  receiptMapperTranslate: receiptMapperTranslateType;
}

async function ReceiptMapper({ params }: { params: { claimId: string; lang: Locale } }) {
  const translate = await getTranslateList<receiptMapperTranslatePropType>(params.lang, [
    "receiptMapperTranslate",
  ]);
  const { claimId } = params;
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <CoreReceiptMapperContainer claimId={claimId} />
      </TranslateWrapper>
    </Suspense>
  );
}

export default ReceiptMapper;
