import React from "react";
import validationContainerStyle from "./passwordValidationCondition.module.scss";
import { securityTranslateType } from "@/translations/securityTranslate/en";

function PasswordValidationCondition({
  translate,
}: {
  translate: securityTranslateType | undefined;
}) {
  return (
    <div className={validationContainerStyle.pwdValidationContainer}>
      <p>{translate?.validatePoints?.validateHeading}</p>
      <ul className={validationContainerStyle.validationList}>
        {translate?.validatePoints?.points?.map((point, i) => (
          <li key={`point-${i}`}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordValidationCondition;
