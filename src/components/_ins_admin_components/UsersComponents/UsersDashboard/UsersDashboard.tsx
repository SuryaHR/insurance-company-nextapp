import GenericComponentHeading from "@/components/common/GenericComponentHeading";
import React, { useContext } from "react";
import GroupedButtons from "./GroupedButtons";
import styles from "./usersDashboard.module.scss";
import UsersListTable from "./UsersListTable";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { usersTranslateTranslatePropsType } from "@/app/[lang]/(ins_admin)/users/page";

interface propType {
  onAddNewUser: () => void;
}
function UsersDashboard(props: propType) {
  const { onAddNewUser } = props;
  const { translate } =
    useContext<TranslateContextData<usersTranslateTranslatePropsType>>(TranslateContext);
  return (
    <div className={styles.root}>
      <GenericComponentHeading title={translate.usersListTranslate?.users} />
      <div className={styles.container}>
        <GroupedButtons handleNewUserClick={onAddNewUser} />
        <UsersListTable />
      </div>
    </div>
  );
}

export default UsersDashboard;
