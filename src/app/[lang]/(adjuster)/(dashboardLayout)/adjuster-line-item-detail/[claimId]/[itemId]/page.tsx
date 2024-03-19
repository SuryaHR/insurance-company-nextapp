import React from "react";
import AdjusterLineItemDetailContainer from "@/container/_adjuster_container/AdjusterLineItemDetailContainer";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { Locale } from "@/i18n.config";
import { lineItemTranslateType } from "@/translations/lineItemTranslate/en";
import { breadCrumbTranslateType } from "@/translations/breadCrumbTranslate/en";
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
      <AdjusterLineItemDetailContainer />;
    </TranslateWrapper>
  );
}

export default ItemDetail;
