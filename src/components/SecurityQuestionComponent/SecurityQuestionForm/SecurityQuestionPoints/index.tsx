import React from "react";
import securityQuestionPointsStyle from "./securityQuestionPoints.module.scss";
import { securityQuestionTranslateType } from "@/translations/securityQuestionTranslate/en";

function SecurityQuestionPoints({
  translate,
}: {
  translate: securityQuestionTranslateType | undefined;
}) {
  return (
    <div className={securityQuestionPointsStyle.securityQuestionPointsContainer}>
      <ul className={securityQuestionPointsStyle.validationList}>
        {translate?.validatePoints?.points?.map((point, i) => (
          <li key={`point-${i}`}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default SecurityQuestionPoints;
