import React from "react";
import validationContainerStyle from "./passwordValidationCondition.module.scss";
import { securityTranslatePropType } from "@/app/[lang]/(adjuster)/(password)/security/page";

function PasswordValidationCondition({
  translate,
}: {
  translate: securityTranslatePropType;
}) {
  return (
    <div className={validationContainerStyle.pwdValidationContainer}>
      <p>{translate?.securityTranslate?.validatePoints?.validateHeading}</p>
      <ul className={validationContainerStyle.validationList}>
        {translate?.securityTranslate?.validatePoints?.points?.map((point, i) => (
          <li key={`point-${i}`}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordValidationCondition;
