import CompanyEditContainer from "@/container/_ins_admin_container/CompanyEditContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";
import { editCompanyTranslateType } from "@/translations/editCompanyTranslate/en";
export interface editCompanyTranslatePropType {
  editCompanyTranslate: editCompanyTranslateType;
}

export default async function EditCompany({
  params,
}: {
  params: { officeId: any; lang: Locale };
}) {
  const translate = await getTranslateList<editCompanyTranslatePropType>(params.lang, [
    "editCompanyTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <CompanyEditContainer officeId={params.officeId} />
      </TranslateWrapper>
    </Suspense>
  );
}
