import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";
import { InsAdminOfficeTranslateType } from "@/translations/InsAdminOfficeTranslate/en";
import InsAdminComapnyDashboardContainer from "@/container/_ins_admin_container/InsAdminComapnyDashboardContainer";

export interface InsAdminOfficeTranslatePropType {
  InsAdminOfficeTranslate: InsAdminOfficeTranslateType;
}

export default async function InsAdminCompany({
  params,
}: {
  params: { claimId: string; lang: Locale };
}) {
  const translate = await getTranslateList<InsAdminOfficeTranslatePropType>(params.lang, [
    "InsAdminOfficeTranslate",
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <InsAdminComapnyDashboardContainer />
      </TranslateWrapper>
    </Suspense>
  );
}
