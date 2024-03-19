import React from "react";
import securityQuestionPointsStyle from "./securityQuestionPoints.module.scss";
import { securityQuestionTranslatePropType } from "@/app/[lang]/(adjuster)/(password)/security-question/page";

function SecurityQuestionPoints({
  translate,
}: {
  translate: securityQuestionTranslatePropType;
}) {
  return (
    <div className={securityQuestionPointsStyle.securityQuestionPointsContainer}>
      <ul className={securityQuestionPointsStyle.validationList}>
        {translate?.securityQuestionTranslate?.validatePoints?.points?.map((point, i) => (
          <li key={`point-${i}`}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default SecurityQuestionPoints;
