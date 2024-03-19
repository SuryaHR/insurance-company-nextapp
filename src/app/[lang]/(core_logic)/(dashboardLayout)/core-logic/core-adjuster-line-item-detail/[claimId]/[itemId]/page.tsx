import React from "react";
import CoreAdjusterLineItemDetailContainer from "@/container/_core_logic_container/CoreAdjusterLineItemDetailContainer";
import { lineItemTranslateType } from "@/translations/lineItemTranslate/en";
import { breadCrumbTranslateType } from "@/translations/breadCrumbTranslate/en";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { Locale } from "@/i18n.config";
import { claimDetailsTabTranslateType } from "@/translations/claimDetailsTabTranslate/en";

export interface lineItemTranslatePropType {
  lineItemTranslate: lineItemTranslateType;
  breadCrumbTranslate: breadCrumbTranslateType;
  claimDetailsTabTranslate: claimDetailsTabTranslateType;
}
async function ItemDetail({
  params,
}: {
  params: { itemId: string; claimId: string; lang: Locale };
}) {
  const translate = await getTranslateList<lineItemTranslatePropType>(params.lang, [
    "lineItemTranslate",
    "breadCrumbTranslate",
    "claimDetailsTabTranslate",
  ]);

  return (
    <TranslateWrapper translate={translate}>
      <CoreAdjusterLineItemDetailContainer />;
    </TranslateWrapper>
  );
}

export default ItemDetail;
