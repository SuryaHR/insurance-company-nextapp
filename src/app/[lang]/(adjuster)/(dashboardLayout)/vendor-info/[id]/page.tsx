import VendorInfoContainer from "@/container/_adjuster_container/VendorInfoContainer";
import { Locale } from "@/i18n.config";
import TranslateWrapper from "@/store/TranslateWrapper";
import { getTranslateList } from "@/translations";
import { breadCrumbTranslateType } from "@/translations/breadCrumbTranslate/en";
import { vendorInfoTranslateType } from "@/translations/vendorInfoTranslate/en";
import React from "react";

export interface vendorInfoPropType {
  breadCrumbTranslate: breadCrumbTranslateType;
  vendorInfoTranslate: vendorInfoTranslateType;
}

async function page({ params }: { params: { lang: Locale } }) {
  const translate = await getTranslateList<vendorInfoPropType>(params.lang, [
    "breadCrumbTranslate",
    "vendorInfoTranslate",
  ]);

  return (
    <TranslateWrapper translate={translate}>
      <VendorInfoContainer translate={translate} />
    </TranslateWrapper>
  );
}

export default page;
