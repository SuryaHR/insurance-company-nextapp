import UsersContainer from "@/container/_ins_admin_container/UsersContainer";
import React, { Suspense } from "react";
import { usersListTranslateType } from "@/translations/usersListTranslate/en";
import { getTranslateList } from "@/translations";
import TranslateWrapper from "@/store/TranslateWrapper";
import { Locale } from "@/i18n.config";
import Loading from "../../loading";

export interface usersTranslateTranslatePropsType {
  usersListTranslate: usersListTranslateType;
}

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const translate = await getTranslateList<usersTranslateTranslatePropsType>(
    params.lang,
    ["usersListTranslate"]
  );
  return (
    <Suspense fallback={<Loading />}>
      <TranslateWrapper translate={translate}>
        <UsersContainer />
      </TranslateWrapper>
    </Suspense>
  );
};

export default Page;
