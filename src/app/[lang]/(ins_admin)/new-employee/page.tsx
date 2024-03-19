import NewEmployContainer from "@/container/_ins_admin_container/NewEmployContainer";
import { Suspense } from "react";
import Loading from "@/app/[lang]/loading";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";
import { addNewEmployeeTranslateType } from "@/translations/addNewEmployeeTranslate/en";
export interface newEmployeeTranslatePropType {
  addNewEmployeeTranslate: addNewEmployeeTranslateType;
}

export default async function NewEmployee({
  params,
}: {
  params: { companyId: any; lang: Locale };
}) {
  const translate = await getTranslateList<newEmployeeTranslatePropType>(params.lang, [
    "addNewEmployeeTranslate",
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <NewEmployContainer />
      </TranslateWrapper>
    </Suspense>
  );
}
