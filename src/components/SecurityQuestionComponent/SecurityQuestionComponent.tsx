import React from "react";
import SecurityQuestionForm from "./SecurityQuestionForm";
import { fetchSecurityQuestions } from "@/services/MyProfileService";

type objectTyped = {
  [key: string]: any;
};

async function SecurityQuestionComponent() {
  const res = await fetchSecurityQuestions();
  const { data = [] } = res;

  let selectOptions = [];
  if (data) {
    selectOptions = data?.map((option: objectTyped) => ({
      value: option.id,
      label: option.questionName,
    }));
  }

  return (
    <div className="col-md-6">
      <SecurityQuestionForm selectOptions={selectOptions} />
    </div>
  );
}

export default SecurityQuestionComponent;
