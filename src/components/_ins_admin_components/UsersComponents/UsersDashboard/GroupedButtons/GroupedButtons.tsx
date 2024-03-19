import GenericButton from "@/components/common/GenericButton";
import React, { useContext } from "react";
import styles from "./groupedButtons.module.scss";
import { TranslateContext, TranslateContextData } from "@/store/TranslateWrapper";
import { usersTranslateTranslatePropsType } from "@/app/[lang]/(ins_admin)/users/page";
import GenericNormalInput from "@/components/common/GenericInput/GenericNormalInput";

interface propType {
  handleNewUserClick: () => void;
}

function GroupedButtons(props: propType) {
  const { translate } =
    useContext<TranslateContextData<usersTranslateTranslatePropsType>>(TranslateContext);
  const { handleNewUserClick } = props;
  return (
    <div className={styles.root}>
      <div className={styles.groupBtnContainer}>
        <GenericButton
          label={translate.usersListTranslate?.addNewUser}
          tableBtn
          onClickHandler={handleNewUserClick}
        />
        <GenericButton label={translate.usersListTranslate?.loadFromFile} tableBtn />
        <GenericButton label={translate.usersListTranslate?.export} tableBtn />
      </div>
      <div className={styles.searchContainer}>
        <GenericNormalInput placeholder="Name, EmailId, Role..." />
      </div>
    </div>
  );
}

export default GroupedButtons;
