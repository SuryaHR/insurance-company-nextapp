import React, { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import NewclaimsContainer from "@/container/_adjuster_container/NewClaimsContainer/index";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { newClaimTransalateType } from "@/translations/newClaimTransalate/en";
import { addItemModalTranslateType } from "@/translations/addItemModalTranslate/en";

export interface newClaimTransalateProp {
  newClaimTransalate: newClaimTransalateType;
  addItemModalTranslate: addItemModalTranslateType;
}

export default async function NewClaims({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<newClaimTransalateProp>(params.lang, [
    "newClaimTransalate",
    "addItemModalTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <NewclaimsContainer />;
      </TranslateWrapper>
    </Suspense>
  );
}
